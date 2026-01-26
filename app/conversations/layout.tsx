"use client";

import { ConversationsProvider } from "@/components/providers/conversations-provider";

export default function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConversationsProvider>
      {children}
    </ConversationsProvider>
  );
}