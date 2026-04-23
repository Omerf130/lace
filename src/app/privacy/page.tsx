import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy and terms of use for the LACE MGMT LTD website and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <article className={styles.content}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>LACE MGMT LTD</p>
          <p className={styles.updated}>
            <strong>Last Updated:</strong> January 1, 2026
          </p>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to the official website of LACE MGMT LTD (&quot;Company&quot;,
              &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing, browsing, or
              using this website and/or our services, you agree to be legally bound by
              these Terms of Service (&quot;Terms&quot;).
            </p>
            <p>
              If you do not agree to these Terms, you must immediately discontinue use
              of the website.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>2. Eligibility</h2>
            <p>You represent and warrant that:</p>
            <ul>
              <li>
                You are at least 18 years old, or have legal parental/guardian consent
              </li>
              <li>You have the legal capacity to enter into binding agreements</li>
              <li>All information you provide is accurate and truthful</li>
            </ul>
            <p>
              We reserve the right to refuse service or terminate access at our sole
              discretion.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>3. Services Provided</h2>
            <p>
              LACE MGMT LTD operates as an international modeling agency, providing
              services including but not limited to:
            </p>
            <ul>
              <li>Talent representation and management</li>
              <li>Casting and booking facilitation</li>
              <li>Portfolio presentation and promotion</li>
              <li>
                Industry connections with clients, brands, and production entities
              </li>
            </ul>
            <p>We do not guarantee employment, bookings, or specific outcomes.</p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>4. User Responsibilities</h2>
            <p>By using the website, you agree that you will:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Not submit false, misleading, or fraudulent content</li>
              <li>Not violate any applicable laws or regulations</li>
              <li>Not infringe upon the rights of third parties</li>
            </ul>
            <p>You are solely responsible for any content you submit.</p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>5. Submissions (Models / Applicants)</h2>
            <p>By submitting photos, videos, or personal data:</p>
            <ul>
              <li>
                You grant LACE MGMT LTD a worldwide, non-exclusive, royalty-free
                license to use, reproduce, display, distribute, and promote such
                content
              </li>
              <li>You confirm that you own or have rights to the content</li>
              <li>
                You waive any claims related to usage of submitted materials for
                agency purposes
              </li>
            </ul>
            <p>
              We reserve the right to accept, reject, or remove submissions at our sole
              discretion.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>6. Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design,
              is the property of LACE MGMT LTD or its licensors and is protected by
              applicable intellectual property laws.
            </p>
            <p>
              Unauthorized use, reproduction, or distribution is strictly prohibited.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>7. Third-Party Links and Services</h2>
            <p>
              The website may include links to third-party platforms or services. We
              do not control or assume responsibility for such external content or
              services.
            </p>
            <p>Use of third-party services is at your own risk.</p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>8. No Guarantees or Endorsements</h2>
            <p>LACE MGMT LTD does not guarantee:</p>
            <ul>
              <li>Employment or casting opportunities</li>
              <li>Accuracy of third-party information</li>
              <li>Continuous or error-free operation of the website</li>
            </ul>
            <p>
              All services are provided on an &quot;as is&quot; and &quot;as available&quot; basis.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law:</p>
            <ul>
              <li>
                LACE MGMT LTD shall not be liable for any indirect, incidental,
                consequential, or punitive damages
              </li>
              <li>
                We are not liable for loss of income, reputation, data, or
                opportunities
              </li>
              <li>Any liability shall be limited to the minimum amount permitted by law</li>
            </ul>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless LACE MGMT LTD, its directors,
              employees, agents, and affiliates from any claims, damages, liabilities,
              losses, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the website</li>
              <li>Your breach of these Terms</li>
              <li>Your violation of any law or third-party rights</li>
            </ul>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the website
              or services at any time, without notice, for any reason, including
              violation of these Terms.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>12. Privacy</h2>
            <p>Your use of the website is governed by this Privacy Policy.</p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>13. Modifications</h2>
            <p>
              We reserve the right to modify or update these Terms at any time.
              Continued use of the website constitutes acceptance of any revised
              Terms.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the
              laws applicable in the jurisdiction in which LACE MGMT LTD operates,
              without regard to conflict of law principles.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>15. Dispute Resolution</h2>
            <p>
              Any disputes arising out of or related to these Terms or the use of the
              website shall be resolved exclusively in the competent courts of the
              relevant jurisdiction determined by LACE MGMT LTD.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms constitute the entire agreement between you and LACE MGMT
              LTD regarding use of the website and supersede any prior agreements.
            </p>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <h2>17. Contact Information</h2>
            <p>
              <strong>LACE MGMT LTD</strong>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:accounting@lacemodel.com">accounting@lacemodel.com</a>
            </p>
            <p>Address: Hamster 35, Tel Aviv, Israel</p>
          </section>

          <p className={styles.disclaimer}>
            <strong>Legal Disclaimer:</strong> These Terms are provided for general
            informational purposes and do not constitute legal advice. You should
            consult legal counsel to ensure compliance with applicable laws and
            regulations.
          </p>
        </article>
      </main>
    </>
  );
}
