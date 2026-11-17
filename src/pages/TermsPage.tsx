import { useEffect } from "react";
import { Link } from "react-router-dom";
import { brand } from "../data/lorapok";
import { SEOHead } from "../components/SEOHead";
import PageIntro from "../components/layout/PageIntro";

export default function TermsPage() {
  useEffect(() => {
    document.title = `Terms of Use | ${brand.name}`;
  }, []);

  return (
    <>
      <SEOHead
        title="Terms of Use"
        description="Terms for using lorapok.tech, including open-source projects, advertising, and transparent partner and affiliate references."
        path="/terms/"
      />
      <article className="v4-inner-page v4-legal py-16 px-4 max-w-3xl mx-auto w-full text-gray-300 space-y-8">
        <PageIntro
          tone="gold"
          eyebrow="LORAPOK LABS / LEGAL"
          title={<>Clear terms.<br /><em>Open intent.</em></>}
          description="Effective 14 October 2026. These terms explain how the public catalog, repositories, advertising, and third-party links work."
        />

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">The site</h2>
          <p>
            lorapok.tech is a catalog of public repositories, lab notes, and the people who work with Lorapok Labs.
            Project descriptions follow the public GitHub repository or README they cite. GitHub profile counts on the
            home page are a snapshot dated on the page, not a promise of future growth.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Open-source projects</h2>
          <p>
            Source code linked from this site stays in its own repository and under that repository's license. The
            website itself is published as an MIT-licensed project. A link on this site does not transfer ownership of
            a repository to you.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Advertising</h2>
          <p>
            Google AdSense may display ads on this site. Ad cookies follow the choice you make in the consent banner.
            Details are in the <Link className="text-[#67ff8f] hover:underline" to="/privacy/">privacy policy</Link>.
          </p>
          <p>
            The <Link className="text-[#67ff8f] hover:underline" to="/partners/">partner directory</Link> contains
            approved affiliate relationships and independent affiliate references. Lorapok Labs may receive a commission
            or account credit after a qualifying action through a tracked link. Each listing identifies the relationship
            and states a customer benefit only when the exact benefit has been verified.
          </p>
          <p>Third-party providers control their own prices, eligibility, fulfillment, privacy practices, and offer terms. Their current terms remain authoritative.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Acceptable use</h2>
          <p>
            Do not use this site to break the law, to attack the site, or to misrepresent a Lorapok project as something
            it is not. Lab notes are descriptions of public repositories. They are not professional security audits or
            medical advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">No warranty</h2>
          <p>
            The site and the linked projects are provided as available. Lorapok Labs does not warrant that a repository,
            demo, or package will be error-free or fit for a particular production system.
          </p>
        </section>
      </article>
    </>
  );
}
