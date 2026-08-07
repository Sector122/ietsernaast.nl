"use client";
import { useState } from "react";
import { USERNAME_RE, MIN_PASSWORD_LENGTH } from "@/lib/admin/validation";

export default function LoginForm({ setup }: { setup: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (setup) {
      if (!USERNAME_RE.test(username.trim())) {
        setError("Username: 3–32 chars, letters/digits/._- only.");
        return;
      }
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
        return;
      }
    } else if (!username.trim() || !password) {
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch(setup ? "/api/admin/setup" : "/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (res.ok) {
        const { role } = (await res.json()) as { role: string };
        window.location.href = role === "admin" ? "/admin" : "/admin/link";
        return;
      }
      setError(
        res.status === 401
          ? "Wrong username or password."
          : "Something went wrong. Try again.",
      );
    } catch {
      setError("Something went wrong. Try again.");
    }
    setSending(false);
  }

  return (
    <div className="adm-card adm-login">
      <h1>{setup ? "Create the first admin" : "Admin login"}</h1>
      {setup && (
        <p className="adm-hint">
          No users exist yet. This account will have the admin role.
        </p>
      )}
      <form onSubmit={onSubmit}>
        <input
          className="ob-input"
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="ob-input"
          type="password"
          autoComplete={setup ? "new-password" : "current-password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? "…" : setup ? "Create account" : "Log in"}
        </button>
        {error && <p className="ob-error">{error}</p>}
      </form>
    </div>
  );
}
