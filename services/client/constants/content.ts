export const securityPolicyContent = `
  # Security Policy

## 1. Overview

We take the security of our users' data very seriously. This Security Policy outlines the measures we take to protect the data and privacy of our users, ensuring that we adhere to industry standards and best practices. By using our platform, you agree to this policy.

---

## 2. Data Encryption

All sensitive data, including user credentials, personal information, and financial data, is encrypted both at rest and in transit. We use **AES-256 encryption** for data stored in our databases and **TLS (Transport Layer Security)** to secure data transmissions between users and our servers.

### Encryption in Transit

- All communications between the client (your browser) and our servers are encrypted using **HTTPS** and **TLS 1.2** or higher.

### Encryption at Rest

- Sensitive data is stored using **AES-256 encryption**, ensuring it remains secure even if unauthorized access occurs.

---

## 3. Password Management

We enforce **strong password policies** to ensure the security of user accounts. Users are required to create passwords that meet the following criteria:

- At least 8 characters in length.
- Must contain a combination of **upper-case**, **lower-case**, **numbers**, and **special characters**.

Additionally, all passwords are securely **hashed and salted** using **bcrypt** before being stored in our database, making them unreadable to anyone, including our staff.

---

## 4. Multi-Factor Authentication (MFA)

To provide an additional layer of security, we offer optional **Multi-Factor Authentication (MFA)** for user accounts. MFA helps protect your account by requiring an additional verification step when logging in, such as a one-time code sent to your mobile device or email.

---

## 5. Session Management

We use secure **session management** practices to ensure that user sessions are protected. **Session cookies** are encrypted and have a limited lifespan. We also implement **automatic session expiration** and **re-authentication** after periods of inactivity.

---

## 6. Account Activity Monitoring

We continuously monitor all user accounts for unusual activity. If any suspicious activity is detected (such as multiple failed login attempts or logins from unusual locations), we will:

- Automatically lock the account for security.
- Notify the user via email with instructions on how to regain access.

Users can also view recent login activities in their account settings to monitor their account’s security.

---

## 7. Data Access Control

Access to sensitive user data is restricted to **authorized personnel only**. We implement strict access controls and regularly audit access logs to ensure compliance with our internal security policies. Our staff undergoes regular security training to handle data appropriately.

---

## 8. Vulnerability Management

We actively monitor and address vulnerabilities in our systems and third-party services. Regular security audits and penetration testing are conducted to identify and resolve potential security threats.

- **Security Patches**: We apply security patches to our servers and applications promptly to mitigate any known vulnerabilities.
- **Bug Bounty Program**: We encourage security researchers to report vulnerabilities to us. Qualified reports may be eligible for rewards as part of our bug bounty program.

---

## 9. Incident Response Plan

In the event of a security breach, we have an established **Incident Response Plan (IRP)** that includes:

1. Immediate containment of the threat.
2. Investigation and assessment of the impact.
3. Notification to affected users within **72 hours**, as per regulatory requirements.
4. Remediation steps to prevent future incidents.

---

## 10. Data Retention and Deletion

User data is retained only for as long as necessary to fulfill the purposes for which it was collected or as required by applicable laws. Users have the right to request the deletion of their personal data, which will be securely removed from our systems.

---

## 11. Compliance with GDPR and CCPA

We comply with all relevant data protection regulations, including the **General Data Protection Regulation (GDPR)** and the **California Consumer Privacy Act (CCPA)**. Users have the right to:

- Access the data we hold about them.
- Request corrections to inaccurate data.
- Request the deletion of their data.

---

## 12. Reporting Security Issues

We encourage our users and security researchers to report any potential vulnerabilities they discover. If you believe you have found a security issue in our platform, please contact us at **security@example.com**. We will investigate the report and respond promptly.

---

## 13. Updates to this Security Policy

We may update this Security Policy from time to time to reflect changes in our practices or new security measures. We will notify users of significant updates via email or a prominent notice on our platform.

---

**Last Updated**: September 28, 2024

For any questions or concerns about our security practices, please contact us at **security@example.com**.
`;

export const AIPersona = `\
   You are an educational assistant for Leasy, helping users learn effectively through video lectures and chat interactions.
   Your role is to provide support by summarizing content, generating quizzes, and tracking progress.
   You are friendly, supportive, and highly efficient, always aiming to make learning accessible, engaging, and enjoyable.
   `;

export const AIKnowledge = `\
    Your knowledge is vast and diverse, covering a wide range of topics, including science, technology, history, and more.
    You have a knack for explaining complex concepts in simple terms, making learning easy and enjoyable for users.
    Your expertise in various subjects allows you to provide accurate information and valuable insights to learners.
    `;
