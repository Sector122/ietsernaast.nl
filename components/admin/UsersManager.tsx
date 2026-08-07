"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser, Role } from "@/lib/admin/users";
import { USERNAME_RE, MIN_PASSWORD_LENGTH } from "@/lib/admin/validation";

const ERROR_TEXT: Record<string, string> = {
  username_taken: "That username is already taken.",
  weak_password: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  invalid_username: "Username: 3–32 chars, letters/digits/._- only.",
  last_admin: "Refused: that would leave no admin account.",
  unauthorized: "Your session expired. Log in again.",
};

function errorText(code: string): string {
  return ERROR_TEXT[code] ?? "Something went wrong. Try again.";
}

export default function UsersManager({
  users,
  selfId,
}: {
  users: AdminUser[];
  selfId: number;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("support");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function call(method: string, body: unknown): Promise<boolean> {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        router.refresh();
        return true;
      }
      const { error: code } = (await res.json()) as { error?: string };
      setError(errorText(code ?? ""));
    } catch {
      setError(errorText(""));
    } finally {
      setBusy(false);
    }
    return false;
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!USERNAME_RE.test(username.trim())) {
      setError(errorText("invalid_username"));
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(errorText("weak_password"));
      return;
    }
    if (await call("POST", { username: username.trim(), password, role })) {
      setUsername("");
      setPassword("");
      setRole("support");
    }
  }

  function onRoleChange(u: AdminUser, next: Role) {
    if (next === u.role) return;
    void call("PATCH", { id: u.id, role: next });
  }

  function onResetPassword(u: AdminUser) {
    const next = window.prompt(`New password for ${u.username} (min ${MIN_PASSWORD_LENGTH} chars):`);
    if (next === null) return;
    void call("PATCH", { id: u.id, password: next });
  }

  function onDelete(u: AdminUser) {
    if (!window.confirm(`Delete user ${u.username}? This cannot be undone.`)) return;
    void call("DELETE", { id: u.id });
  }

  return (
    <>
      <div className="adm-card adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created (UTC)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>
                  {u.username}
                  {u.id === selfId && <span className="adm-user"> (you)</span>}
                </td>
                <td>
                  <select
                    className="ob-input adm-role"
                    value={u.role}
                    disabled={busy}
                    onChange={(e) => onRoleChange(u, e.target.value as Role)}
                  >
                    <option value="admin">admin</option>
                    <option value="support">support</option>
                  </select>
                </td>
                <td>{new Date(u.created_at * 1000).toISOString().slice(0, 16).replace("T", " ")}</td>
                <td>
                  <span className="adm-actions">
                    <button
                      type="button"
                      className="adm-btn-sm"
                      disabled={busy}
                      onClick={() => onResetPassword(u)}
                    >
                      Reset password
                    </button>
                    <button
                      type="button"
                      className="adm-btn-sm adm-btn-danger"
                      disabled={busy}
                      onClick={() => onDelete(u)}
                    >
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="adm-title" style={{ marginTop: 26 }}>
        Add user
      </h2>
      <form className="adm-card adm-form-row" onSubmit={onCreate}>
        <input
          className="ob-input"
          placeholder="Username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="ob-input"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="ob-input"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="support">support</option>
          <option value="admin">admin</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          Add user
        </button>
      </form>
      {error && <p className="ob-error">{error}</p>}
    </>
  );
}
