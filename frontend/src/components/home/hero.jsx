import React from "react";
import { Users, Clock, TrendingUp, UserPlus, Building2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";


const stats = [
  { icon: Users, label: "Active Users", value: "10,000+" },
  { icon: Clock, label: "Hours Tracked", value: "500M+" },
  { icon: TrendingUp, label: "Efficiency Gain", value: "35%" },
];

export default function Hero() {
  const heroBgUrl = "/images/clockbg.png";

  return (
    <section id="home" className="relative overflow-hidden">
      {/* Background image with soft tint */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-90"
          style={{ backgroundImage: `url(${heroBgUrl})` }}
        />
        <div className="absolute inset-0 bg-sky-100/20" />
      </div>

      {/* Content sits above background */}
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12 md:pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-600 text-sm font-medium mb-6">
                <Clock className="w-4 h-4 mr-2" />
                Smart Time Tracking Solution
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Streamline Your
                <span className="text-sky-600 block">Employee Hours</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mt-4 mb-8 max-w-2xl mx-auto lg:mx-0">
                CoreHours revolutionizes workforce management with intelligent time tracking, automated reporting, and real time insights that boost productivity by 35%.
              </p>

              <div className="flex flex-row gap-4 justify-center lg:justify-start mb-12">
  {/* Company Sign Up */}
  <Link
    to="/signup"
    className="text-sm flex-1 group inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-3 text-white font-semibold shadow hover:bg-amber-500 transition"
  >
    <UserPlus className="w-5 h-5 mr-2" />
    Company Sign Up
  </Link>

  {/* Company Login */}
  <Link
    to="/login"
    className="flex-1 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white ring-1 ring-gray-200 hover:bg-sky-600 transition"
  >
    <Building2 className="w-5 h-5 mr-2" />
    Company Login
  </Link>

  {/* Employee Login */}
  <Link
    to="/employeelogin"
    className="flex-1 inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white ring-1 ring-gray-200 hover:bg-sky-600 transition"
  >
    <LogIn className="w-5 h-5 mr-2" />
    Employee Login
  </Link>
</div>




              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start mb-2">
                      <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                        <s.icon className="w-4 h-4 text-sky-600" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{s.value}</span>
                    </div>
                    <span className="text-sm text-gray-600">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div className="relative">
              <div className="relative rounded-2xl bg-white shadow-sm p-8 border border-gray-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Get Daily Overview</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>

                  <div className="space-y-3">
                    <Row label="Active Employees" value="127" tone="sky" />
                    <Row label="Hours Logged Today" value="1,248" tone="amber" />
                    <Row label="Attendance Rate" value="98.5%" tone="green" />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Productivity Score</span>
                      <span className="font-semibold text-sky-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                      <div className="bg-sky-600 h-2 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end right */}
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, tone }) {
  const toneMap = {
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${toneMap[tone]}`}>
      <span className="text-sm">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
