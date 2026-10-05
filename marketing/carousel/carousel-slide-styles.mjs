/**
 * Styles for the 1080x1350 carousel slides. Colours are the landing's own tokens
 * (src/app/globals.css): deep-teal stage, cream text, yellow only for step
 * numbers, rings and the big kicker words. Pills are full-round, cards 28px.
 */
export const SLIDE_CSS = `
:root {
  --stage: #205860; --stage-deep: #163f45; --cream: #f6f6f0; --cream-soft: #cfe3e0;
  --yellow: #ffe45c; --on-yellow: #1f2e32; --bright: #8edbd2; --done: #2e9c94;
  --done-soft: #dcefeb; --accent: #0f766e; --ink-strong: #205860; --paper-raised: #fcfcf8;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: 1080px; height: 1350px; background: var(--stage); color: var(--cream);
  font-family: "Be Vietnam Pro", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
.slide { position: relative; width: 1080px; height: 1350px; overflow: hidden; isolation: isolate;
  background:
    radial-gradient(720px 640px at 76% 60%, rgba(142, 219, 210, 0.2), transparent 70%),
    radial-gradient(900px 720px at 0% 0%, rgba(46, 116, 124, 0.9), transparent 65%),
    linear-gradient(180deg, #23626b 0%, #205860 52%, #19484f 100%); }
.grid { position: absolute; inset: 0; z-index: -1;
  background-image: linear-gradient(rgba(246, 246, 240, 0.06) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(246, 246, 240, 0.06) 1.5px, transparent 1.5px);
  background-size: 60px 60px; background-position: 36px 36px;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 72%, transparent 100%); }

.top { position: absolute; top: 56px; left: 72px; right: 72px; display: flex; align-items: center; justify-content: space-between; }
.brand { display: inline-flex; align-items: center; gap: 12px; padding: 8px 24px 8px 8px; border-radius: 999px;
  background: var(--cream); color: var(--ink-strong); font-weight: 800; font-size: 25px; letter-spacing: -0.01em; }
.brand img { width: 46px; height: 46px; border-radius: 999px; }
.tag { font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: 22px; color: var(--bright); }

.foot { position: absolute; left: 72px; right: 72px; bottom: 50px; padding-top: 26px; display: flex; justify-content: space-between;
  border-top: 1.5px solid rgba(246, 246, 240, 0.18); font-weight: 600; font-size: 23px; }
.foot span { display: inline-flex; align-items: center; gap: 10px; }
.foot i { font-size: 30px; color: var(--bright); }

.yellow { color: var(--yellow); text-shadow: 0 6px 0 rgba(10, 38, 42, 0.45); }
.head { position: absolute; top: 150px; left: 72px; right: 72px; }
.kicker { font-weight: 900; font-size: 116px; line-height: 1; letter-spacing: -0.035em; }
.title { margin-top: 18px; max-width: 920px; font-weight: 800; font-size: 54px; line-height: 1.12; letter-spacing: -0.02em; text-wrap: balance; }

.body { position: absolute; top: 440px; left: 72px; right: 72px; bottom: 136px; }
.left { position: absolute; left: 0; top: 0; bottom: 0; width: 500px; display: flex; flex-direction: column; }
.steps { list-style: none; display: grid; gap: 28px; padding-top: 6px; }
.steps li { display: grid; grid-template-columns: 58px 1fr; gap: 20px; align-items: start; }
.num, .badge { display: grid; place-items: center; border-radius: 999px; background: var(--yellow); color: var(--on-yellow);
  font-weight: 900; box-shadow: 0 5px 0 rgba(10, 38, 42, 0.38); }
.num { width: 58px; height: 58px; font-size: 30px; }
.steps strong { display: block; padding-top: 7px; font-weight: 800; font-size: 32px; line-height: 1.2; letter-spacing: -0.01em; text-wrap: pretty; }
.steps span { display: block; margin-top: 8px; font-weight: 500; font-size: 24px; line-height: 1.4; color: var(--cream-soft); text-wrap: pretty; }
.pose-wrap { position: relative; flex: 1; min-height: 200px; }
.pose { position: absolute; bottom: 0; left: 50%; height: min(100%, 440px); transform: translateX(-50%);
  filter: drop-shadow(0 26px 28px rgba(5, 25, 28, 0.45)); }
.pose.flip { transform: translateX(-50%) scaleX(-1); }
.pose.start { left: 0; transform: none; }

.phone { position: absolute; right: 0; top: 0; width: 372px; padding: 14px; border-radius: 60px; background: #0d2427;
  box-shadow: inset 0 0 0 2px rgba(246, 246, 240, 0.14), 0 0 0 10px rgba(142, 219, 210, 0.08), 0 50px 90px rgba(5, 25, 28, 0.55); }
.screen { aspect-ratio: 390 / 844; border-radius: 46px; overflow: hidden; background: var(--cream); }
.screen img { display: block; width: 100%; height: 100%; }
.marks { position: absolute; inset: 14px; }
.ring { position: absolute; border: 4px solid var(--yellow); border-radius: 16px; box-shadow: 0 0 0 6px rgba(255, 228, 92, 0.25); }
.ring .badge { position: absolute; left: -38px; top: -34px; width: 46px; height: 46px; font-size: 25px; }

.story { position: absolute; left: 318px; bottom: 4px; width: 250px; transform: rotate(-7deg); z-index: 2; }
.story img { display: block; width: 100%; border-radius: 22px; box-shadow: 0 0 0 6px var(--cream), 0 36px 60px rgba(5, 25, 28, 0.5); }
.story .badge { position: absolute; left: -22px; top: -22px; width: 50px; height: 50px; font-size: 27px; }
.has-card .phone { right: -10px; }

.cover-head { position: absolute; top: 168px; left: 72px; right: 72px; }
.cover-head p { font-weight: 900; line-height: 1.02; letter-spacing: -0.035em; }
.word { font-size: 104px; }
.word.right { text-align: right; }
.hashtag { margin: 6px 0 4px; font-size: 128px; white-space: nowrap; overflow: hidden; color: var(--cream);
  text-shadow: 0 7px 0 var(--stage-deep), 0 22px 40px rgba(5, 25, 28, 0.35); }
.cover-pose { position: absolute; left: 50%; bottom: 196px; height: 640px; transform: translateX(-46%);
  filter: drop-shadow(0 30px 34px rgba(5, 25, 28, 0.5)); }
.tile { position: absolute; display: flex; flex-direction: column; justify-content: space-between; width: 150px; height: 150px; padding: 16px;
  border-radius: 28px; font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: 44px; line-height: 1;
  box-shadow: 0 24px 40px rgba(5, 25, 28, 0.35); }
.tile small { font-family: "Be Vietnam Pro", sans-serif; font-size: 20px; font-weight: 700; }
.tile.done { background: var(--done-soft); color: var(--ink-strong); }
.tile.done i { position: absolute; right: 14px; top: 14px; display: grid; place-items: center; width: 40px; height: 40px;
  border-radius: 999px; background: var(--done); color: #fff; font-size: 22px; }
.tile.plain { background: var(--paper-raised); color: var(--ink-strong); }
.tile.today { background: var(--accent); color: #fff; outline: 7px solid var(--yellow); outline-offset: 5px; }
.pills { position: absolute; left: 72px; right: 72px; bottom: 150px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
.pills span { padding: 12px 24px; border-radius: 999px; background: rgba(246, 246, 240, 0.12); border: 2px solid rgba(246, 246, 240, 0.32);
  font-weight: 700; font-size: 25px; }
.pills .swipe { display: grid; place-items: center; width: 74px; height: 74px; margin-left: auto; padding: 0; background: var(--yellow); border-color: var(--yellow);
  color: var(--on-yellow); font-size: 38px; box-shadow: 0 5px 0 rgba(10, 38, 42, 0.38); }

.qr-card { position: absolute; left: 72px; top: 428px; width: 548px; padding: 30px 30px 22px; border-radius: 28px; background: var(--cream);
  color: var(--ink-strong); text-align: center; box-shadow: 0 40px 80px rgba(5, 25, 28, 0.45); }
.qr svg { display: block; width: 100%; height: auto; }
.qr-card figcaption { margin-top: 18px; font-weight: 800; font-size: 32px; letter-spacing: -0.01em; }
.url { position: absolute; left: 72px; top: 1052px; font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: 25px; color: var(--cream); }
.close-pose { position: absolute; right: 50px; top: 470px; height: 500px; filter: drop-shadow(0 30px 34px rgba(5, 25, 28, 0.5)); }
.deadline { position: absolute; left: 72px; right: 72px; top: 1112px; display: grid; grid-template-columns: 64px 1fr; gap: 0 22px; }
.deadline i { grid-row: span 2; font-size: 60px; color: var(--yellow); }
.deadline strong { font-weight: 800; font-size: 36px; line-height: 1.2; letter-spacing: -0.015em; }
.deadline span { margin-top: 8px; font-weight: 500; font-size: 25px; line-height: 1.4; color: var(--cream-soft); }
`;
