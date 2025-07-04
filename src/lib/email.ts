import nodemailer from "nodemailer";   

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const smtpOptions = {
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || "2525"),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
    debug: true,
    logger: true,
  });

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    ...data,
  });
};

export const formatEmail = (email: string) => {
  return email.replace(/\s+/g, "").toLowerCase().trim();
};

