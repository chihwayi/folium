import { asc, desc, inArray } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { staffInvitations, users } from "@/db/schema";
import { requireOwner } from "@/lib/auth/admin";
import { inviteStaff, updateUserRole } from "../actions";

export default async function StaffPage() {
  await requireOwner();
  const [members, invitations] = await Promise.all([
    db.select().from(users).where(inArray(users.role, ["staff", "owner"])).orderBy(asc(users.email)),
    db.select().from(staffInvitations).orderBy(desc(staffInvitations.createdAt)).limit(25),
  ]);
  return <><h1 className="font-serif text-4xl">Staff</h1><p className="mt-2 text-sm text-muted-foreground">Owner-only access and invitation management.</p><form action={inviteStaff} className="mt-8 flex flex-wrap gap-3 rounded-xl border bg-card p-5"><input className="h-10 min-w-64 rounded-md border px-3" name="email" type="email" placeholder="colleague@example.com" required/><select className="h-10 rounded-md border px-3" name="role"><option value="staff">Staff</option><option value="owner">Owner</option></select><Button>Invite</Button></form><div className="mt-6 divide-y rounded-xl border bg-card">{members.map(member => <form action={updateUserRole} key={member.id} className="flex items-center justify-between gap-4 p-5"><input type="hidden" name="id" value={member.id}/><div><p className="font-medium">{member.name ?? member.email}</p><p className="text-sm text-muted-foreground">{member.email}</p></div><div className="flex gap-2"><select className="h-9 rounded-md border px-2" name="role" defaultValue={member.role}><option value="customer">Customer</option><option value="staff">Staff</option><option value="owner">Owner</option></select><Button size="sm">Save</Button></div></form>)}</div><h2 className="mt-10 font-serif text-2xl">Pending invitations</h2><div className="mt-4 divide-y rounded-xl border bg-card">{invitations.map(invite => <div className="flex justify-between p-4 text-sm" key={invite.id}><span>{invite.email}</span><span className="text-muted-foreground">{invite.role} · expires {invite.expiresAt.toLocaleDateString()}</span></div>)}</div></>;
}
