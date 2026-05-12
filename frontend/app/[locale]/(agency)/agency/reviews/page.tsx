"use client";

import { Star } from "lucide-react";

const REVIEWS = [
  {
    id: 1, reviewer: "Ahmed Al-Rashidi", pkg: "Umrah Economy 7-Day", rating: 5,
    date: "2024-10-29",
    comment: "Exceptional service from start to finish. The hotel was walking distance from the Haram, and the guides were knowledgeable. Highly recommended.",
    avatar: "A",
  },
  {
    id: 2, reviewer: "Fatima Hassan", pkg: "VIP Hajj Package", rating: 4,
    date: "2024-10-28",
    comment: "Well-organized trip with comfortable accommodations. A few minor delays during transportation but overall a wonderful experience.",
    avatar: "F",
  },
  {
    id: 3, reviewer: "Muhammad Yusuf", pkg: "Madinah Ziyarah 5-Day", rating: 5,
    date: "2024-10-27",
    comment: "Beautiful experience. The Ziyarah tour covered all major sites with a wonderful scholar explaining the historical significance. Will book again.",
    avatar: "M",
  },
  {
    id: 4, reviewer: "Sara Al-Amri", pkg: "Umrah Premium 10-Day", rating: 4,
    date: "2024-10-26",
    comment: "Premium package was worth every penny. Spacious rooms, private transport, and the team was always available for assistance.",
    avatar: "S",
  },
  {
    id: 5, reviewer: "Omar Al-Farouq", pkg: "Budget Umrah 5-Day", rating: 3,
    date: "2024-10-25",
    comment: "Decent value for the price. The hotel was a bit far from the Haram but transportation was arranged. Could improve on meal quality.",
    avatar: "O",
  },
  {
    id: 6, reviewer: "Khalid Al-Otaibi", pkg: "Family Umrah 14-Day", rating: 5,
    date: "2024-10-24",
    comment: "Travelling with the family was made so easy by this agency. Special needs of children were well catered for throughout the journey.",
    avatar: "K",
  },
];

const AVATAR_COLORS = ["#0d7434", "#1abc9c", "#e9c46a", "#9b7fd4", "#f4a261", "#2d6a4f"];

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < rating ? "#F59E0B" : "none"}
          stroke={i < rating ? "#F59E0B" : "#d1d5db"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function AgencyReviewsPage() {
  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0f1416" }}>Reviews</h2>
          <p style={{ fontSize: "12px", color: "#b0b8bc", marginTop: "2px" }}>{REVIEWS.length} reviews</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
          <span style={{ fontSize: "15px", fontWeight: 700, color: "#0f1416" }}>{avgRating.toFixed(1)}</span>
          <span style={{ fontSize: "12px", color: "#b0b8bc" }}>avg rating</span>
        </div>
      </div>

      {/* Rating summary bar */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}>
        <div className="grid grid-cols-5 gap-3">
          {[5, 4, 3, 2, 1].map(star => {
            const count = REVIEWS.filter(r => r.rating === star).length;
            const pct   = Math.round((count / REVIEWS.length) * 100);
            return (
              <div key={star} className="flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0f1416" }}>{star}</span>
                  <Star size={11} fill="#F59E0B" stroke="#F59E0B" />
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", backgroundColor: "#f0f2f4" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#F59E0B" }} />
                </div>
                <span style={{ fontSize: "10px", color: "#b0b8bc" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {REVIEWS.map((review, idx) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.07)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold"
                style={{ width: 38, height: 38, fontSize: "14px", backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
              >
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1416" }}>{review.reviewer}</p>
                  <span style={{ fontSize: "10px", color: "#b0b8bc", flexShrink: 0 }}>{review.date}</span>
                </div>
                <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "1px" }}>{review.pkg}</p>
                <div className="mt-1">
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
