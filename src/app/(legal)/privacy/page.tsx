import { getServerAuthSession } from "@/+server/auth/auth";
import { Navbar } from "@/components/features/shared/layout/navbar";

export default async function Privacy() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">
      <Navbar session={session} />

      <main className="h-full w-full overflow-y-scroll">
        <div className="m-auto flex h-full w-full max-w-2xl flex-col gap-4 p-8">
          <h1>Privacy Policy</h1>
          <p>Last Updated: 2024-10-16</p>

          <p>
            At Stable Pixel, we value your privacy and are committed to
            protecting your personal data. This Privacy Policy outlines how we
            collect, use, and protect your information in compliance with
            Austrian law, including the General Data Protection Regulation
            (GDPR).
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            Email Address: We collect your email address for account creation,
            communication, and login purposes.
          </p>
          <p>
            Social Login Information: If you sign in using a social login, we
            collect the information provided, which usually includes your email
            and name.
          </p>
          <p>
            Payment Information: We do not store or process any payment
            information. All payments are handled by Gumraod. You can review
            Gumroad&apos;s privacy policy at{" "}
            <a
              href="https://gumroad.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://gumroad.com/privacy
            </a>
            .
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to manage your account, improve our
            services, and comply with legal obligations under Austrian law.
          </p>

          <h2>3. Data Security</h2>
          <p>
            We take appropriate measures to protect your data from unauthorized
            access and breaches.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not share your data with third parties except with your
            consent or for legal purposes, and for payment processing through
            Gumroad.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            Under Austrian law and GDPR, you have the right to access, rectify,
            erase, restrict, and object to the processing of your personal data,
            and request data portability.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to
            fulfill the purposes for which it was collected.
          </p>

          <h2>7. Changes to this Policy</h2>
          <p>
            We may update this policy and will notify you of any significant
            changes. The latest version will always be available on our website.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            For any questions or concerns, contact us at{" "}
            <a href="mailto:help@stablepixel.app">help@stablepixel.app</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
