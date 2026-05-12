"use client";

import { useState } from "react";
import { Building2, Mail, Phone, Globe, FileText, Save } from "lucide-react";

export default function AgencySettingsPage() {
  const [form, setForm] = useState({
    tradeName:   "Al-Noor Travel & Tours",
    email:       "info@alnoor-travel.com",
    phone:       "+966 50 123 4567",
    website:     "www.alnoor-travel.com",
    description: "Specializing in premium Umrah and Hajj packages since 2010. We provide tailored pilgrimage experiences with experienced guides and 5-star accommodations.",
    address:     "King Fahd Road, Riyadh 11564, Saudi Arabia",
    license:     "TA-SAU-2024-00892",
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl">

      <div>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f1416" }}>Settings</h2>
        <p style={{ fontSize: "12px", color: "#b0b8bc", marginTop: "2px" }}>Manage your agency profile</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">

        {/* Agency Profile */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Building2 size={16} style={{ color: "#0d7434" }} />
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f1416" }}>Agency Profile</p>
          </div>

          <div className="space-y-4">
            <Field label="Trade / Agency Name" icon={<Building2 size={14} />}>
              <input
                type="text"
                value={form.tradeName}
                onChange={handleChange("tradeName")}
                className="field-input"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email Address" icon={<Mail size={14} />}>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="field-input"
                />
              </Field>
              <Field label="Phone Number" icon={<Phone size={14} />}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="field-input"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Website" icon={<Globe size={14} />}>
                <input
                  type="text"
                  value={form.website}
                  onChange={handleChange("website")}
                  className="field-input"
                />
              </Field>
              <Field label="License Number" icon={<FileText size={14} />}>
                <input
                  type="text"
                  value={form.license}
                  onChange={handleChange("license")}
                  className="field-input"
                />
              </Field>
            </div>

            <Field label="Office Address">
              <input
                type="text"
                value={form.address}
                onChange={handleChange("address")}
                className="field-input"
              />
            </Field>

            <Field label="Agency Description">
              <textarea
                rows={4}
                value={form.description}
                onChange={handleChange("description")}
                className="field-input resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f1416", marginBottom: "16px" }}>Notifications</p>
          <div className="space-y-3">
            {[
              { label: "New booking notifications",    sub: "Get notified when a customer books a package"  },
              { label: "Cancellation alerts",          sub: "Receive alerts when a booking is cancelled"    },
              { label: "Review notifications",         sub: "Know when customers leave reviews"             },
              { label: "Weekly performance report",    sub: "Summary of bookings and revenue every Monday"  },
            ].map(({ label, sub }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f1416" }}>{label}</p>
                  <p style={{ fontSize: "11px", color: "#b0b8bc" }}>{sub}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                    style={{ backgroundColor: "#0d7434" }} />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#0d7434", color: "#fff" }}
          >
            <Save size={15} />
            Save Changes
          </button>
          {saved && (
            <span style={{ fontSize: "13px", color: "#0d7434", fontWeight: 600 }}>
              ✓ Saved successfully
            </span>
          )}
        </div>
      </form>

      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 13px;
          color: #0f1416;
          outline: none;
          transition: border-color 0.15s;
          background: #fafbfc;
        }
        .field-input:focus {
          border-color: #0d7434;
        }
      `}</style>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon && <span style={{ color: "#0d7434" }}>{icon}</span>}
        <label style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </label>
      </div>
      {children}
    </div>
  );
}
