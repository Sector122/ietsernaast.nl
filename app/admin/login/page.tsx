import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { sessionUser } from "@/lib/admin/auth";
import { countUsers } from "@/lib/admin/users";

export default async function AdminLoginPage() {
  const user = await sessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/admin/link");

  // Empty user table → first-run: the form creates the initial admin account
  // (the /api/admin/setup endpoint locks itself once any user exists).
  const setup = (await countUsers()) === 0;
  return <LoginForm setup={setup} />;
}
