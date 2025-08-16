import { db } from "@/lib/db";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Metadata } from "next";

const metadata: Metadata = {
    title: "Our Courses",
}


const CoursesPage = async () => {
    const courses = await db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;     