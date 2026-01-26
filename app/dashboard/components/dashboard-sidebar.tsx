"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Building,
  Clock,
  BarChart3,
  Settings,
  Plus,
  LogOut,
  User,
  Home,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface DashboardSidebarProps {
  activePage: "overview" | "properties" | "drafts" | "analytics" | "settings";
}

export default function DashboardSidebar({
  activePage,
}: DashboardSidebarProps) {
  const { t, i18n, ready } = useTranslation([
    "common",
    "navigation",
    "forms",
    "constants",
  ]);
  const pathname = usePathname();

  const navItems = [
    {
      name: t("pages.overview"),
      href: "/dashboard/overview",
      icon: LayoutDashboard,
      active: activePage === "overview",
    },
    {
      name: t("pages.my_properties"),
      href: "/dashboard/properties",
      icon: Building,
      active: activePage === "properties",
    },
    // {
    //   name: t("pages.drafts"),
    //   href: "/dashboard/drafts",
    //   icon: Clock,
    //   active: activePage === "drafts",
    // },
    {
      name: t("pages.analytics"),
      href: "/dashboard/analytics",
      icon: BarChart3,
      active: activePage === "analytics",
    },
    {
      name: t("pages.settings"),
      href: "/dashboard/settings",
      icon: Settings,
      active: activePage === "settings",
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="flex items-center mb-8 px-2">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">AmarPlot</span>
        </Link>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex w-full items-center px-3 py-2 rounded-md text-sm font-medium",
              item.active
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
            )}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </div>

      {/* <Separator className="my-6" />
      
      <Button 
        className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white" 
        onClick={() => router.push("/add-property")}
      >
        <Plus className="mr-2 h-5 w-5" />
        Add New Property
      </Button> */}

      <div className="mt-auto space-y-1 pt-6">
        <Link
          href="/profile"
          className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <User className="mr-2 h-5 w-5" />
          {t("pages.profile")}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="mr-2 h-5 w-5" />
          {t("pages.sign_out")}
        </button>
      </div>
    </div>
  );
}
