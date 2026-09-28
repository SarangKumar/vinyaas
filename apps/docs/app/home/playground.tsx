"use client";

import { AccountSettingsBlock } from "@/app/home/blocks/account-settings-block";
import { AnalyticsBlock } from "@/app/home/blocks/analytics-block";
import { FeedbackBlock } from "@/app/home/blocks/feedback-block";
import { LoadingStateBlock } from "@/app/home/blocks/loading-state-block";
import { LoginBlock } from "@/app/home/blocks/login-block";
import { MessagesBlock } from "@/app/home/blocks/messages-block";
import { NotificationSettingsBlock } from "@/app/home/blocks/notification-settings-block";
import { PaymentConfirmationBlock } from "@/app/home/blocks/payment-confirmation-block";
import { ProfileBlock } from "@/app/home/blocks/profile-block";
import { RecentDocumentsBlock } from "@/app/home/blocks/recent-documents-block";
import { ScheduleBlock } from "@/app/home/blocks/schedule-block";
import { TableBlock } from "@/app/home/blocks/table-block";

/**
 * Centered masonry for the main showcase cards.
 * Side skeleton rails are absolute (see PlaygroundSideRails) and sit
 * outside this max-width band at ≥2200px — shadcn demo pattern.
 *
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5
 */
export function Playground() {
  return (
    <div
      data-playground
      className="relative z-10 mx-auto w-full columns-1 gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:columns-4! min-[1900px]:columns-5! md:max-w-3xl md:columns-2 lg:max-w-none lg:columns-3 xl:max-w-[1600px] 2xl:max-w-[1900px]"
    >
      <AnalyticsBlock />
      <LoginBlock />
      <PaymentConfirmationBlock />
      <ProfileBlock />
      <LoadingStateBlock />
      <FeedbackBlock />
      <MessagesBlock />
      <NotificationSettingsBlock />
      <TableBlock />
      <RecentDocumentsBlock />
      <AccountSettingsBlock />
      <ScheduleBlock />
    </div>
  );
}
