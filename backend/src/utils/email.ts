import nodemailer from "nodemailer";
import { EMAIL_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/env";
import { reservationTemplate, cancellationTemplate } from "./emailTemplates";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

export async function sendReservationEmail(opts: {
  to: string; businessName: string; stallName: string; qrUrl: string;
}) {
  try {
    const html = reservationTemplate({
      businessName: opts.businessName,
      stallName: opts.stallName,
      qrUrl: opts.qrUrl
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: opts.to,
      subject: "Colombo International Bookfair – Stall Reservation Confirmation",
      html
    });
  } catch (error) {
    console.error("Error sending reservation email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendCancellationEmail(opts: {
  to: string; businessName: string; stallName: string;
}) {
  try {
    const html = cancellationTemplate({
      businessName: opts.businessName,
      stallName: opts.stallName
    });
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: opts.to,
      subject: "Colombo International Bookfair – Stall Reservation Cancellation",
      html
    });
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw new Error("Failed to send cancellation email");
  }
}
