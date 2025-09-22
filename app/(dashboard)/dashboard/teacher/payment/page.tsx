import { db } from '@/lib/db';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';

export default async function PaymentPage() {
    const profile = await db.profile.findMany()
  const courses = await db.course.findMany()
      const purchases = await db.purchase.findMany({
        include: {
            course: true
        }
    })

    const data = purchases.map(purchase => {
        const user = profile.find(p => p.userId === purchase.userId)
        const email = user?.email || purchase.userId
        const course = courses.find(course => course.id === purchase.courseId)?.title
        return {
            id: purchase.id,
            email: email || purchase.userId,
            course: course!,
            imageUrl: purchase.imageUrl,
            approved: purchase.approved,
            date: purchase.createdAt,
        }
    })
      return (
        <div className="p-2 md:p-6">
              <DataTable columns={columns} data={data} />
          </div>
      );
}
