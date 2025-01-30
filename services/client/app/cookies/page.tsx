import { LegalPage } from "../components/legal/legal-page";

const cookiesContent = `
# Cookie Policy

## What are cookies?

Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.

## How we use cookies

We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as 'essential' or 'strictly necessary' cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.

## Types of cookies we use

### Essential cookies
These are cookies that are required for the operation of our website.

### Analytical/performance cookies
These allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it.

### Functionality cookies
These are used to recognize you when you return to our website.

### Targeting cookies
These cookies record your visit to our website, the pages you have visited and the links you have followed.

## How to control cookies

You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.

## Changes to This Policy

We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the 'last updated' date at the top of this page.
`;

export default function CookiePolicy() {
  return <LegalPage title="Cookie Policy" content={cookiesContent} />;
}
