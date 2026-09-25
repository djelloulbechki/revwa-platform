//just to refresh commit
// src/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Legal</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-muted-foreground">
            Last updated: September 25, 2026
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              REVWA (“we”, “us”, or “our”) operates an independent B2B tech procurement
              platform that helps companies define technical requirements, run anonymous
              RFQs, and compare vendor proposals fairly. This Privacy Policy explains how
              we collect, use, store, and protect your information when you use our
              website and services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">We may collect:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>
                <strong className="text-foreground">Account information:</strong> name,
                email address, company name, phone number, and password.
              </li>
              <li>
                <strong className="text-foreground">Project information:</strong> request
                descriptions, voice recordings, budgets, timelines, systems in use, and
                uploaded documents (including quotes for audit).
              </li>
              <li>
                <strong className="text-foreground">Vendor information:</strong> company
                profile, specialties, portfolio links, and proposal content.
              </li>
              <li>
                <strong className="text-foreground">Usage data:</strong> pages visited,
                device/browser type, IP address, and approximate location.
              </li>
              <li>
                <strong className="text-foreground">Communications:</strong> messages you
                send to us or through the platform.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>Create and manage your account</li>
              <li>Process project requests, scope documents, RFQs, and proposals</li>
              <li>Match buyers with relevant vendors (while keeping buyer identity anonymous during RFQ)</li>
              <li>Provide quote audits and related advisory services</li>
              <li>Communicate about your requests, deals, and platform updates</li>
              <li>Improve security, prevent fraud, and operate the platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">4. Anonymous RFQs</h2>
            <p className="text-muted-foreground leading-relaxed">
              A core feature of REVWA is anonymous request distribution. When we send an
              RFQ to vendors, we do not share your company name, contact details, or other
              identifying information unless and until you choose to proceed with a
              selected vendor and explicitly allow introduction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">5. Sharing of Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information. We may share information only with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>
                <strong className="text-foreground">Vendors</strong> you select or agree to
                be introduced to after shortlisting
              </li>
              <li>
                <strong className="text-foreground">Service providers</strong> who help us
                operate the platform (hosting, authentication, storage, analytics), under
                confidentiality obligations
              </li>
              <li>
                <strong className="text-foreground">Legal authorities</strong> when required
                by law or to protect rights, safety, and security
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">6. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We store data using reputable cloud providers and apply reasonable technical
              and organizational measures (encryption in transit, access controls, and
              monitoring). No method of transmission or storage is 100% secure, but we
              work to protect your information against unauthorized access, loss, or misuse.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">7. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain account and project data for as long as needed to provide the
              service, fulfill contracts, resolve disputes, and meet legal requirements.
              You may request deletion of your account subject to legal and operational
              limits (for example, records related to completed deals or invoices).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">8. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion</li>
              <li>Object to or restrict certain processing</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              To exercise these rights, contact us at the email below.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">9. Cookies & Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use cookies and similar technologies for essential site functions,
              preference settings, and aggregated analytics. You can control cookies
              through your browser settings. Disabling some cookies may affect platform
              functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">10. Third-Party Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party sites or services. We are not
              responsible for their privacy practices. We encourage you to review their
              policies separately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">11. Children’s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              REVWA is a B2B service intended for business users. We do not knowingly
              collect personal information from children under 16.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">12. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. The “Last updated” date
              at the top will change when we do. Continued use of the platform after
              updates means you accept the revised policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">13. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or your data, contact us at:
            </p>
            <p className="text-foreground font-medium">
              Email:{" "}
              <a
                href="mailto:privacy@revwa.com"
                className="text-primary hover:underline"
              >
                privacy@revwa.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} REVWA — Independent B2B Tech Procurement Desk
        </div>
      </footer>
    </div>
  )
}
