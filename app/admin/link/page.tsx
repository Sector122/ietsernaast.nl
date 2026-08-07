import LinkTool from "@/components/admin/LinkTool";
import { requireUser } from "@/lib/admin/auth";

export default async function AdminLinkPage() {
  await requireUser();
  return (
    <section>
      <header className="adm-head">
        <h1 className="adm-title">Generate onboarding link</h1>
        <p className="adm-sub">
          Paste a member&apos;s Telegram message to mint their signed
          onboarding link, or mint a fresh one without a message.
        </p>
      </header>
      <div className="adm-card">
        <LinkTool />
      </div>
    </section>
  );
}
