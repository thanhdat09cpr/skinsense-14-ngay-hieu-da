/**
 * Shared-calendar event tiles. These open by real date for everyone,
 * independent of each participant's own Day 1.
 */
import { CAMPAIGN_DATES } from "./campaign-config";

export type EventTileId = "womens-day" | "before-makeup" | "after-cleanse" | "after-24h";

export interface EventTile {
  id: EventTileId;
  title: string;
  /** Date shown on the tile. */
  dateLabel: string;
  opensOn: string;
  closesOn: string;
  intro: string;
  checklist: string[];
}

export const EVENT_TILES: EventTile[] = [
  {
    id: "womens-day",
    title: "Ô đặc biệt",
    dateLabel: "20/10",
    opensOn: CAMPAIGN_DATES.womensDay,
    closesOn: CAMPAIGN_DATES.womensDay,
    intro:
      "Chăm sóc bản thân không nhất thiết bắt đầu bằng việc mua thêm. Đôi khi là dành vài phút hiểu làn da mình.",
    checklist: [
      "Dành 3 phút nhìn da dưới ánh sáng tự nhiên",
      "Ghi một điều bạn thấy dễ chịu về làn da hôm nay",
    ],
  },
  {
    id: "before-makeup",
    title: "Trước khi makeup",
    dateLabel: "Halloween",
    opensOn: CAMPAIGN_DATES.halloweenStart,
    closesOn: CAMPAIGN_DATES.halloweenEnd,
    intro: "Ghi lại làn da ngay trước khi trang điểm hóa trang.",
    checklist: [
      "Chụp ảnh cùng chỗ, cùng giờ, cùng ánh sáng như mọi ngày",
      "Ghi 3 chỉ số: độ dầu, mụn, cảm giác da",
      "Ghi tên sản phẩm bạn định dùng",
    ],
  },
  {
    id: "after-cleanse",
    title: "Sau khi tẩy trang",
    dateLabel: "Halloween",
    opensOn: CAMPAIGN_DATES.halloweenStart,
    closesOn: CAMPAIGN_DATES.halloweenEnd,
    intro: "Ghi lại làn da ngay sau khi tẩy trang xong.",
    checklist: [
      "Chụp lại đúng điều kiện như ảnh trước khi makeup",
      "Ghi cảm giác da ngay lúc này",
      "Ghi sản phẩm tẩy trang đã dùng",
    ],
  },
  {
    id: "after-24h",
    title: "24 giờ sau",
    dateLabel: "Halloween",
    opensOn: CAMPAIGN_DATES.halloweenStart,
    closesOn: CAMPAIGN_DATES.halloweenEnd,
    intro: "Một ngày sau khi tẩy trang, ghi lại thêm một lần.",
    checklist: [
      "Chụp lại đúng điều kiện như hai lần trước",
      "Ghi 3 chỉ số: độ dầu, mụn, cảm giác da",
      "Đặt ba ảnh cạnh nhau và ghi một điều bạn nhận ra",
    ],
  },
];
