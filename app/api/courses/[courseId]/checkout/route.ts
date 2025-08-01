// checkout will be hitting here
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/utils/roles";
// ready to be deprecate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const user = await currentUser();

    if (!user || !user.id || !isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // define line items for stripe check out page.
    // const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    //     {
    //         price_data: {
    //             currency: "usd",
    //             product_data: {
    //                 name: course.title,
    //             },
    //             unit_amount: Math.round(course.price! * 100),
    //         },
    //         quantity: 1,
    //     },
    // ];

    // let stripeCustomer = await db.stripeCustomer.findUnique({
    //     where: {
    //         userId: user.id,
    //     },
    //     select: {
    //         stripeCustomerId: true,
    //     },
    // });

    // if (!stripeCustomer) {
    //     const customer = await stripe.customers.create({
    //         email: user.emailAddresses?.[0]?.emailAddress,
    //     });

    //     stripeCustomer = await db.stripeCustomer.create({
    //         data: {
    //             userId: user.id,
    //             stripeCustomerId: customer.id,
    //         },
    //     });
    // }

    // const session = await stripe.checkout.sessions.create({
    //     customer: stripeCustomer.stripeCustomerId,
    //     line_items: lineItems,
    //     mode: "payment",
    //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
    //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=1`,
    //     metadata: {
    //         courseId: course.id,
    //         userId: user.id,
    //     },
    // });

    return NextResponse.json({ url: "" });
  } catch (error) {
    console.log("COURSE_ID_CHECKOUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
