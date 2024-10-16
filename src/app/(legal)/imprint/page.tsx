import { Navbar } from "@/components/features/shared/layout/navbar";
import { getServerAuthSession } from "@/+server/auth/auth";

export default async function Imprint() {
  const session = await getServerAuthSession();

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={session} />

      <main className="h-full w-full overflow-scroll">
        <div className="m-auto flex h-full w-full max-w-2xl flex-col gap-4 p-8">
          <h1>Imprint</h1>
          <p>Last Updated: 2024-10-15</p>

          <h2>Owner and Operator</h2>
          <p>
            Stable Pixel <br />
            Leon Meka <br />
            Helenengasse 4 <br />
            1020 Vienna, Austria <br />
            Email:{" "}
            <a href="mailto:help@stablepixel.app">help@stablepixel.app</a>
          </p>

          <h2>Legal Form and Company Registration</h2>
          <p>–</p>

          <h2>Supervisory Authority</h2>
          <p>–</p>

          <h2>Chamber Membership</h2>
          <p>–</p>

          <h2>Dispute Resolution</h2>
          <p>
            The European Commission provides an online dispute resolution
            platform, which you can access at:
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            . However, if you have any complaints, you may also contact us at
            the email address provided above.
          </p>
        </div>
      </main>
    </div>
  );
}
