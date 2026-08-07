"use client";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/admin/users";

const InboxIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.5h16v13H4z" />
    <path d="M4 13h5c.5 2 1.6 3 3 3s2.5-1 3-3h5" />
  </svg>
);
const UsersIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19c1-2.8 3-4.2 5.5-4.2s4.5 1.4 5.5 4.2" />
    <path d="M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.9c1.6.7 2.6 2 3 4.1" />
  </svg>
);
const LinkIcon = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10.5 13.5 13.5 10.5" />
    <path d="M8.5 12 6.7 13.8a3.4 3.4 0 0 0 4.8 4.8l1.8-1.8M15.5 12l1.8-1.8a3.4 3.4 0 0 0-4.8-4.8L10.7 7.2" />
  </svg>
);
const PowerIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <path d="M12 3.5v8" />
    <path d="M7 6.2a7.5 7.5 0 1 0 10 0" />
  </svg>
);

const ITEMS = [
  { href: "/admin", label: "Submissions", icon: InboxIcon, adminOnly: true },
  { href: "/admin/users", label: "Users", icon: UsersIcon, adminOnly: true },
  { href: "/admin/link", label: "Generate link", icon: LinkIcon, adminOnly: false },
];

export default function AdminNav({
  role,
  username,
}: {
  role: Role;
  username: string;
}) {
  const pathname = usePathname();

  async function logout() {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch {
      /* cookie may survive, but the login page is still the right place */
    }
    window.location.href = "/admin/login";
  }

  return (
    <>
      <nav className="adm-nav" aria-label="Admin">
        <span className="adm-nav-label">Manage</span>
        {ITEMS.filter((i) => !i.adminOnly || role === "admin").map((i) => {
          const active =
            i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <a
              key={i.href}
              href={i.href}
              className={active ? "adm-nav-item is-active" : "adm-nav-item"}
              aria-current={active ? "page" : undefined}
            >
              {i.icon}
              {i.label}
            </a>
          );
        })}
      </nav>
      <div className="adm-side-foot">
        <span className="adm-avatar" aria-hidden="true">
          {username.charAt(0).toUpperCase()}
        </span>
        <span className="adm-side-user">
          <span className="adm-side-name">{username}</span>
          <span className={`adm-role-chip adm-role-${role}`}>{role}</span>
        </span>
        <button
          type="button"
          className="adm-logout"
          onClick={logout}
          aria-label="Log out"
          title="Log out"
        >
          {PowerIcon}
        </button>
      </div>
    </>
  );
}
