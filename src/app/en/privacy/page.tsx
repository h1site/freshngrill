import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Menu Cochon',
  description: 'Privacy policy and personal data protection for Menu Cochon.',
  alternates: {
    canonical: '/en/privacy/',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6">
              Privacy Policy
            </h1>
            <p className="text-neutral-400 text-lg">
              Last updated: December 2024
            </p>
            <div className="w-16 h-1 bg-[#F77313] mt-8" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-neutral">
            <h2>Introduction</h2>
            <p>
              Welcome to Menu Cochon. We take the protection of your personal data
              very seriously. This privacy policy explains how we collect, use and
              protect your information when you use our website.
            </p>

            <h2>Data Collection</h2>
            <p>We may collect the following information:</p>
            <ul>
              <li>
                <strong>Contact information</strong>: name, email address when you
                contact us via our form or subscribe to our newsletter.
              </li>
              <li>
                <strong>Browsing data</strong>: information about your device,
                browser, pages visited and time spent on the site via cookies.
              </li>
              <li>
                <strong>Preferences</strong>: your favorite recipes and browsing
                preferences saved locally.
              </li>
            </ul>

            <h2>Use of Data</h2>
            <p>Your data is used to:</p>
            <ul>
              <li>Respond to your questions and requests</li>
              <li>Send you our newsletter if you are subscribed</li>
              <li>Improve our website and services</li>
              <li>Analyze website usage through analytics tools</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Our site uses cookies to improve your experience. Cookies are small
              files stored on your device that allow us to:
            </p>
            <ul>
              <li>Remember your preferences</li>
              <li>Analyze site traffic (Google Analytics)</li>
              <li>Display relevant advertisements (Google AdSense)</li>
            </ul>
            <p>
              You can configure your browser to refuse cookies, but some site
              features may not work properly.
            </p>

            <h2>Data Sharing</h2>
            <p>
              We do not sell your personal data. We may share information with:
            </p>
            <ul>
              <li>
                <strong>Google Analytics</strong>: to analyze site usage
              </li>
              <li>
                <strong>Google AdSense</strong>: to display advertisements
              </li>
              <li>
                <strong>Supabase</strong>: for secure data storage
              </li>
            </ul>

            <h2>Security</h2>
            <p>
              We implement appropriate security measures to protect your data
              against unauthorized access, modification, disclosure or destruction.
              All communications are encrypted via HTTPS.
            </p>

            <h2>Your Rights</h2>
            <p>In accordance with applicable laws, you have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Rectify your data if it is inaccurate</li>
              <li>Request deletion of your data</li>
              <li>Object to the processing of your data</li>
              <li>Withdraw your consent at any time</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary for the
              purposes described in this policy, unless a longer retention period
              is required by law.
            </p>

            <h2>Changes</h2>
            <p>
              We reserve the right to modify this privacy policy at any time.
              Changes will be posted on this page with an updated date.
            </p>

            <h2>Contact</h2>
            <p>
              For any questions regarding this privacy policy or your personal
              data, please contact us via our{' '}
              <a href="/en/contact" className="text-[#F77313] hover:underline">
                contact form
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
