import "~/styles/globals.css";
import { cookies } from "next/headers"
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from "../components/navbar";
import { ThemeProvider } from "../provider/theme-provider";
import { SidebarProvider } from "~/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Feelink",
  description: "simple social-app, inspired by X",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export  default async  function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable}`}>
      <body className="dark:bg-black">
      <SessionProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={defaultOpen}>
                <div className="grid absolute w-full">
              <Navbar />
              {children}
                </div>
              </SidebarProvider>
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

