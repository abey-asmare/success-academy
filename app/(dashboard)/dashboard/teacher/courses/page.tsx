'use cache'
import { db } from "@/lib/db";
import { Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { cache } from "react";

export const metadata: Metadata = {
    title: "Our Courses",
}
const getCourses = cache(async ()=>
    db.course.findMany({
        orderBy: {
            createdAt: "desc",
        },
    }))

const CoursesPage = async () => {
    const courses = await getCourses();

    return (
        <div className="p-2 md:p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;