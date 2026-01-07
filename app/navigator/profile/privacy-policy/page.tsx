import { Box } from '@mui/material'
import React from 'react'

export const metadata = {
  title: 'Privacy Policy | Uvuyoga',
  description:
    'Read the Uvuyoga privacy policy to learn how we protect your data and respect your privacy.',
}

const PrivacyPolicyPage = () => (
  <Box style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
    <h1>Privacy Policy</h1>
    <p>
      <strong>Last Updated: July 30th, 2025</strong>
    </p>
    <p>
      At Uvuyoga, your privacy is important to us. This Privacy Policy explains
      how we collect, use, disclose, and safeguard your information when you use
      our mobile application and website (collectively, the “App”). Please read
      this policy carefully to understand your rights and our practices.
    </p>
    <h2>1. Information We Collect</h2>
    <h3>a. Personal Data</h3>
    <ul>
      <li>
        Name, email address, and any other information you provide when you
        register or contact us. When using social logins like Google or Github
        we can collect any of the data shared with them through their
        permissions.
      </li>
      <li>
        Optional data, such as profile photo or preferences if you choose to
        enter them.
      </li>
    </ul>
    <h3>b. Usage Data</h3>
    <ul>
      <li>
        App activity, session logs, device information (e.g., model, OS, browser
        type).
      </li>
      <li>IP address and approximate location.</li>
    </ul>
    <h3>c. Cookies and Tracking</h3>
    <ul>
      <li>
        We use cookies and similar technologies to improve the app experience,
        provide analytics, and personalize content.
      </li>
    </ul>
    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>Provide and maintain the app.</li>
      <li>Customize your experience and track your practice progress.</li>
      <li>Communicate with you about updates or support.</li>
      <li>Analyze usage to improve the app.</li>
      <li>Comply with legal obligations.</li>
    </ul>
    <h2>3. Sharing Your Information</h2>
    <ul>
      <li>We do not sell your personal information. We may share it with:</li>
      <ul>
        <li>Service providers (e.g., email delivery, hosting, analytics).</li>
        <li>Legal authorities if required by law.</li>
        <li>With your consent.</li>
      </ul>
    </ul>
    <h2>4. Data Retention</h2>
    <p>
      We keep your information only as long as necessary to fulfill the purposes
      stated in this policy, or as required by law.
    </p>
    <h2>5. Security</h2>
    <p>
      We implement appropriate technical and organizational measures to protect
      your data, including encryption, secure servers, and access controls.
    </p>
    <h2>6. Your Rights</h2>
    <p>
      If you are in the European Union or the UK, you have rights under the
      General Data Protection Regulation (GDPR):
    </p>
    <ul>
      <li>Right to Access – You can request a copy of your data.</li>
      <li>
        Right to Rectify – You can update incorrect or incomplete information.
      </li>
      <li>Right to Erasure – You can ask us to delete your data.</li>
      <li>
        Right to Restrict Processing – You may limit how we use your data.
      </li>
      <li>
        Right to Data Portability – You can ask to receive your data in a
        structured format.
      </li>
      <li>Right to Object – You can object to how your data is used.</li>
    </ul>
    <p>
      To exercise these rights, contact us at:{' '}
      <a href="mailto:trewaters@hotmail.com">trewaters@hotmail.com</a>
    </p>
    <h2>7. International Users</h2>
    <p>
      If you are accessing the app from outside the United States, your data may
      be transferred to, stored, and processed in the U.S. By using the app, you
      consent to such transfer and processing.
    </p>
    <h2>8. Children’s Privacy</h2>
    <p>
      We do not knowingly collect personal data from children under the age of
      13 (or under 16 in the EU) without parental consent.
    </p>
    <h2>9. Changes to This Policy</h2>
    <p>
      We may update this policy from time to time. You will be notified of any
      material changes through the app or by email.
    </p>
    <h2>10. Contact Us</h2>
    <p>
      For privacy-related questions or requests, please contact:
      <br />
      Uvuyoga Support
      <br />
      Email: <a href="mailto:trewaters@hotmail.com">trewaters@hotmail.com</a>
      <br />
      Address: TBD
    </p>
  </Box>
)

export default PrivacyPolicyPage
