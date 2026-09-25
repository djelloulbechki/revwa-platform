// src/pages/TermsOfService.tsx
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground mb-2">Legal</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-3 text-muted-foreground">
            Last updated: September 25, 2026
          </p>
        </div>

        <div className="space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using REVWA (“Platform”, “we”, “us”), you agree to these
              Terms of Service. If you do not agree, do not use the Platform. These Terms
              apply to buyers, vendors, and any other users of our independent B2B tech
              procurement services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              REVWA helps companies define technical requirements, run anonymous RFQs,
              compare vendor proposals, and (where applicable) close deals. We may also
              provide quote audits and related advisory support. REVWA is an independent
              intermediary and is not itself a software vendor or implementation company
              unless explicitly stated in a separate agreement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">3. Eligibility & Accounts</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>You must be at least 18 years old and able to form a binding contract.</li>
              <li>You must provide accurate account and company information.</li>
              <li>You are responsible for safeguarding your login credentials.</li>
              <li>You must promptly notify us of any unauthorized access to your account.</li>
              <li>We may suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">4. Buyer Terms</h2>
            <p className="text-muted-foreground leading-relaxed">When you submit a request or quote for audit, you agree that:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>Information you provide is accurate and not misleading.</li>
              <li>You authorize us to create scope documents and distribute anonymized RFQs to selected vendors.</li>
              <li>Your identity remains confidential during the RFQ stage unless you approve an introduction.</li>
              <li>Final vendor selection, contracting, and payment for project work are between you and the vendor, unless a separate written agreement says otherwise.</li>
              <li>The first successful deal may be free for buyers under our then-current pricing; later or enterprise services may be charged as disclosed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">5. Vendor Terms</h2>
            <p className="text-muted-foreground leading-relaxed">If you participate as a vendor, you agree that:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>Your profile, capabilities, and proposals are truthful and up to date.</li>
              <li>You will only respond to RFQs you are qualified to deliver.</li>
              <li>You will not attempt to bypass the Platform to avoid fees for opportunities originated through REVWA.</li>
              <li>Success fees or subscription fees apply as stated in your vendor agreement or the Platform’s pricing at the time of the deal.</li>
              <li>You remain solely responsible for your delivery, warranties, and client contracts.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">6. Fees & Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              Buyer access to core intake and the first successful match may be free.
              Vendors may owe a success fee (for example, a percentage of the closed deal
              value) and/or subscription fees for certified partner plans. Fees, payment
              timing, and invoicing terms will be shown before you commit. Late or failed
              payments may result in suspension of access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">7. Anonymous Matching & Introductions</h2>
            <p className="text-muted-foreground leading-relaxed">
              During RFQ distribution, buyer identity is anonymized. Contact details and
              company identity are shared only after shortlisting and buyer approval, or as
              needed to close a deal both parties accept. Circumventing anonymity or
              fee structures is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">8. Intellectual Property</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>REVWA owns the Platform, branding, software, and our generated templates and tooling.</li>
              <li>You retain ownership of content you upload (project briefs, documents, proposals).</li>
              <li>You grant us a limited license to use that content solely to operate the service (scoping, RFQs, matching, audits, support).</li>
              <li>Scope documents prepared by REVWA may be used by you for the related procurement process.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">9. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">You may not:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-1">
              <li>Submit false, fraudulent, or infringing content</li>
              <li>Harass, spam, or solicit users outside permitted Platform flows</li>
              <li>Attempt to reverse engineer, scrape, or disrupt the Platform</li>
              <li>Use the service for unlawful purposes</li>
              <li>Misrepresent your identity, company, or authority to bind a company</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">10. Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Platform is provided “as is” and “as available.” We do not guarantee that
              any RFQ will receive proposals, that any proposal will meet your needs, or
              that any vendor will complete work to your satisfaction. Quote audits and
              recommendations are informational and do not constitute legal, financial, or
              professional guarantees. Vendor performance is the vendor’s responsibility.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, REVWA and its affiliates shall not be
              liable for indirect, incidental, special, consequential, or punitive damages,
              or for lost profits, data, or business opportunities. Our total liability
              arising from your use of the Platform shall not exceed the fees you paid to
              REVWA in the twelve (12) months before the claim (or USD $100 if no fees were
              paid).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">12. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless REVWA from claims, damages, and
              expenses arising from your content, your use of the Platform, your deals with
              other parties, or your violation of these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">13. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may stop using the Platform at any time. We may suspend or terminate
              access if you breach these Terms, create risk for other users, or for
              operational/legal reasons. Provisions that should survive (fees owed, IP,
              disclaimers, liability limits) will survive termination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">14. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by the laws of the jurisdiction in which REVWA
              operates its primary business entity, without regard to conflict-of-law
              principles. Courts in that jurisdiction shall have exclusive venue, unless
              applicable law requires otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">15. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms from time to time. The “Last updated” date will
              change when we do. Continued use after changes constitutes acceptance of the
              updated Terms. Material changes may be communicated by email or in-product
              notice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-xl font-semibold">16. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms:
            </p>
            <p className="text-foreground font-medium">
              Email:{" "}
              <a href="mailto:legal@revwa.com" className="text-primary hover:underline">
                legal@revwa.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            ← Back to home
          </Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
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
