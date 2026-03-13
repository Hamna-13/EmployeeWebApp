// src/components/contact/Contact.jsx
import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

export default function Contact() {
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="relative bg-gradient-to-b from-white to-sky-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium">
            <Mail className="w-4 h-4" />
            Get in Touch
          </span>

          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            Ready to Get Started?
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Have questions about CoreHours? Our team is here to help you find the perfect workforce
            management solution for your business.
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: form card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Full Name *" placeholder="John Doe" />
                  <Input label="Email Address *" type="email" placeholder="john@company.com" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Company Name" placeholder="Acme Inc." />
                  <Input label="Phone" type="tel" placeholder="+1 555 0100" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option>General inquiry</option>
                    <option>Pricing</option>
                    <option>Technical support</option>
                    <option>Schedule a demo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your workforce management needs..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="pt-2 flex justify-center">
  <button
    type="submit"
    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white px-6 py-3 font-semibold shadow hover:bg-sky-800 transition"
  >
    <Send className="w-5 h-5" />
    Send Message
  </button>
</div>

              </form>
            </div>
          </div>

          {/* Right: plain contact information (no card) */}
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              <InfoRow
                icon={<Mail className="w-5 h-5 text-sky-600" />}
                title="Email Us"
                main="hello@corehours.com"
                sub="We'll respond within 24 hours"
              />
              <InfoRow
                icon={<Phone className="w-5 h-5 text-sky-600" />}
                title="Call Us"
                main="+1 555 123 4567"
                sub="Mon–Fri, 9AM–6PM EST"
              />
              <InfoRow
                icon={<MapPin className="w-5 h-5 text-sky-600" />}
                title="Visit Us"
                main="123 Business Ave, Suite 100"
                sub="San Francisco, CA"
              />
              <InfoRow
                icon={<Clock className="w-5 h-5 text-sky-600" />}
                title="Business Hours"
                main="Monday to Friday"
                sub="9AM–6PM local time"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Small pieces */
function Input({ label, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}

function InfoRow({ icon, title, main, sub }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-sky-50 ring-1 ring-gray-200 grid place-items-center">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-gray-700">{main}</div>
        <div className="text-sm text-gray-500">{sub}</div>
      </div>
    </div>
  );
}
