import { env } from "@/env";
import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";

export const sendVerificationRequest = async (
  params: SendVerificationRequestParams,
) => {
  const {
    identifier: email,
    url,
    provider: { from },
  } = params;

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: from,
      to: email,
      subject: "Verify your login",
      html: `
        <p>Hi! Click the link below to sign in to Stable Pixel:</p>
        <p><a href="${url}"><b>Sign in</b></a></p>
        
        <p>If you didn't request this, you can safely ignore this email.</p>

        <p>Thanks,</p>
        <p>Stable Pixel</p>
      `,
    });
  } catch (error) {
    console.log({ error });
  }
};
