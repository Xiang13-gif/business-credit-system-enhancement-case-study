import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Global Commercial Credit Modernization Platform",
  description:
    "A global banking portfolio case study for commercial credit workflow modernization, approval routing, policy exception governance, UAT, controls, and operational dashboards."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
