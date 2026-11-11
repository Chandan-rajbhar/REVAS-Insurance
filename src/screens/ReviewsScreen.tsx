import React from 'react';
import { ArrowLeft, Pencil, Star } from 'lucide-react';
import { REVIEWS_SUMMARY, type CarrierReview } from '../data/mock';

interface ReviewsScreenProps {
  reviews: CarrierReview[];
  onBack: () => void;
  onWriteReview: () => void;
}

const StarRow: React.FC<{ count: number; sizeClass?: string }> = ({
  count,
  sizeClass = 'w-4 h-4',
}) => (
  <div className="inline-flex items-center gap-0.5" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, idx) => {
      const filled = idx < count;
      return (
        <Star
          key={idx}
          className={`${sizeClass} ${
            filled
              ? 'text-[#F59E0B] fill-[#F59E0B]'
              : 'text-[#CBD5E1] fill-transparent'
          }`}
        />
      );
    })}
  </div>
);

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  reviews,
  onBack,
  onWriteReview,
}) => {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full min-w-0 bg-[#F6F8FC]">
      {/* Header */}
      <header className="safe-top bg-white shrink-0">
        <div className="pl-[6px] pr-4 pt-[10px] pb-[10px] flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#0F2A3F] hover:bg-[#F3F5FA] pressable cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2]" />
          </button>
          <h1 className="text-[20px] font-medium text-[#0F2A3F] leading-[1.2] tracking-[-0.01em] truncate">
            Reviews
          </h1>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 scroll-area px-4 pt-3 pb-6">
        {/* Summary Card */}
        <section
          className="bg-white rounded-[16px] p-4"
          style={{ border: '0.5px solid #E1E5EC' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[36px] font-medium text-[#0F2A3F] leading-none tracking-[-0.02em]">
              {REVIEWS_SUMMARY.rating}
            </span>
            <StarRow count={5} sizeClass="w-[18px] h-[18px]" />
          </div>
          <p className="mt-2.5 text-[15px] font-medium text-[#0F2A3F] leading-[1.35]">
            {REVIEWS_SUMMARY.trustedText}
          </p>
          <p className="mt-0.5 text-[13px] text-[#64748B] leading-[1.35]">
            {REVIEWS_SUMMARY.basedOnText}
          </p>
        </section>

        {/* Carrier Reviews */}
        <section className="mt-5">
          <h2 className="text-[14px] font-medium text-[#5F5E5A] mb-2.5">
            What carriers say
          </h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-[16px] p-4"
                style={{ border: '0.5px solid #E1E5EC' }}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#EEF3FB] text-[#0F2A3F] flex items-center justify-center text-[13px] font-semibold shrink-0">
                      {review.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-medium text-[#0F2A3F] leading-[1.3] truncate">
                        {review.company}
                      </h3>
                      <div className="mt-0.5">
                        <StarRow count={review.rating} sizeClass="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] text-[#64748B] whitespace-nowrap shrink-0 pt-0.5">
                    {review.timeAgo}
                  </span>
                </div>

                <p className="mt-2.5 text-[14px] text-[#444441] leading-[1.45]">
                  {review.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Write Review Button */}
        <button
          type="button"
          onClick={onWriteReview}
          className="mt-5 w-full h-[44px] rounded-[12px] bg-[#0F2A3F] hover:bg-[#163854] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 pressable cursor-pointer transition-colors"
        >
          <Pencil className="w-4 h-4 stroke-[2]" />
          <span>Write a review</span>
        </button>
      </div>
    </div>
  );
};

