"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Sign In Required",
  description = "Please sign in to save properties and access your personalized features.",
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    onClose();
    router.push("/auth?tab=signup");
  };

  const handleForgotPassword = () => {
    onClose();
    router.push("/auth?tab=forgot-password");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 space-y-3">
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={handleForgotPassword}
                >
                  Forgot your password?
                </Button>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto font-medium"
                    onClick={handleSignUpRedirect}
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
