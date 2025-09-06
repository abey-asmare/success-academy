// import { useAuth } from '@clerk/nextjs'
// import React, { useEffect } from 'react'
// import { db } from '@/lib/db';
// import { redirect } from 'next/navigation';

// export default function PendingPurchaseFeedback({courseId}: {courseId: string}) {
    
//     const {userId} =  useAuth()
//     useEffect(()=> {
//         let isPendingPurchase = false
//         async function fetchPurchase(){
//             const purchase = await db.purchase.findUnique({
//             where: {
//               userId_courseId: {
//                 userId,
//                 courseId,
//               }
//             }
//           })
//           return purchase
//         }
//         if(userId){
//           const purchase = await fetchPurchase()
//           if(purchase?.approved){
//             return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`)
//           }
//           isPendingPurchase = !!purchase && !purchase.approved
//         }
          
//     }, [])
//   return (
//     <div>
      
//     </div>
//   )
// }
