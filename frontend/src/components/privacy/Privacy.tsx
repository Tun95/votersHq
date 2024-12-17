import "./styles.scss";

function Privacy() {
  return (
    <div className="privacy_terms">
      <div className="container">
        {" "}
        <div className="content">
          <h1>Privacy Policy</h1>
          <p className="effective-date">Effective Date: 20/12/2024</p>
          <p>
            At VotersHQ, we value your privacy and are committed to protecting
            your personal information. This Privacy Policy outlines how we
            collect, use, store, and safeguard your data. By using our platform,
            you consent to the practices described in this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Identification Information:</strong> National
              Identification Number (NIN), name, email address, phone number,
              State of Origin, State of Residence, and date of birth.
            </li>
            <li>
              <strong>Activity Data:</strong> Votes cast on bills and polls,
              comments, and preferences.
            </li>
            <li>
              <strong>Technical Data:</strong> IP addresses, device information,
              and cookies for improving user experience.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Verifying your identity to ensure unique votes.</li>
            <li>
              Providing personalized content based on your State of Origin and
              Residence.
            </li>
            <li>
              Sending notifications about relevant bills, policies, and updates.
            </li>
            <li>Analyzing usage trends to improve our platform.</li>
          </ul>

          <h2>3. Data Security</h2>
          <p>
            We implement robust security measures to protect your personal
            information against unauthorized access, alteration, or loss. This
            includes data encryption, secure servers, and regular security
            audits.
          </p>

          <h2>4. Sharing Your Information</h2>
          <p>
            We do not sell or share your personal information with third
            parties, except:
          </p>
          <ul>
            <li>When required by law or government authorities.</li>
            <li>
              To trusted service providers under strict confidentiality
              agreements to improve our platform.
            </li>
          </ul>

          <h2>5. User Rights</h2>
          <ul>
            <li>Access your personal data.</li>
            <li>Request corrections to inaccurate information.</li>
            <li>Delete your account and associated data upon request.</li>
          </ul>

          <h2>6. Cookies and Tracking</h2>
          <p>
            We use cookies to enhance your experience, such as remembering your
            preferences. You can disable cookies in your browser settings, but
            this may limit platform functionality.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Any changes will be
            communicated through the platform with the updated effective date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise
            your rights, contact us at:
          </p>
          <p>
            Email: <a href="mailto:hello@votershq.com">hello@votershq.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
