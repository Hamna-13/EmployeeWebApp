// src/components/footer/Footer.jsx
import React from "react";
import { Clock, ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const onSubscribe = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="relative bg-gradient-to-b from-white to-sky-100/50">
      {/* Full width blue band, no rounded corners */}
      <div className="w-full bg-sky-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          
          
          {/* Columns */}
          <div className="mt-1 grid md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Brand block */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 ring-1 ring-white/20 grid place-items-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">CoreHours</span>
              </div>

              <p className="mt-4 text-sky-100">
                The modern workforce management platform that helps businesses optimize productivity
                and streamline employee time tracking.
              </p>

              <div className="mt-6 space-y-2 text-sky-100">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@corehours.com
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 555 123 4567
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  New York, NY 10001
                </p>
              </div>
            </div>

            <FooterCol
              title="Product"
              links={[
                ["Features", "#features"],
                ["Pricing", "#"],
                ["Integrations", "#"],
                ["API Documentation", "#"],
                ["Mobile Apps", "#"],
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                ["About Us", "#about"],
                ["Careers", "#"],
                ["Blog", "#"],
                ["Press", "#"],
                ["Partners", "#"],
              ]}
            />
            <FooterCol
              title="Support"
              links={[
                ["Help Center", "#"],
                ["Contact Us", "#contact"],
                ["System Status", "#"],
                ["Security", "#"],
                ["Compliance", "#"],
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                ["Privacy Policy", "#"],
                ["Terms of Service", "#"],
                ["Cookie Policy", "#"],
                ["GDPR", "#"],
                ["Accessibility", "#"],
              ]}
            />
          </div>

          {/* Bottom bar */}
          <div className="mt-10 h-px bg-white/10" />
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-sky-100">
            <p>© {new Date().getFullYear()} CoreHours</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-semibold text-white">{title}</h4>
      <ul className="mt-4 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sky-100 hover:text-white transition">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
