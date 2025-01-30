import { LegalPage } from "../components/legal/legal-page";

const termsContent = `
# Terms of Service

## Acceptance of Terms

By accessing or using Leasy, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.

## Use of Service

You agree to use Leasy only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.

## Intellectual Property

The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to Leasy are protected under applicable copyrights, trademarks and other proprietary rights.

## User Accounts

### Registration
You may be required to create an account to use certain features of our service.

### Account Security
You are responsible for maintaining the confidentiality of your account information.

### Account Termination
We reserve the right to terminate or suspend your account at our discretion.

## Content Guidelines

### User-Generated Content
You are solely responsible for the content you post on Leasy.

### Prohibited Content
You agree not to post content that is illegal, abusive, or violates the rights of others.

### Content Removal
We reserve the right to remove any content that violates these terms.

## Limitation of Liability

Leasy shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
`;

export default function TermsOfService() {
  return <LegalPage title="Terms of Service" content={termsContent} />;
}
