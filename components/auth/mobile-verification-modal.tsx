"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Send, CheckCircle, RefreshCw, Clock, Edit2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MobileVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  initialMobile?: string
}

export default function MobileVerificationModal({ 
  isOpen, 
  onClose, 
  onVerified, 
  initialMobile = "" 
}: MobileVerificationModalProps) {
  const [step, setStep] = useState(1) // 1: Enter/Edit Mobile, 2: Verify Code, 3: Success
  const [mobile, setMobile] = useState(initialMobile)
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
      setStep(initialMobile ? 2 : 1)
      setMobile(initialMobile)
      setVerificationCode("")
      setCountdown(0)
      setCanResend(true)
      if (initialMobile) {
        sendVerificationCode()
      }
    }
  }, [isOpen, initialMobile])

  const validateMobile = (mobileNumber: string) => {
    // Bangladesh mobile number validation
    const bdMobileRegex = /^(\+88)?01[3-9]\d{8}$/
    return bdMobileRegex.test(mobileNumber.replace(/\s/g, ''))
  }

  const formatMobile = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as +88 01XXX-XXXXXX
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `+${digits.slice(0, 2)} ${digits.slice(2)}`
    if (digits.length <= 7) return `+${digits.slice(0, 2)} ${digits.slice(2, 4)}${digits.slice(4, 7)}`
    return `+${digits.slice(0, 2)} ${digits.slice(2, 4)}${digits.slice(4, 7)}-${digits.slice(7, 13)}`
  }

  const sendVerificationCode = async (newMobile?: string) => {
    const mobileToVerify = newMobile || mobile
    
    if (!validateMobile(mobileToVerify)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Bangladesh mobile number (e.g., +8801XXXXXXXXX)",
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
        description: `A 6-digit code has been sent to ${mobileToVerify}`,
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

  const changeMobile = () => {
    setStep(1)
    setVerificationCode("")
    setCountdown(0)
    setCanResend(true)
  }

  const resetModal = () => {
    setStep(1)
    setMobile(initialMobile)
    setVerificationCode("")
    setCountdown(0)
    setCanResend(true)
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobile(e.target.value)
    setMobile(formatted)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Verification
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Enter/Edit Mobile Number */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="h-5 w-5" />
                Enter Mobile Number
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                We'll send a verification code to your mobile number via SMS.
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="+88 01XXX-XXXXXX"
                  value={mobile}
                  onChange={handleMobileChange}
                  className="mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Enter your Bangladesh mobile number
                </div>
              </div>

              <Button 
                onClick={() => sendVerificationCode()} 
                disabled={!mobile || isLoading}
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

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Smartphone className="h-5 w-5" />
                Verify Mobile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Enter the 6-digit code sent to
                  <br />
                  <strong>{mobile}</strong>
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={changeMobile}
                  className="text-primary hover:text-primary/80"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Change Number
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
                onClick={changeMobile}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Mobile Entry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile Verified!</h3>
              <p className="text-muted-foreground">
                Your mobile number has been successfully verified.
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}