// src/components/about/About.jsx
import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="relative bg-gradient-to-b from-white to-sky-100/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-100 text-sky-600 text-sm font-medium">
            About CoreHours
          </span>

          <h2 className="mt-6 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
            The Future of Workforce Management
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            CoreHours combines cutting edge technology with intuitive design to deliver the most
            comprehensive employee time tracking solution for modern businesses.
          </p>
        </div>

        <div className="mt-14 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900">Built for Modern Workplaces</h3>

            <p className="mt-3 text-gray-600 leading-relaxed">
              We believe that effective time management should not be complicated.
              CoreHours is powerful yet intuitive, giving you complete visibility into your
              workforce while respecting employee privacy and autonomy.
            </p>

            <ul className="mt-6 grid sm:grid-cols-2 gap-4">
              {benefits.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            
          </div>
        </div>
      </div>
    </section>
  );
}

const benefits = [
  "Reduce administrative overhead by 60%",
  "Increase team productivity by 35%",
  "Ensure 100% payroll accuracy",
  "Real time project cost tracking",
  "Automated compliance reporting",
  "Mobile first employee experience",
];
