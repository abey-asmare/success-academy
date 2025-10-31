'use cache'
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import {db} from "@/lib/db";


const UsersPage = async () => {
  const profiles = await db.profile.findMany()


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
