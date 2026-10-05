import { HASHTAG, SITE_LINKS, SITE_URL } from "@/lib/campaign-config";

export function SiteFooter() {
  return (
    <footer className="border-t border-line print:hidden">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-10 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-bold text-ink-strong">SkinSense AI</span>, dự án Digital Marketing của nhóm sinh viên UEH. {HASHTAG}
        </p>
        <nav className="flex flex-wrap gap-5">
          <a href={SITE_URL} className="hover:text-ink-strong hover:underline">
            Trang chủ
          </a>
          <a href={SITE_LINKS.about} className="hover:text-ink-strong hover:underline">
            Về chúng tôi
          </a>
          <a href={SITE_LINKS.privacy} className="hover:text-ink-strong hover:underline">
            Quyền riêng tư
          </a>
        </nav>
      </div>
    </footer>
  );
}
