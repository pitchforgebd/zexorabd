export default function PrivacyPolicy() {
  return (
    <div className="bg-light-gray pt-24 min-h-screen">
      <section className="bg-primary-blue text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Privacy Policy</h1>
        <p className="text-blue-100">Last updated: 2026</p>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-10 text-sm">
          This is a draft policy describing how this website currently handles data. It has not been reviewed by
          legal counsel and should be reviewed before being relied on as a compliance document.
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 space-y-8 text-body-text leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Who We Are</h2>
            <p>
              Zexora Corporation ("we", "us", "our") is a diversified business group based at 292, Inner Circular
              Road, Shatabdi Centre, Fakirapool, Motijheel, Dhaka-1000, Bangladesh. This policy explains what
              information we collect through zexora.com.bd and how we use it.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Information We Collect</h2>
            <p className="mb-3">We only collect information you choose to give us, through two forms on this site:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Contact form:</strong> your name, company, email address, phone number, subject, and
                message.
              </li>
              <li>
                <strong>Career application form:</strong> your full name, email address, phone number, position
                applied for, education, years of experience, cover letter, any additional message, and the CV/resume
                file you upload (PDF, DOC, or DOCX).
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising or analytics tracking cookies. The only third-party services this site loads
              are Google Fonts (for typeface delivery) and, on the Contact page, an embedded Google Map — both of
              which may receive standard technical request data (such as your IP address) directly from your
              browser, governed by Google's own privacy policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to inquiries submitted through the contact form.</li>
              <li>To review and process job applications submitted through the career form.</li>
              <li>We do not sell, rent, or share your information with third parties for marketing purposes.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">How We Store Your Information</h2>
            <p>
              Submitted form data, including uploaded CV files, is stored on our servers and is accessible only to
              authorized Zexora staff who manage inquiries and applications through our internal admin system, which
              is protected by a login and is not publicly accessible.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Cookies</h2>
            <p>
              This site does not use tracking or advertising cookies for visitors. A small number of technical
              cookies are used only when an authorized staff member logs into the admin system, to keep that session
              secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of the information you've submitted to us at
              any time by contacting us using the details below.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary-dark mb-3">Contact Us</h2>
            <p>
              For any privacy-related questions, reach us at{' '}
              <a href="mailto:info@zexora.com.bd" className="text-primary-blue hover:underline">
                info@zexora.com.bd
              </a>{' '}
              or{' '}
              <a href="tel:+8801855939450" className="text-primary-blue hover:underline">
                +880 1855 939 450
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
