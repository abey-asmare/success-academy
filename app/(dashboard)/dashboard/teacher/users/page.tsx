import { auth, clerkClient } from "@clerk/nextjs/server";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import {db} from "@/lib/db";
import { Stream, Referrer } from "@/prisma/app/generated/prisma/client";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "moderator" | "User";
  profile:{
    phone_number: string;
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    stream: Stream;
    university: string;
    referrer: Referrer | null;
  } | null
};

async function getAllUserDetails({
  search,
  limit = 10,
  offset = 0,
}: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<{ users: User[]; totalCount: number }> {
  const client = await clerkClient();
  const response = await client.users.getUserList({
    limit,
    offset,
    orderBy: "-created_at",
    query: search || undefined,
  });

  const profiles = await db.profile.findMany({
    where: {
      userId: {
        in: response.data.map((user) => user.id),
      },
    },
  }); 

  const users: User[] = response.data.map((user) => {
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );
    return {
      id: user.id,
      email: primaryEmail?.emailAddress || "No email",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role:
        (user.publicMetadata?.role as "admin" | "moderator" | "User") || "User",
      profile: profiles.find((profile) => profile.userId === user.id) || null,
    };
  });

  return {
    users,
    totalCount: response.totalCount,
  };
}

const UsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) => {
  const { search } = (await searchParams) || "";
  const page = parseInt((await searchParams).page || "1");
  const limit = 501;
  const offset = (page - 1) * limit;

  const { users, totalCount } = await getAllUserDetails({
    search,
    limit,
    offset,
  });

  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={users}
        totalCount={totalCount}
        currentPage={page}
        search={search || ""}
      />
    </div>
  );
};

export default UsersPage;
