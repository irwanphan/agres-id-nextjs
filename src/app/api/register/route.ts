import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismaDB";
import { revalidateTag } from "next/cache";
import { rateLimit } from "@/lib/rateLimit";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/emailService";

export async function POST(request: Request) {
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";

  // Apply rate limiting: 5 requests per minute per IP
  const limitResult = await rateLimit(clientIp);

  if (!limitResult.success) {
    throw new Error("Too many requests, please try again later");
  }

  const body = await request.json();
  const { name, email, phone, countryCode, password } = body;

  if (!name || !email || !phone || !countryCode || !password) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const formatedEmail = email.toLowerCase();

  const exist = await prisma.user.findUnique({
    where: {
      email: formatedEmail,
    },
  });

  if (exist) {
    return new NextResponse("Email already exists", { status: 400 });
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  // Function to check if an email is in the list of admin emails
  function isAdminEmail(email: string) {
    return adminEmails.includes(email);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const fullPhone = `+${countryCode.replace(/^\+/, "")}${phone.replace(/^0+/, "")}`;

  const newUser: {
    name: string;
    email: string;
    countryCode: string;
    phone: string;
    fullPhone: string;
    password: string;
    role: UserRole;
  } = {
    name,
    email: formatedEmail,
    countryCode,
    phone,
    fullPhone,
    password: hashedPassword,
    role: UserRole.USER,
  };

  const existPhone = await prisma.user.findUnique({
    where: { phone: fullPhone },
  });
  if (existPhone) {
    return new NextResponse("Phone number already exists", { status: 400 });
  }
  
  if (isAdminEmail(formatedEmail)) {
    newUser.role = UserRole.ADMIN;
  }

  try {
    const user = await prisma.user.create({
      data: {
        ...newUser,
      },
    });
    revalidateTag("users");

    // Send welcome email
    await sendWelcomeEmail({
      to: user.email!,
      username: user.name || "User",
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        countryCode: user.countryCode,
        phone: user.phone,
        fullPhone: user.fullPhone,
      },
    });
  } catch (error: any) {
    console.error("[REGISTER_POST]", error, "error in register");
    return new NextResponse("Internal error", { status: 500 });
  }
}
