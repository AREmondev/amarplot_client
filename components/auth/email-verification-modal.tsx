"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Send, CheckCircle, RefreshCw, Clock, Edit2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  initialEmail?: string
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose, 
  onVerified, 
  initialEmail = "" 
}: EmailVerificationModalProps) {
  const [step, setStep] = useState(1) // 1: Enter/Edit Email, 2: Verify Code, 3: Success
  const [email, setEmail] = useState(initialEmail)
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const { toast } = useToast()

  // Countdown timer for resend functionality
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0 && step === 2) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, step])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(initialEmail ? 2 : 1)
      setEmail(initialEmail)
      setVerificationCode("")
      setCountdown(0)
      setCanResend(true)
      if (initialEmail) {
        sendVerificationCode()
      }
    }
  }, [isOpen, initialEmail])

  const validateEmail = (emailAddress: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(emailAddress)
  }

  const sendVerificationCode = async (newEmail?: string) => {
    const emailToVerify = newEmail || email
    
    if (!validateEmail(emailToVerify)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setStep(2)
      setCountdown(60)
      setCanResend(false)
      
      toast({
        title: "Verification Code Sent",
        description: `A 6-digit code has been sent to ${emailToVerify}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate success (remove this in production)
      if (verificationCode === "123456" || verificationCode.length === 6) {
        setStep(3)
        setTimeout(() => {
          onVerified()
          onClose()
          resetModal()
        }, 2000)
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code you entered is incorrect.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resendCode = () => {
    if (canResend) {
      sendVerificationCode()
    }
  }

  const changeEmail = () => {
    setStep(1)
    setVerificationCode("")
    setCountdown(0)
    setCanResend(true)
  }

  const resetModal = () => {
    setStep(1)
    setEmail(initialEmail)
    setVerificationCode("")
    setCountdown(0)
    setCanResend(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5" />
                Enter Email Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                We'll send a verification code to your email address.
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={() => sendVerificationCode()} 
                disabled={!email || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5" />
                Verify Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Enter the 6-digit code sent to
                  <br />
                  <strong>{email}</strong>
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={changeEmail}
                  className="text-primary hover:text-primary/80"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Change Email
                </Button>
              </div>

              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setVerificationCode(value)
                  }}
                  className="text-center text-lg tracking-widest mt-1"
                  maxLength={6}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Didn't receive the code?
                </span>
                {canResend ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resendCode}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80 p-0 h-auto"
                  >
                    Resend Code
                  </Button>
                ) : (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Resend in {countdown}s
                  </div>
                )}
              </div>

              <Button 
                onClick={verifyCode} 
                disabled={verificationCode.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={changeEmail}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Email Entry
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Verified!</h3>
              <p className="text-muted-foreground">
                Your email address has been successfully verified.
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}
