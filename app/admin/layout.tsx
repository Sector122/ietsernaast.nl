import type { Metadata } from "next";
import BrandMark from "@/components/BrandMark";
import AdminNav from "@/components/admin/AdminNav";
import { sessionUser } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin | Sector1",
  robots: { index: false, follow: false },
};

// The shell here is cosmetic (sidebar hidden when logged out, nav trimmed per
// role) — the actual access control is requireUser() inside every page and
// apiUser() inside every route handler.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await sessionUser();

  if (!user) {
    return <div className="adm-solo">{children}</div>;
  }

  return (
    <div className="adm-shell">
      <aside className="adm-side">
        <a
          className="adm-side-brand"
          href={user.role === "admin" ? "/admin" : "/admin/link"}
        >
          <span className="brand-mark">
            <BrandMark size={26} />
          </span>
          <span className="adm-brand-name">
            <span>
              SECTOR<span className="brand-num">1</span>
            </span>
            <span className="adm-brand-sub">Admin</span>
          </span>
        </a>
        <AdminNav role={user.role} username={user.username} />
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
