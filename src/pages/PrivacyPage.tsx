import { Link } from "react-router-dom";
import { SEOHead } from "../components/SEOHead";
import PageIntro from "../components/layout/PageIntro";

export default function PrivacyPage() {
  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="How lorapok.tech uses cookies, Google AdSense, partner links, and the information you send through the contact form."
        path="/privacy/"
      />
      <article className="v4-inner-page v4-legal py-16 px-4 max-w-3xl mx-auto w-full text-gray-300 space-y-8">
        <PageIntro
          tone="lavender"
          eyebrow="LORAPOK LABS / LEGAL"
          title={<>Privacy, in <em>plain language.</em></>}
          description="Effective 14 October 2026. This policy covers lorapok.tech and explains the small amount of data the site may use."
        />

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Who we are</h2>
          <p>
            Lorapok Labs publishes open-source product notes, a project catalog, and a team directory at lorapok.tech.
            The public contact address for the GitHub organization is lorapokdev@gmail.com. The founder listed on the
            About page is Mohammad Maizied Hasan Majumder.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Advertising and cookies</h2>
          <p>
            This site uses Google AdSense, publisher ID <span className="font-mono text-white">ca-pub-3756651399602872</span>,
            to show ads. Google and its partners may use cookies to serve and measure ads, including ads based on your
            visits to this site and other sites.
          </p>
          <p>
            Advertising cookies stay off until you accept marketing cookies in the consent banner. The site sets Google
            consent mode to denied for ad storage, ad user data, ad personalization, and analytics storage, then grants
            those signals only after that choice. You can refuse marketing cookies and keep using the site.
          </p>
          <p>Google explains its own practices here:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <a className="text-[#67ff8f] hover:underline" href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">How Google uses information from sites that use its services</a>
            </li>
            <li>
              <a className="text-[#67ff8f] hover:underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's partner-site policy</a>
            </li>
            <li>
              <a className="text-[#67ff8f] hover:underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">Google ad settings</a>
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Information you send us</h2>
          <p>
            The contact form asks for a name, email address, subject, and message so we can reply. We do not sell that
            information. Do not send passwords, payment card numbers, or government ID numbers through the form.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Newsletter subscriptions</h2>
          <p>
            If you join the Lorapok Labs newsletter, we store the email address you submit, the signup source, the
            consent-version marker, and the subscription time in Cloud Firestore. The public website cannot read,
            change, or delete subscriber records. We use the address only for Lorapok Labs updates and do not sell it.
            Every newsletter will provide an unsubscribe path, and you can also request removal through the contact page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Team pages</h2>
          <p>
            Team profiles publish professional details that the person supplied for the public site, such as a role,
            a photo, and a work email. Phone numbers are not published on the profile pages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Partner and affiliate links</h2>
          <p>
            The <Link className="text-[#67ff8f] hover:underline" to="/partners/">partner directory</Link> may contain
            tracked links and referral codes. A provider may tell Lorapok that a qualifying visit, signup, or purchase
            occurred so it can attribute a commission or account credit. Providers handle their own sites under their
            own privacy policies. The public project catalog remains separate from these commercial references.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Contact</h2>
          <p>
            Questions about this policy can go through the <Link className="text-[#67ff8f] hover:underline" to="/contact/">contact page</Link> or
            to lorapokdev@gmail.com.
          </p>
        </section>
      </article>
    </>
  );
}
