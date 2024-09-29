"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "./styles.css"; // Scoped styles

export default function TermsAndConditions() {
  return (
    <div className="terms-container py-6 md:py-12 lg:py-16 bg-background text-foreground">
      <div className="container px-4 md:px-6">
        <Card className="prose prose-gray dark:prose-invert max-w-none">
          <CardContent>
            {/* Header Section */}
            <div className="py-4 space-y-2 border-b border-border dark:border-muted">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground">
                Last updated: September 28, 2024
              </p>
            </div>

            {/* Content Section */}
            <div className="mx-auto prose max-w-none flex flex-col gap-2">
              <p>
                These Terms and Conditions outline the rules and regulations for
                the use of the **Leasy** platform, located at{" "}
                <Link href="https://leasy.com" prefetch={false}>
                  https://leasy.com
                </Link>
                .
              </p>
              <p>
                By accessing and using this platform, we assume you accept these
                terms and conditions. If you do not agree to any of these terms,
                please refrain from using Leasy’s services.
              </p>

              <h2>Platform Overview</h2>
              <p>
                **Leasy** is an educational platform designed to help students
                by summarizing lecture videos and providing interactive quizzes
                to test knowledge. By using **Leasy**, you are agreeing to use
                the platform responsibly and for educational purposes only.
              </p>

              <h2>Account Usage</h2>
              <p>
                To use certain features of the platform, you may be required to
                create an account. You are responsible for maintaining the
                confidentiality of your account and password and for all
                activities under your account.
              </p>

              <h2>License</h2>
              <p>
                Unless stated otherwise, **Leasy** and/or its licensors own the
                intellectual property rights to all material on this platform.
                You may access Leasy for personal, non-commercial use only.
              </p>
              <h2>You must not:</h2>
              <ul>
                <li>Republish material from Leasy without permission.</li>
                <li>
                  Sell, rent, or sub-license material from Leasy without written
                  consent.
                </li>
                <li>Reproduce, duplicate, or copy content from Leasy.</li>
              </ul>

              <h2>Content Responsibility</h2>
              <p>
                Leasy provides AI-generated content, including lecture
                summaries, quizzes, and study aids. While we aim for accuracy,
                users should cross-reference content. Leasy is not responsible
                for any inaccuracies or misuse of the content.
              </p>

              <h2>Subscriptions & Payments</h2>
              <p>
                Leasy offers both free and paid subscription plans. Subscription
                fees are charged upfront and are non-refundable. Paid features
                include advanced quizzes, extended video summaries, and
                personalized study recommendations.
              </p>

              <h2>Termination</h2>
              <p>
                We may suspend or terminate your account if you violate these
                terms. You may also request to terminate your account by
                discontinuing use of the platform. Upon termination, your right
                to use the service will cease immediately.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                Leasy will not be held liable for any indirect, incidental, or
                consequential damages, including loss of data or content errors.
                Our liability is limited to the amount paid for the service (if
                any).
              </p>

              <h2>Privacy Policy</h2>
              <p>
                Your use of Leasy is also governed by our{" "}
                <Link href="/privacy-policy" prefetch={false}>
                  Privacy Policy
                </Link>
                , which outlines how we collect and use your data. Please review
                it carefully before using our platform.
              </p>

              <h2>Changes to These Terms</h2>
              <p>
                Leasy reserves the right to modify these Terms at any time. We
                will notify you of any changes via email or through the
                platform. Continued use of Leasy after the changes have been
                made constitutes your acceptance of the new terms.
              </p>

              <Separator className="my-8" />

              {/* FAQs Section */}
              <div className="max-w-3xl space-y-4">
                <h2 className="text-lg font-bold">FAQs</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>
                      What are the terms and conditions for?
                    </AccordionTrigger>
                    <AccordionContent>
                      The terms and conditions are for the use of Leasy,
                      including the platform and services offered.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>
                      Can I link to the Leasy website?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, the following organizations may link to our Website
                      without prior written approval: Government agencies,
                      search engines, news organizations, and online directory
                      distributors.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>
                      How do I contact Leasy about the terms and conditions?
                    </AccordionTrigger>
                    <AccordionContent>
                      If you find any issue with our terms and conditions, feel
                      free to contact us through the contact details provided in
                      the site’s contact section.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
