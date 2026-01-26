"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/logo-01.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Menu,
  Search,
  Bell,
  User,
  Heart,
  Plus,
  Moon,
  Sun,
  MessageSquare,
  LogOut,
  Shield,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import LocaleSwitcher from "./LocaleSwitcher";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import ConversationsDropdown from "@/components/chat/conversations-dropdown";
import { useUserProfile } from "@/hooks/use-user-profile";
import EmailVerificationModal from "@/components/auth/email-verification-modal";

export default function Header() {
  const { t } = useTranslation(["navigation", "common"]);
  const [isOpen, setIsOpen] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const { toast } = useToast();
  const { profileColor, isVerified } = useUserProfile();

  const navigation = [
    { name: "navigation:header.nav.buy", href: "/search?transaction_type=buy" },
    { name: "navigation:header.nav.rent", href: "/search?transaction_type=rent" },
    { name: "navigation:header.nav.sell", href: "/add-property" },
  ];

  const router = useRouter();

  const handleNavigation = (route: string) => {
    router.push(route);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast({
        title: t("forms:auth.logout_success"),
        description: t("navigation:header.actions.logout"),
      });
      router.push("/");
    } catch (error) {
      toast({
        title: t("common:error"),
        description: t("forms:auth.logout_error"),
        variant: "destructive",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src={logo}
              alt="AmarPlot Logo"
              width={220}
              height={100}
              className="  object-cover rounded-lg cursor-pointer "
              // onClick={() => router.push("/")}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* <LocaleSwitcher /> */}
            {/* Messages - Only show for authenticated users */}
            {session && (
              <ConversationsDropdown
                userId={session?.user?.id}
                token={session?.user?.token}
              />
            )}

            {/* Notifications - Only show for authenticated users */}
            {session && (
              <NotificationDropdown
                userId={session?.user?.id}
                token={session?.user?.token}
                className="hidden md:flex"
              />
            )}

            {/* Saved - Only show for authenticated users */}
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex cursor-pointer">
                    <Heart className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>
                    {t("navigation:header.actions.saved_properties")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex items-start gap-3">
                      <Image
                        src="/placeholder.jpg"
                        alt="property"
                        className="h-16 w-16 rounded-md"
                        width={64}
                        height={64}
                      />
                      <div>
                        <p className="text-sm font-medium">Modern Apartment</p>
                        <p className="text-xs text-muted-foreground">
                          Dhaka, Bangladesh
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-start gap-3">
                      <Image
                        src="/placeholder.jpg"
                        alt="property"
                        className="h-16 w-16 rounded-md"
                        width={64}
                        height={64}
                      />
                      <div>
                        <p className="text-sm font-medium">Cozy Studio</p>
                        <p className="text-xs text-muted-foreground">
                          Chittagong, Bangladesh
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center" asChild>
                    <Link href="/saved-properties">
                      {t("navigation:header.dropdowns.view_all_saved")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Communities */}

            {/* Post Property */}
            {session && (
              <Button
                className="hidden md:flex cursor-pointer"
                size="sm"
                onClick={() => router.push("/add-property")}
              >
                <Plus className="h-5 w-5 mr-2" />
                {t("navigation:header.actions.post_property")}
              </Button>
            )}

            {/* Profile */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex cursor-pointer p-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={(session?.user as any)?.avatar || (session?.user as any)?.image || ""} alt={session?.user?.name || "User"} />
                        <AvatarFallback className="text-sm">{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      {/* {!isVerified && profileColor === 'yellow' && (
                        <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowVerificationModal(true);
                            }}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        </div>
                      )} */}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {t("navigation:header.actions.profile")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/profile")}>
                    {t("navigation:header.actions.profile")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                    {t("navigation:header.actions.dashboard")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/drafts")}>
                    {t("navigation:header.actions.drafts")}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/settings")}>
                    {t("navigation:header.actions.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("navigation:header.actions.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex"
                onClick={() => router.push("/auth")}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.name)}
                    </Link>
                  ))}
                  <div className="border-t pt-4 space-y-4">
                    <Button className="w-full justify-start" variant="ghost">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>

                    {session ? (
                      <>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                          onClick={() => handleNavigation("/chat")}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Messages
                          <Badge className="ml-auto">1</Badge>
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                          onClick={() => handleNavigation("/notifications")}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                          <Badge className="ml-auto">3</Badge>
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                          onClick={() => handleNavigation("/saved-properties")}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Saved Properties
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                          onClick={() => handleNavigation("/profile")}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                          onClick={() => handleNavigation("/dashboard")}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => handleNavigation("/add-property")}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Post Property
                        </Button>
                        <Button
                          className="w-full justify-start"
                          variant="destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleNavigation("/auth")}
                      >
                        <User className="h-4 w-4 mr-2" />
                        {t("navigation:header.actions.login_register")}
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Verification Modal */}
      <EmailVerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)}
        onVerified={() => {
          setShowVerificationModal(false);
          toast({
            title: "Email verified successfully!",
            description: "Your email has been verified.",
          });
          // The useUserProfile hook will automatically refresh the verification status
        }}
      />
    </header>
  );
}
