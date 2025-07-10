import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prismaDB";
import { sendErrorResponse, sendSuccessResponse } from "@/utils/sendResponse";
import { revalidateTag } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/emailService";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        billing: {
          path: ["email"],
          equals: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedBank, shipToDifferentAddress, shippingAddressOption, couponDiscount, couponCode, products, ...orderData } = body;

    // console.log("🔔 Order data:", orderData);

    // Start a transaction to ensure atomic updates
    const order = await prisma.$transaction(async (tx) => {
      // console.log('[Order] Before create order');
      const newOrder = await tx.order.create({
        data: {
          ...orderData,
          products,
          // shippingStatus: 'pending'
        },
      });
      // console.log('[Order] After create order');

      // Update product quantity
      for (const item of products) {
        // console.log(`[Order] Before update product ${item.id}`);
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { quantity: true },
        });
        // console.log(`[Order] After find product ${item.id}`);

        if (!product || product.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for product: ${item.name}`);
        }

        await tx.product.update({
          where: { id: item.id },
          data: { quantity: { decrement: item.quantity } },
        });
        // console.log(`[Order] After update product ${item.id}`);
      }

      // If a coupon was applied, update its redemption count
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode },
        });
        if (!coupon) {
          throw new Error("Invalid coupon code");
        }
        if (coupon.timesRedemed >= coupon.maxRedemptions) {
          throw new Error("Coupon has reached its maximum redemptions");
        }
        await tx.coupon.update({
          where: { code: couponCode },
          data: {
            timesRedemed: { increment: 1 },
          },
        });
      }

      return newOrder;
    });
    // Send order confirmation email
    if (order.id) {
      await sendOrderConfirmationEmail({
        to: orderData.billing.email,
        orderNumber: order.id,
        customerName: orderData.billing?.firstName + " " + orderData.billing?.lastName || "Customer",
        orderDate: new Date().toLocaleDateString(),
        totalAmount: order.totalAmount,
        orderItems: products.map((product: any) => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        shippingAddress: {
          name: orderData?.shipping?.email || orderData.billing?.email,
          address: orderData?.shipping?.address?.street || orderData.billing?.address?.street,
          city: orderData?.shipping?.town || orderData.billing?.town,
          country: orderData?.shipping?.country || orderData.billing?.country,
        },
      });
    }

    revalidateTag("orders");
    return sendSuccessResponse(200, "Order created successfully", order);
  } catch (err: any) {
    console.log(err?.stack || err);
    return sendErrorResponse(500, err.message || "Internal Server Error");
  }
}

