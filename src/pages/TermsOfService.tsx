export default function TermsOfService() {
  return (
    <div className="bg-light-gray pt-24 min-h-screen">
      <section className="bg-primary-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Terms of Service</h1>
        <p className="text-blue-100 text-center">Last updated: 2026</p>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-10 text-sm">
          This is a draft terms-of-service document. It has not been reviewed by legal counsel and should be
          reviewed before being relied on as a binding legal document.
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-body-text leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Acceptance of Terms</h2>
            <p>
              By accessing or using zexora.com.bd (the "Site"), operated by Zexora Corporation, you agree to be
              bound by these Terms of Service. If you do not agree, please do not use the Site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Use of the Site</h2>
            <p>
              This Site provides information about Zexora Corporation's business divisions, products, and services,
              and allows visitors to submit inquiries and job applications. You agree to use the Site only for
              lawful purposes and to provide accurate information when submitting any form.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Intellectual Property</h2>
            <p>
              All content on this Site — including text, images, logos, and graphics — is the property of Zexora
              Corporation or its licensors, unless otherwise noted, and may not be reproduced or used without prior
              written permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Job Applications</h2>
            <p>
              Submitting a career application through this Site does not guarantee an interview, offer, or
              employment. Zexora Corporation reserves the right to accept or decline any application at its sole
              discretion.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">No Warranty</h2>
            <p>
              This Site and its content are provided "as is." While we try to keep information accurate and
              up to date, we make no guarantee that all content is complete, current, or error-free.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Zexora Corporation is not liable for any indirect, incidental,
              or consequential damages arising from your use of, or inability to use, this Site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the Site after changes are posted
              constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Governing Law</h2>
            <p>These Terms are governed by the laws of the People's Republic of Bangladesh.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Contact Us</h2>
            <p>
              Questions about these Terms can be sent to{' '}
              <a href="mailto:info@zexora.com.bd" className="text-primary-blue hover:underline">
                info@zexora.com.bd
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
