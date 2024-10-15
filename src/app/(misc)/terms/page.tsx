import { getServerAuthSession } from "@/+server/auth/auth";
import { Navbar } from "@/components/features/layout/navbar";

export default async function Terms() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={session} />

      <main className="h-full w-full overflow-scroll">
        <div className="m-auto flex h-full w-full max-w-2xl flex-col gap-4 p-8">
          <h1>Terms of Service</h1>
          <p>Last Updated: 2024-10-15</p>

          <p>
            By using Stable Pixel, you agree to the following terms and
            conditions. These terms are governed by Austrian law, and by using
            the service, you confirm your agreement.
          </p>
          <h2>1. Use of Service</h2>
          <p>
            You agree to use Stable Pixel for lawful purposes only. You may not
            use Stable Pixel to train your own models on images generated
            without explicit permission in writing. You retain ownership of your
            creations.
          </p>

          <h2>2. Limitations on Usage</h2>
          <p>
            We may adjust the features, functionalities, and pricing, and will
            provide reasonable notice.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All intellectual property related to Stable Pixel remains our
            property. You retain ownership of your generated content and bear
            responsibility for legal compliance.
          </p>

          <h2>4. Disclaimer of Warranty</h2>
          <p>
            Stable Pixel is provided as-is, with no warranties, to the extent
            permitted by Austrian law.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            We are not liable for any damages arising from your use of Stable
            Pixel, as permitted under Austrian law.
          </p>

          <h2>6. Governing Law</h2>
          <p>These terms are governed by Austrian law.</p>

          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate access at any time in accordance
            with these terms.
          </p>
        </div>
      </main>
    </div>
  );
}
