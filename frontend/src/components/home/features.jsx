// src/components/features/Features.jsx
import React from "react";
import {
  Clock,
  Users,
  BarChart3,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  CalendarClock,
  ReceiptText,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="relative bg-gradient-to-b from-white to-sky-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 lg:pt-20">
        {/* Header */}
        <div className="text-center max-w-5xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
            Features and Capabilities
          </span>

          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 lg:whitespace-nowrap">
            Everything You Need to Manage Your Workforce
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            CoreHours provides a comprehensive suite of tools designed to streamline every aspect of
            employee time management and workforce optimization.
          </p>
        </div>

        {/* Top row */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Clock className="w-5 h-5 text-sky-600" />}
            title="Intelligent Time Tracking"
            desc="Automated time logging with smart break detection and project tags."
            tag="AI Powered"
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 text-sky-600" />}
            title="Team Collaboration"
            desc="Shared schedules, role based access, and approvals that fit your flow."
            tag="Real time"
          />
          <FeatureCard
            icon={<BarChart3 className="w-5 h-5 text-sky-600" />}
            title="Advanced Analytics"
            desc="Custom dashboards and reports to track productivity and costs."
            tag="Custom Reports"
          />
        </div>

        {/* Second grid */}
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Smartphone className="w-5 h-5 text-sky-600" />}
            title="Mobile First"
            desc="Native iOS and Android apps with GPS support and offline mode."
            tag="Offline Ready"
          />
          <FeatureCard
            icon={<Globe className="w-5 h-5 text-sky-600" />}
            title="Global Support"
            desc="Multi timezone scheduling with localization for 25 plus languages."
            tag="25 plus Languages"
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5 text-sky-600" />}
            title="Enterprise Security"
            desc="SOC 2 compliant encryption, SSO, and granular permissions."
            tag="SOC 2 Compliant"
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-sky-600" />}
            title="Quick Integration"
            desc="Connect with Slack, JIRA, QuickBooks and over 100 popular tools."
            tag="100 plus Integrations"
          />
          <FeatureCard
            icon={<CalendarClock className="w-5 h-5 text-sky-600" />}
            title="Smart Scheduling"
            desc="Auto plan shifts with conflict detection and overtime alerts."
            tag="Auto scheduling"
          />
          <FeatureCard
            icon={<ReceiptText className="w-5 h-5 text-sky-600" />}
            title="Payroll Integration"
            desc="Accurate exports with tax calculations and compliance checks."
            tag="Tax Compliant"
          />
        </div>

        {/* CTA banner */}
        <div className="mt-14">
          <div className="rounded-3xl bg-sky-600 text-white px-6 py-10 sm:px-10 lg:px-14">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold">
                Ready to Transform Your Workforce Management?
              </h3>
              <p className="mt-3 text-sky-100">
                Join thousands of companies already using CoreHours to boost productivity and
                streamline operations.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#get-started"
                  className="inline-flex items-center justify-center rounded-xl bg-white text-sky-600 px-6 py-3 font-semibold shadow hover:bg-sky-50 transition"
                >
                  Start Free Trial
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-xl border border-white/70 px-6 py-3 font-semibold hover:bg-white/10 transition"
                >
                  Schedule Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Card */
function FeatureCard({ icon, title, desc, tag }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-sky-50 ring-1 ring-gray-200 grid place-items-center">
          {icon}
        </div>
        {tag && (
          <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            {tag}
          </span>
        )}
      </div>
      <h4 className="mt-4 font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
