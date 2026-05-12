"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Globe, Bell, Shield, CreditCard, Mail, Lock } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion/variants";

const TABS = [
  { id: "general",      label: "General",       icon: Globe    },
  { id: "notifications",label: "Notifications", icon: Bell     },
  { id: "security",     label: "Security",      icon: Shield   },
  { id: "payments",     label: "Payments",      icon: CreditCard },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
      <h3 className="font-semibold text-slate-900 mb-5 text-sm">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 mb-5 last:mb-0">
      <div className="sm:w-48 flex-shrink-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

const inputClass = "w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure platform behaviour, notifications, and security.</p>
      </div>

      {/* Tabs */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible"
        className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            variants={staggerItem}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
              activeTab === id
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Icon size={14} /> {label}
          </motion.button>
        ))}
      </motion.div>

      {/* General */}
      {activeTab === "general" && (
        <>
          <SectionCard title="Platform Information">
            <Field label="Platform Name" hint="Shown in emails and the browser tab">
              <input defaultValue="Umrah Platform" className={inputClass} />
            </Field>
            <Field label="Support Email" hint="Receives all user queries">
              <input defaultValue="support@umrahplatform.com" className={inputClass} />
            </Field>
            <Field label="Support Phone">
              <input defaultValue="+966 11 234 5678" className={inputClass} />
            </Field>
            <Field label="Default Language">
              <select defaultValue="en" className={inputClass}>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </Field>
            <Field label="Default Currency">
              <select defaultValue="usd" className={inputClass}>
                <option value="usd">US Dollar (USD)</option>
                <option value="sar">Saudi Riyal (SAR)</option>
                <option value="eur">Euro (EUR)</option>
              </select>
            </Field>
          </SectionCard>

          <SectionCard title="Platform Features">
            <Field label="User Registration" hint="Allow new users to register">
              <Toggle defaultChecked={true} />
            </Field>
            <Field label="Agency Applications" hint="Allow agencies to apply for listing">
              <Toggle defaultChecked={true} />
            </Field>
            <Field label="Guest Checkout" hint="Allow booking without an account">
              <Toggle defaultChecked={false} />
            </Field>
            <Field label="Reviews & Ratings" hint="Show public user reviews on packages">
              <Toggle defaultChecked={true} />
            </Field>
            <Field label="Maintenance Mode" hint="Show a maintenance page to all visitors">
              <Toggle defaultChecked={false} />
            </Field>
          </SectionCard>
        </>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <SectionCard title="Email Notification Triggers">
          {[
            { label: "New User Registration",       hint: "When a user creates an account",      on: true  },
            { label: "New Booking",                 hint: "When any booking is confirmed",        on: true  },
            { label: "Agency Application",          hint: "When an agency applies for review",   on: true  },
            { label: "Booking Cancellation",        hint: "When a booking is cancelled",          on: true  },
            { label: "Payout Request",              hint: "When an agency requests a payout",    on: true  },
            { label: "Payment Failure",             hint: "When a payment transaction fails",     on: true  },
            { label: "Weekly Revenue Summary",      hint: "Automated weekly digest email",        on: false },
            { label: "Low Inventory Alert",         hint: "When a package has < 3 seats left",   on: false },
          ].map(({ label, hint, on }) => (
            <Field key={label} label={label} hint={hint}>
              <Toggle defaultChecked={on} />
            </Field>
          ))}
        </SectionCard>
      )}

      {/* Security */}
      {activeTab === "security" && (
        <>
          <SectionCard title="Admin Password">
            <Field label="Current Password">
              <input type="password" placeholder="••••••••" className={inputClass} />
            </Field>
            <Field label="New Password">
              <input type="password" placeholder="••••••••" className={inputClass} />
            </Field>
            <Field label="Confirm Password">
              <input type="password" placeholder="••••••••" className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard title="Two-Factor Authentication">
            <Field label="Require 2FA for Admins" hint="All admin accounts must use 2FA">
              <Toggle defaultChecked={false} />
            </Field>
            <Field label="Require 2FA for Agencies" hint="Agency accounts must use 2FA">
              <Toggle defaultChecked={false} />
            </Field>
          </SectionCard>

          <SectionCard title="Session & Access">
            <Field label="Session Timeout" hint="Auto logout after inactivity">
              <select defaultValue="60" className={inputClass}>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="480">8 hours</option>
              </select>
            </Field>
            <Field label="IP Whitelist" hint="Restrict admin access to these IPs (one per line)">
              <textarea rows={3} placeholder="Leave blank to allow all IPs" className={`${inputClass} resize-none`} />
            </Field>
          </SectionCard>
        </>
      )}

      {/* Payments */}
      {activeTab === "payments" && (
        <>
          <SectionCard title="Platform Commission">
            <Field label="Commission Rate (%)" hint="Percentage taken from each booking">
              <input type="number" defaultValue="10" min="0" max="30" className={inputClass} />
            </Field>
            <Field label="Payout Schedule" hint="How often agencies receive payouts">
              <select defaultValue="weekly" className={inputClass}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </Field>
            <Field label="Minimum Payout" hint="Minimum balance before payout is triggered">
              <input type="number" defaultValue="500" min="0" className={inputClass} />
            </Field>
          </SectionCard>

          <SectionCard title="Payment Gateways">
            {[
              { name: "Stripe", hint: "Credit/debit card processing",  on: true  },
              { name: "PayPal", hint: "PayPal wallet payments",         on: true  },
              { name: "Apple Pay", hint: "Apple Pay on iOS devices",    on: false },
              { name: "Google Pay", hint: "Google Pay on Android",      on: false },
            ].map(({ name, hint, on }) => (
              <Field key={name} label={name} hint={hint}>
                <Toggle defaultChecked={on} />
              </Field>
            ))}
          </SectionCard>
        </>
      )}

      {/* Save button */}
      <div className="flex justify-end mt-2">
        <button className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
}
