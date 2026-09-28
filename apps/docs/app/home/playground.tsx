"use client";

import { AccountSettingsBlock } from "@/app/home/blocks/account-settings-block";
import { AnalyticsBlock } from "@/app/home/blocks/analytics-block";
import { CommandBlock } from "@/app/home/blocks/command-block";
import { ForgotPasswordBlock } from "@/app/home/blocks/forgot-password-block";
import { InvoiceBlock } from "@/app/home/blocks/invoice-block";
import { LoginBlock } from "@/app/home/blocks/login-block";
import { MessagesBlock } from "@/app/home/blocks/messages-block";
import { NotificationsBlock } from "@/app/home/blocks/notifications-block";
import { OtpBlock } from "@/app/home/blocks/otp-block";
import { PaymentConfirmationBlock } from "@/app/home/blocks/payment-confirmation-block";
import { PaymentMethodBlock } from "@/app/home/blocks/payment-method-block";
import { ProfileBlock } from "@/app/home/blocks/profile-block";
import { ProjectBlock } from "@/app/home/blocks/project-block";
import { ScheduleBlock } from "@/app/home/blocks/schedule-block";
import { SecurityBlock } from "@/app/home/blocks/security-block";
import { SignupBlock } from "@/app/home/blocks/signup-block";
import { TableBlock } from "@/app/home/blocks/table-block";
import { UploadBlock } from "@/app/home/blocks/upload-block";

const blocks = [
  LoginBlock,
  SignupBlock,
  ForgotPasswordBlock,
  NotificationsBlock,
  PaymentConfirmationBlock,
  InvoiceBlock,
  TableBlock,
  AnalyticsBlock,
  AccountSettingsBlock,
  SecurityBlock,
  ProfileBlock,
  ProjectBlock,
  ScheduleBlock,
  UploadBlock,
  OtpBlock,
  CommandBlock,
  MessagesBlock,
  PaymentMethodBlock,
];

export function Playground() {
  return (
    <div className="columns-1 gap-5 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
      {blocks.map((Block) => (
        <Block key={Block.name} />
      ))}
    </div>
  );
}
