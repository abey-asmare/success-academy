import { redirect } from 'next/navigation';
import React from 'react'
import { DataTable } from '../users/components/data-table';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { columns } from '../users/components/columns';
import { db } from '@/lib/db';


export default async function PaymentPage() {

    const { userId } = await auth();
      if (!userId) {
          return redirect("/");
      }


      const client = await clerkClient()
      const clientInformation = await client.users.getUserList({
        limit: 501,
        offset: 0,
        orderBy: '-created_at'
      });
      const purchases = await db.purchase.findMany({
        include: {
            course: true
        }
    })
    const courses = await db.course.findMany()
    const data = purchases.map(purchase => {
        const user = clientInformation.data.find(user => user.id === purchase.userId)
        const email = user?.emailAddresses.find(email => email.id === user?.primaryEmailAddressId)?.emailAddress
        const course = courses.find(course => course.id === purchase.courseId)?.title
        return {
            id: purchase.id,
            email: email || purchase.userId,
            course: course!,
            imageUrl: purchase.imageUrl,
            approved: purchase.approved,
            date: purchase.createdAt.toDateString(),
        }
    })



      return (
          <div className="p-6">
              {/* <DataTable columns={columns} data={data} /> */}
          </div>
      );
}
