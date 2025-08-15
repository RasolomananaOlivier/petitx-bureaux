import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { templates } from "./templates";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  generateVerificationToken(): string {
    return randomBytes(32).toString("hex");
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    verificationToken: string,
    officeTitle: string
  ): Promise<void> {
    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: "Confirmez votre email - Petits Bureaux",
      html: templates.verificationEmail(verificationUrl, name, officeTitle),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }
  }

  async sendLeadConfirmationEmail(
    to: string,
    name: string,
    officeTitle: string
  ): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: "Demande confirmée - Petits Bureaux",
      html: templates.leadConfirmationEmail(name, officeTitle),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw new Error("Failed to send confirmation email");
    }
  }
}

export const emailService = new EmailService();
