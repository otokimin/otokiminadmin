/* eslint-disable @typescript-eslint/no-explicit-any */
import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as nodemailer from "nodemailer";

const EMAIL_USER = defineSecret("EMAIL_USER");
const EMAIL_PASS = defineSecret("EMAIL_PASS");

export const sendSupportReply = onCall(
  { secrets: [EMAIL_USER, EMAIL_PASS] },
  async (request) => {
    const { to, message } = request.data;

    if (!to || !message) {
      throw new Error("Eksik parametre: to veya message yok");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER.value(),
        pass: EMAIL_PASS.value()
      }
    });

    try {
      await transporter.sendMail({
        from: `Otokimin Destek <${EMAIL_USER.value()}>`,
        to,
        subject: "Destek Talebinize Yanıt",
        text: message
      });

      return { success: true };
    } catch (error: any) {
      console.error("Email error:", error);
      throw new Error("Email gönderilemedi");
    }
  }
);
