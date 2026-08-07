import UsersManager from "@/components/admin/UsersManager";
import { requireUser } from "@/lib/admin/auth";
import { listUsers } from "@/lib/admin/users";

export default async function AdminUsersPage() {
  const me = await requireUser("admin");
  const users = await listUsers();
  return (
    <section>
      <header className="adm-head">
        <h1 className="adm-title">Users</h1>
        <p className="adm-sub">
          Admin and support accounts for this dashboard. Support can only
          generate onboarding links.
        </p>
      </header>
      <UsersManager users={users} selfId={me.id} />
    </section>
  );
}
