"use client";

import { ThemeProvider } from "@/components/common/theme-provider";
import { SessionProvider } from "next-auth/react";
import { LoadingProvider } from "@/components/common/loading-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider as CustomSessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/common/toast-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <ToastProvider />
        <SessionProvider>
          <CustomSessionProvider>
            <NotificationProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
                storageKey="amarplot-theme"
              >
                <LoadingProvider>{children}</LoadingProvider>
              </ThemeProvider>
            </NotificationProvider>
          </CustomSessionProvider>
        </SessionProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
