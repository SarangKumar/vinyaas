"use client";

import { AccountSettingsBlock } from "@/app/home/blocks/account-settings-block";
import { ChartBlock } from "@/app/home/blocks/chart-block";
import { ChatBlock } from "@/app/home/blocks/chat-block";
import { FilterBlock } from "@/app/home/blocks/filter-block";
import { InvoiceBlock } from "@/app/home/blocks/invoice-block";
import { LoginBlock } from "@/app/home/blocks/login-block";
import { MediaControlsBlock } from "@/app/home/blocks/media-controls-block";
import { MessagesBlock } from "@/app/home/blocks/messages-block";
import { NotificationSettingsBlock } from "@/app/home/blocks/notification-settings-block";
import { ProfileBlock } from "@/app/home/blocks/profile-block";
import { ProjectBlock } from "@/app/home/blocks/project-block";
import { SecurityBlock } from "@/app/home/blocks/security-block";
import { SignupBlock } from "@/app/home/blocks/signup-block";
import { TableBlock } from "@/app/home/blocks/table-block";
import { TabsSettingsBlock } from "@/app/home/blocks/tabs-settings-block";
import { UploadBlock } from "@/app/home/blocks/upload-block";

/**
 * Centered masonry for the main showcase cards.
 * Side skeleton rails are absolute (see PlaygroundSideRails) and sit
 * outside this max-width band at ≥2200px.
 *
 * Layout at ultra-wide:
 *   fade ← 2 skeleton cols | 5-column masonry | 2 skeleton cols → fade
 *
 * 1 · md:2 · lg:3 · min-1400:4 · min-1900:5
 */
export function Playground() {
  return (
    <div
      data-playground
      className="relative z-10 mx-auto w-full columns-1 gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:columns-4! min-[1900px]:columns-5! md:max-w-3xl md:columns-2 lg:max-w-none lg:columns-3 xl:max-w-[1600px] 2xl:max-w-[1900px]"
    >
      <ChartBlock />
      <LoginBlock />
      <MediaControlsBlock />
      <ChatBlock />
      <UploadBlock />
      <FilterBlock />
      <SignupBlock />
      <TabsSettingsBlock />
      <MessagesBlock />
      <ProfileBlock />
      <TableBlock />
      <InvoiceBlock />
      <ProjectBlock />
      <SecurityBlock />
      <NotificationSettingsBlock />
      <AccountSettingsBlock />
    </div>
  );
}
