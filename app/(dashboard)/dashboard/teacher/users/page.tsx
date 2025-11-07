"use cache";
import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const UsersPage = async () => {
  cacheTag("page/teacher/users");
  cacheLife("hours");
  const profiles = await db.profile.findMany();

  return (
    <div className="p-2 md:p-6">
      <DataTable
        columns={columns}
        data={profiles}
        totalCount={profiles.length}
      />
    </div>
  );
};

export default UsersPage;
