"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { CheckCircle, Shield, MapPin, Star, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion/variants";
import { formatPrice } from "@/lib/utils";

const PAYMENT_METHODS = [
  { id: "paypal",    label: "PayPal",      logo: "/images/payments/paypal.svg"      },
  { id: "mastercard",label: "Mastercard",  logo: "/images/payments/mastercard.svg"  },
  { id: "visa",      label: "Visa",        logo: "/images/payments/visa.svg"        },
  { id: "maestro",   label: "Maestro",     logo: "/images/payments/maestro.svg"     },
  { id: "apple",     label: "Apple Pay",   logo: "/images/payments/applepay.svg"    },
  { id: "amazon",    label: "Amazon Pay",  logo: "/images/payments/amazon.svg"      },
  { id: "google",    label: "Google Pay",  logo: "/images/payments/gpay.svg"        },
  { id: "stripe",    label: "Stripe",      logo: "/images/payments/stripe.svg"      },
] as const;

const cardSchema = z.object({
  firstName:  z.string().min(1, "Required"),
  lastName:   z.string().min(1, "Required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Enter 16-digit card number"),
  expiry:     z.string().regex(/^\d{2}\/\d{2}$/, "Format: MM/YY"),
  cvv:        z.string().regex(/^\d{3,4}$/, "3-4 digits"),
  country:    z.string().min(1, "Required"),
  city:       z.string().min(1, "Required"),
  state:      z.string().optional(),
  street:     z.string().min(1, "Required"),
  zipCode:    z.string().min(1, "Required"),
  saveCard:    z.boolean().optional(),
  saveAddress: z.boolean().optional(),
});
type CardForm = z.infer<typeof cardSchema>;

const TRIP = {
  title: "Maecenas tristique.",
  city:  "Makkah",
  rating: 4.8,
  reviews: 243,
  image: "/images/packages/detail1.jpg",
  dateFrom: "February 05",
  dateTo:   "March 14",
  guests: "1 Adult, 1 Youth, 1 Child",
  total:      50,
  serviceFee: 30,
  taxPct:     5,
  currency:   "USD",
};

function InputField({ label, id, placeholder, type = "text", error, ...rest }: {
  label?: string; id: string; placeholder: string; type?: string; error?: string;
  [k: string]: unknown;
}) {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-xs font-medium text-neutral-600 mb-1">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-700 placeholder:text-neutral-400 ${
          error ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white"
        }`}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [signedIn] = useState(true);
  const signedInEmail = "hosam.hesham@gmail.com";

  const { register, handleSubmit, formState: { errors } } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: { saveCard: true, saveAddress: true },
  });

  const taxAmount  = (TRIP.total + TRIP.serviceFee) * (TRIP.taxPct / 100);
  const totalAmount = TRIP.total + TRIP.serviceFee + taxAmount;

  const onSubmit = (data: CardForm) => {
    console.log("Submitting booking:", data);
    // TODO: call /bookings then redirect to payment gateway
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — form */}
          <div className="lg:col-span-2">
            {/* Signed-in banner */}
            {signedIn && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mb-6 text-sm text-neutral-600"
              >
                <span>{t("signedIn")} </span>
                <span className="text-primary-700 font-semibold">{signedInEmail}</span>
              </motion.div>
            )}

            {/* Payment method tiles */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-card p-6 mb-6"
            >
              <div className="grid grid-cols-4 gap-3 mb-5">
                {PAYMENT_METHODS.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    variants={staggerItem}
                    onClick={() => setPaymentMethod(id)}
                    className={`border-2 rounded-xl py-4 px-2 flex items-center justify-center transition-all ${
                      paymentMethod === id
                        ? "border-primary-700 bg-primary-50 shadow-green"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                    aria-label={label}
                    aria-pressed={paymentMethod === id}
                  >
                    <span className="text-xs font-bold text-neutral-700">{label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary-700" />
                  {t("secureTransmission")}
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary-700" />
                  {t("protectInfo")}
                </div>
              </div>
            </motion.div>

            {/* Card information */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-card p-6 mb-6"
              >
                <h2 className="font-display font-bold text-primary-700 mb-5">{t("cardInfo")}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField id="firstName" placeholder={t("firstName")} error={errors.firstName?.message} {...register("firstName")} />
                  <InputField id="lastName"  placeholder={t("lastName")}  error={errors.lastName?.message}  {...register("lastName")} />
                </div>
                <div className="mb-4">
                  <InputField id="cardNumber" placeholder={t("cardNumber")} error={errors.cardNumber?.message} {...register("cardNumber")} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField id="expiry" placeholder={t("expiry")} error={errors.expiry?.message} {...register("expiry")} />
                  <InputField id="cvv"    placeholder={t("securityCode")} error={errors.cvv?.message}    {...register("cvv")} />
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                  <input type="checkbox" {...register("saveCard")} className="w-4 h-4 rounded border-neutral-300 text-primary-700 accent-primary-700" />
                  {t("saveCard")}
                </label>
              </motion.div>

              {/* Billing address */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-card p-6 mb-6"
              >
                <h2 className="font-display font-bold text-primary-700 mb-5">{t("billingAddress")}</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {(["country","city","state"] as const).map((field) => (
                    <div key={field} className="relative">
                      <select
                        {...register(field)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-400 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-700 bg-white"
                      >
                        <option value="">{t(field)}</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <InputField id="street"  placeholder={t("street")}  error={errors.street?.message}  {...register("street")} />
                  <InputField id="zipCode" placeholder={t("zipCode")} error={errors.zipCode?.message} {...register("zipCode")} />
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                  <input type="checkbox" {...register("saveAddress")} className="w-4 h-4 rounded border-neutral-300 text-primary-700 accent-primary-700" />
                  {t("saveAddress")}
                </label>
              </motion.div>

              {/* Terms */}
              <p className="text-sm text-neutral-500 mb-5 leading-relaxed">
                By clicking &lsquo;Agree &amp; continue&rsquo; you are agreeing to our{" "}
                <Link href="/terms" className="text-primary-700 hover:underline font-medium">{t("terms")}</Link>,{" "}
                <Link href="/privacy" className="text-primary-700 hover:underline font-medium">{t("privacy")}</Link>,
                {" "}and to receive booking-related SMS texts. Standard messaging rates may apply.
              </p>

              <button type="submit" className="btn-primary w-full py-4 text-base font-semibold">
                {t("agreeBtn")}
              </button>
            </form>
          </div>

          {/* Right — trip summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
              {/* Package snapshot */}
              <div className="flex gap-3 mb-5 pb-5 border-b border-neutral-100">
                <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={TRIP.image} alt={TRIP.title} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-neutral-900 text-sm leading-tight mb-1">{TRIP.title}</p>
                  <p className="text-xs text-primary-700 flex items-center gap-0.5 mb-1">
                    <MapPin size={10} /> {TRIP.city}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#F59E0B" className="text-accent-500" />
                    <span className="text-xs font-medium">{TRIP.rating} ({TRIP.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              {[
                { label: "From", value: `${TRIP.dateFrom} – ${TRIP.dateTo}`, icon: "↗" },
                { label: "To",   value: `${TRIP.dateFrom} – ${TRIP.dateTo}`, icon: "↙" },
                { label: "Time", value: "Choose time",                       icon: "⏰" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 py-3 border-b border-neutral-100">
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-sm">
                    {icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-700">{label}</p>
                    <p className="text-sm text-neutral-600">{value}</p>
                  </div>
                </div>
              ))}

              {/* Guest */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-700">{t("guest")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-neutral-600">{TRIP.guests}</p>
                  <ChevronDown size={14} className="text-neutral-400" />
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 py-3 border-b border-neutral-100">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{t("total")}</span>
                  <span>{formatPrice(TRIP.total, TRIP.currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{t("serviceFee")}</span>
                  <span>{formatPrice(TRIP.serviceFee, TRIP.currency)}</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{t("tax")}</span>
                  <span>{TRIP.taxPct}%</span>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <span className="font-bold text-neutral-900">{t("totalAmount")}</span>
                <span className="font-bold text-xl text-accent-500">
                  {formatPrice(totalAmount, TRIP.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
