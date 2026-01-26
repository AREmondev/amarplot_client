"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/api/auth";
import { signIn, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function AuthPage() {
  const { t } = useTranslation(["forms", "common"]);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const session = useSession();

  console.log("session", session);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("email", email);
      console.log("password", password);
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("result", result);

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: t("forms:auth.login_successful"),
        description: t("forms:auth.welcome_back"),
      });
      router.push("/profile"); // Redirect to profile page or dashboard
    } catch (error: any) {
      toast({
        title: t("common:error"),
        description: error.message || t("forms:auth.unexpected_error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: t("common:error"),
        description: t("forms:auth.passwords_no_match"),
        variant: "destructive",
      });
      setIsLoading(false);
      setIsLogin(true);
      return;
    }

    try {
      // Register
      await authService.register({ name, email, password, role });
      toast({
        title: t("forms:auth.registration_successful"),
        description: t("forms:auth.logging_you_in"),
      });

      // Auto login after registration
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/profile"); 
    } catch (error: any) {
      console.log("error", error?.response?.data?.message || error.message);
      toast({
        title: t("common:error"),
        description:
          error?.response?.data?.message || t("forms:auth.unexpected_error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin
              ? t("forms:auth.welcome_back_title")
              : t("forms:auth.create_account")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="login"
            className="w-full"
            onValueChange={(value) => setIsLogin(value === "login")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t("forms:auth.login")}</TabsTrigger>
              <TabsTrigger value="signup">
                {t("forms:auth.sign_up")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form className="space-y-4 pt-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("forms:auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">{t("forms:auth.password")}</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="text-right">
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    {t("forms:auth.forgot_password")}
                  </a>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("forms:auth.logging_in")
                    : t("forms:auth.login")}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form className="space-y-4 pt-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label htmlFor="name">{t("forms:auth.name")}</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("forms:auth.name_placeholder")}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("forms:auth.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">{t("forms:auth.password")}</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    {t("forms:auth.confirm_password")}
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("forms:auth.role")}</Label>
                  <Select value={role} onValueChange={setRole} required>
                    <SelectTrigger id="role">
                      <SelectValue placeholder={t("forms:auth.select_role")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">
                        {t("forms:auth.property_owner")}
                      </SelectItem>
                      <SelectItem value="user">
                        {t("forms:auth.normal_user")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("forms:auth.signing_up")
                    : t("forms:auth.sign_up")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
