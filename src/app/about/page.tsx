import Navbar from "@/components/Navbar/Navbar";
import { gmailComposeUrl } from "@/lib/gmailComposeUrl";
import { getPageContent } from "@/lib/pageContent";
import {
  DEFAULT_ABOUT_CONTENT,
  type AboutContent,
} from "@/lib/aboutContent";
import styles from "./page.module.scss";

function AboutEmailLink({ email }: { email: string }) {
  return (
    <a
      href={gmailComposeUrl(email)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {email}
    </a>
  );
}

export const metadata = {
  title: "About",
  description:
    "LACE — an international boutique agency founded in 2018, representing the most unique and high-end talents.",
};

export default async function AboutPage() {
  const saved = await getPageContent<AboutContent>("about");
  const content = saved ?? DEFAULT_ABOUT_CONTENT;

  const ceo = content.teamMembers[0];
  const rest = content.teamMembers.slice(1);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.intro}>{content.intro}</p>

          {ceo && (
            <section className={styles.section}>
              <h2 className={styles.name}>
                {ceo.name} — {ceo.title}
              </h2>
              <p className={styles.detail}>
                <AboutEmailLink email={ceo.email} />
              </p>
              {ceo.phones.map((phone, i) => (
                <p key={i} className={styles.detail}>
                  {phone.label}: {phone.number}
                </p>
              ))}
            </section>
          )}

          {rest.length > 0 && (
            <>
              <section className={styles.section}>
                <h2 className={styles.heading}>The Team</h2>
              </section>

              {rest.map((member, idx) => (
                <section key={idx} className={styles.section}>
                  <h3 className={styles.name}>
                    {member.name} — {member.title}
                  </h3>
                  <p className={styles.detail}>
                    <AboutEmailLink email={member.email} />
                  </p>
                  {member.phones.map((phone, i) => (
                    <p key={i} className={styles.detail}>
                      {phone.label}: {phone.number}
                    </p>
                  ))}
                </section>
              ))}
            </>
          )}

          <section className={styles.section}>
            <h2 className={styles.heading}>Scouting</h2>
            <p className={styles.detail}>
              <AboutEmailLink email={content.scoutingEmail} />
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
