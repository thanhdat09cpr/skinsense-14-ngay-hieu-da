"use client";

/**
 * Single source of truth for the participant's challenge on this device.
 * Sections read it through useChallenge(); only consented data leaves the browser.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addDays, isIsoDate, localTodayIso } from "@/lib/date-utils";
import {
  activeEventTheme,
  currentDayNumber,
  isCheckpointDay,
  isFinalDay,
  startAvailability,
  tileView,
  type StartAvailability,
} from "@/lib/challenge-rules";
import {
  clearState,
  createEmptyState,
  loadState,
  saveState,
  type ChallengeState,
  type Consents,
  type DiaryEntry,
  type FinalSurvey,
} from "@/lib/challenge-storage";
import { buildDemoState } from "@/lib/demo-state";
import { clearPhotos } from "@/lib/photo-journal-store";
import { readUtmParams, sendToSheet, trackEvent } from "@/lib/tracking";
import { EVENT_TILES, type EventTileId } from "@/lib/event-tile-content";
import { eventTileOpen } from "@/lib/challenge-rules";

export type SheetTarget = { kind: "day"; day: number } | { kind: "event"; id: EventTileId } | null;

interface ChallengeContextValue {
  ready: boolean;
  today: string;
  isDemo: boolean;
  state: ChallengeState;
  availability: StartAvailability;
  /** Day number of today inside the run, or null before the participant starts. */
  currentDay: number | null;
  sheet: SheetTarget;
  guideMessage: { text: string; key: number } | null;
  startChallenge: () => void;
  openDay: (day: number) => void;
  openEvent: (id: EventTileId) => void;
  closeSheet: () => void;
  saveEntry: (day: number, entry: Omit<DiaryEntry, "savedAt">, dayOne?: ChallengeState["dayOneExtras"]) => void;
  submitJoin: (input: { name: string; email: string; consents: Consents }) => void;
  skipJoin: () => void;
  submitCheckpointSurvey: (useful: number, allowResearch: boolean) => void;
  submitFinalSurvey: (answers: FinalSurvey, allowResearch: boolean, allowShare: boolean) => void;
  submitEarlyAccess: (email: string) => void;
  toggleEventCheck: (id: EventTileId, item: string) => void;
  clearAll: () => void;
  say: (text: string) => void;
}

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function useChallenge(): ChallengeContextValue {
  const value = useContext(ChallengeContext);
  if (!value) throw new Error("useChallenge must be used inside <ChallengeProvider>");
  return value;
}

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [state, setState] = useState<ChallengeState>(createEmptyState);
  const [sheet, setSheet] = useState<SheetTarget>(null);
  const [guideMessage, setGuideMessage] = useState<ChallengeContextValue["guideMessage"]>(null);

  // Resolve ?today= / ?demo= and load the stored run once, on the client only.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const overrideToday = params.get("today");
    const resolvedToday = isIsoDate(overrideToday) ? overrideToday : localTodayIso();
    const demo = params.get("demo") === "1";
    const loaded = demo ? buildDemoState(resolvedToday) : loadState();
    const utm = readUtmParams(window.location.search);
    // Hydrating from browser-only sources has to happen after mount.
    /* eslint-disable react-hooks/set-state-in-effect */
    setToday(resolvedToday);
    setIsDemo(demo);
    setState(loaded.utm || !utm ? loaded : { ...loaded, utm });
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (ready && !isDemo) saveState(state);
  }, [ready, isDemo, state]);

  // Event themes (20/10, Halloween) recolour the whole campaign page.
  useEffect(() => {
    if (!ready) return;
    const root = document.querySelector("[data-campaign]");
    const theme = activeEventTheme(today);
    if (theme) root?.setAttribute("data-event", theme);
    else root?.removeAttribute("data-event");
  }, [ready, today]);

  const say = useCallback((text: string) => setGuideMessage({ text, key: Date.now() }), []);
  const availability = useMemo(() => startAvailability(today), [today]);
  const currentDay = state.startDate && today ? currentDayNumber(state.startDate, today) : null;

  const startChallenge = useCallback(() => {
    if (state.startDate) {
      setSheet({ kind: "day", day: Math.min(Math.max(currentDay ?? 1, 1), state.programLength ?? 14) });
      return;
    }
    const access = isDemo ? ({ kind: "open", programLength: 14, finishOn: addDays(today, 13) } as const) : availability;
    if (access.kind !== "open") return;
    setState((prev) => ({ ...prev, startDate: today, programLength: access.programLength }));
    if (state.joined && state.consents.email && !isDemo) {
      sendToSheet("join", state.participantId, "", {
        name: state.joined.name,
        email: state.joined.email,
        intent: "reminder",
        startDate: today,
        programLength: access.programLength,
        consents: state.consents,
      });
    }
    trackEvent("challenge_start", { program_length: access.programLength });
    setSheet({ kind: "day", day: 1 });
  }, [availability, currentDay, isDemo, state.consents, state.joined, state.participantId, state.programLength, state.startDate, today]);

  const openDay = useCallback(
    (day: number) => {
      if (!state.startDate) {
        if (day === 1) startChallenge();
        else say("Bấm Bắt đầu Ngày 1 trước nhé, các ô sẽ mở dần theo từng ngày.");
        return;
      }
      const view = tileView({
        day,
        startDate: state.startDate,
        today,
        isLogged: Boolean(state.entries[day]),
        unlockAll: isDemo,
      });
      if (view.status === "locked") return say(`Ô này ${view.unlockLabel?.toLowerCase()}. Hẹn bạn hôm đó nhé.`);
      if (view.status === "missed") return say("Ô này qua rồi. Không sao, mở ô hôm nay và ghi tiếp nhé.");
      trackEvent("tile_open", { day });
      setSheet({ kind: "day", day });
    },
    [isDemo, say, startChallenge, state.entries, state.startDate, today],
  );

  const openEvent = useCallback(
    (id: EventTileId) => {
      const tile = EVENT_TILES.find((item) => item.id === id);
      if (!tile) return;
      if (!eventTileOpen(tile, today, isDemo)) return say(`Ô "${tile.title}" mở vào dịp ${tile.dateLabel}. Hẹn bạn nhé.`);
      trackEvent("tile_open", { day: id });
      setSheet({ kind: "event", id });
    },
    [isDemo, say, today],
  );

  const saveEntry = useCallback<ChallengeContextValue["saveEntry"]>(
    (day, entry, dayOne) => {
      const length = state.programLength ?? 14;
      setState((prev) => ({
        ...prev,
        entries: { ...prev.entries, [day]: { ...entry, savedAt: today } },
        dayOneExtras: dayOne ?? prev.dayOneExtras,
      }));
      trackEvent("diary_logged", { day });
      if (isCheckpointDay(day, length)) trackEvent("day7_reached");
      if (isFinalDay(day, length)) trackEvent("day14_completed", { program_length: length });
      say(isFinalDay(day, length) ? "Bạn đi hết chặng rồi. Tự hào ghê!" : `Đã lưu Ngày ${day}. Mai gặp lại nhé.`);
    },
    [say, state.programLength, today],
  );

  const submitJoin = useCallback<ChallengeContextValue["submitJoin"]>(
    ({ name, email, consents }) => {
      const cleanEmail = email.trim();
      setState((prev) => ({
        ...prev,
        consents,
        joined: consents.email && cleanEmail ? { name: name.trim(), email: cleanEmail } : prev.joined,
        joinPromptHandled: true,
      }));
      if (consents.email && cleanEmail) {
        sendToSheet("join", state.participantId, "", {
          name: name.trim(),
          email: cleanEmail,
          intent: "reminder",
          startDate: state.startDate,
          programLength: state.programLength,
          consents,
        });
      }
      if (consents.survey && state.dayOneExtras) {
        sendToSheet("survey", state.surveyId, 1, { ...state.dayOneExtras, utm: state.utm, programLength: state.programLength });
      }
      trackEvent("join_submit", { email_consent: consents.email });
      say(consents.email ? "Đã nhận email. Mình sẽ nhắc bạn đúng hẹn." : "Đã lưu lựa chọn của bạn.");
    },
    [say, state.dayOneExtras, state.participantId, state.programLength, state.startDate, state.surveyId, state.utm],
  );

  const skipJoin = useCallback(() => setState((prev) => ({ ...prev, joinPromptHandled: true })), []);

  const submitCheckpointSurvey = useCallback<ChallengeContextValue["submitCheckpointSurvey"]>(
    (useful, allowResearch) => {
      setState((prev) => ({ ...prev, checkpointSurvey: { useful }, consents: { ...prev.consents, survey: allowResearch || prev.consents.survey } }));
      if (allowResearch) sendToSheet("survey", state.surveyId, 7, { useful });
      trackEvent("survey_submit", { day: 7 });
    },
    [state.surveyId],
  );

  const submitFinalSurvey = useCallback<ChallengeContextValue["submitFinalSurvey"]>(
    (answers, allowResearch, allowShare) => {
      const day = state.programLength ?? 14;
      setState((prev) => ({
        ...prev,
        finalSurvey: answers,
        consents: { ...prev.consents, survey: allowResearch || prev.consents.survey, share: allowShare || prev.consents.share },
      }));
      if (allowResearch) sendToSheet("survey", state.surveyId, day, { ...answers });
      if (allowShare && answers.learned.trim()) sendToSheet("share", state.surveyId, day, { text: answers.learned.trim() });
      trackEvent("survey_submit", { day });
    },
    [state.programLength, state.surveyId],
  );

  const submitEarlyAccess = useCallback(
    (email: string) => {
      sendToSheet("join", state.participantId, "", { email: email.trim(), intent: "early_access" });
      setState((prev) => ({ ...prev, earlyAccess: true }));
      say("Cảm ơn bạn. Khi có bản dùng thử, SkinSense sẽ báo bạn đầu tiên.");
    },
    [say, state.participantId],
  );

  const toggleEventCheck = useCallback((id: EventTileId, item: string) => {
    setState((prev) => {
      const done = prev.eventChecks[id] ?? [];
      const next = done.includes(item) ? done.filter((entry) => entry !== item) : [...done, item];
      return { ...prev, eventChecks: { ...prev.eventChecks, [id]: next } };
    });
  }, []);

  const clearAll = useCallback(() => {
    clearState();
    void clearPhotos();
    setState(createEmptyState());
    setSheet(null);
    say("Đã xóa sạch dữ liệu trên máy này.");
  }, [say]);

  const value: ChallengeContextValue = {
    ready,
    today,
    isDemo,
    state,
    availability,
    currentDay,
    sheet,
    guideMessage,
    startChallenge,
    openDay,
    openEvent,
    closeSheet: () => setSheet(null),
    saveEntry,
    submitJoin,
    skipJoin,
    submitCheckpointSurvey,
    submitFinalSurvey,
    submitEarlyAccess,
    toggleEventCheck,
    clearAll,
    say,
  };

  return <ChallengeContext.Provider value={value}>{children}</ChallengeContext.Provider>;
}
