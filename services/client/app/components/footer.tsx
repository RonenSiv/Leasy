import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t mt-16 pb-8">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Leasy</h3>
            <p className="text-sm">
              Leasy is an innovative platform designed to enhance your learning
              experience through advanced video content tools.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/home/features-section"
                  className="text-sm hover:underline"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Leasy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
