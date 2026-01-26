"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Phone, Clock, CheckCircle, AlertCircle, Edit2 } from "lucide-react"
import { verificationService } from "@/lib/api/verification"

interface MobileVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  currentMobile: string
  onVerificationSuccess: () => void
}

type Step = 'verify' | 'change-mobile' | 'verify-new'

export default function MobileVerificationModal({
  isOpen,
  onClose,
  currentMobile,
  onVerificationSuccess
}: MobileVerificationModalProps) {
  const [step, setStep] = useState<Step>('verify')
  const [mobile, setMobile] = useState(currentMobile)
  const [newMobile, setNewMobile] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [codeSent, setCodeSent] = useState(false)
  const { toast } = useToast()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('verify')
      setMobile(currentMobile)
      setNewMobile('')
      setVerificationCode('')
      setCodeSent(false)
      setResendTimer(0)
    }
  }, [isOpen, currentMobile])

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')
    // Format as +XX XXX XXX XXXX
    if (cleaned.length >= 10) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 12)}`
    }
    return phone
  }

  const handleSendCode = async (mobileToVerify: string) => {
    setIsLoading(true)
    try {
      await verificationService.sendVerificationCode({
        type: 'mobile',
        contact: mobileToVerify
      })
      setCodeSent(true)
      setResendTimer(60) // 60 seconds cooldown
      toast({
        title: "Verification code sent",
        description: `A 6-digit code has been sent to ${formatPhoneNumber(mobileToVerify)}`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const mobileToVerify = step === 'verify-new' ? newMobile : mobile
      await verificationService.verifyCode({
        type: 'mobile',
        contact: mobileToVerify,
        code: verificationCode
      })
      
      toast({
        title: "Mobile verified successfully!",
        description: "Your mobile number has been verified"
      })
      
      onVerificationSuccess()
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeMobile = async () => {
    if (!newMobile || newMobile.length < 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid mobile number",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      await verificationService.updateMobile(newMobile)
      setStep('verify-new')
      setCodeSent(false)
      setVerificationCode('')
      toast({
        title: "Mobile updated",
        description: "Your mobile number has been updated. Please verify the new number."
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update mobile number",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderVerifyStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Verify Your Mobile</h3>
        <p className="text-muted-foreground">
          We'll send a verification code to your mobile number
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Current Mobile</Label>
              <p className="text-sm text-muted-foreground">{formatPhoneNumber(mobile)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('change-mobile')}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {!codeSent ? (
        <Button
          onClick={() => handleSendCode(mobile)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Resend code in {resendTimer}s
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendCode(mobile)}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderChangeMobileStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Edit2 className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Change Mobile Number</h3>
        <p className="text-muted-foreground">
          Enter your new mobile number
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="current-mobile">Current Mobile</Label>
          <Input
            id="current-mobile"
            type="tel"
            value={formatPhoneNumber(mobile)}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="new-mobile">New Mobile Number</Label>
          <Input
            id="new-mobile"
            type="tel"
            placeholder="Enter new mobile number"
            value={newMobile}
            onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, ''))}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter numbers only (e.g., 8801234567890)
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setStep('verify')}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleChangeMobile}
          disabled={isLoading || !newMobile}
          className="flex-1"
        >
          {isLoading ? "Updating..." : "Update Mobile"}
        </Button>
      </div>
    </div>
  )

  const renderVerifyNewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Verify New Mobile</h3>
        <p className="text-muted-foreground">
          We've sent a verification code to your new mobile number
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Label className="text-sm font-medium">New Mobile</Label>
            <p className="text-sm text-muted-foreground">{formatPhoneNumber(newMobile)}</p>
          </div>
        </CardContent>
      </Card>

      {!codeSent ? (
        <Button
          onClick={() => handleSendCode(newMobile)}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-code">Verification Code</Label>
            <Input
              id="new-code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full"
          >
            {isLoading ? "Verifying..." : "Verify New Mobile"}
          </Button>

          <div className="text-center">
            {resendTimer > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Resend code in {resendTimer}s
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSendCode(newMobile)}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Mobile Verification
          </DialogTitle>
        </DialogHeader>
        
        {step === 'verify' && renderVerifyStep()}
        {step === 'change-mobile' && renderChangeMobileStep()}
        {step === 'verify-new' && renderVerifyNewStep()}
      </DialogContent>
    </Dialog>
  )
}