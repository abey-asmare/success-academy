import { db } from "@/lib/db";
import { Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export const metadata: Metadata = {
    title: "Our Courses",
}


const CoursesPage = async () => {
    const courses = await db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-2 md:p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;     