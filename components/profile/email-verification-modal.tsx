"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, Clock, CheckCircle, AlertCircle, Edit2 } from "lucide-react"
import { verificationService } from "@/lib/api/verification"

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  currentEmail: string
  onVerificationSuccess: () => void
}

type Step = 'verify' | 'change-email' | 'verify-new'

export default function EmailVerificationModal({
  isOpen,
  onClose,
  currentEmail,
  onVerificationSuccess
}: EmailVerificationModalProps) {
  const [step, setStep] = useState<Step>('verify')
  const [email, setEmail] = useState(currentEmail)
  const [newEmail, setNewEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [codeSent, setCodeSent] = useState(false)
  const { toast } = useToast()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('verify')
      setEmail(currentEmail)
      setNewEmail('')
      setVerificationCode('')
      setCodeSent(false)
      setResendTimer(0)
    }
  }, [isOpen, currentEmail])

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

  const handleSendCode = async (emailToVerify: string) => {
    setIsLoading(true)
    try {
      await verificationService.sendVerificationCode({
        type: 'email',
        contact: emailToVerify
      })
      setCodeSent(true)
      setResendTimer(60) // 60 seconds cooldown
      toast({
        title: "Verification code sent",
        description: `A 6-digit code has been sent to ${emailToVerify}`
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
      const emailToVerify = step === 'verify-new' ? newEmail : email
      await verificationService.verifyCode({
        type: 'email',
        contact: emailToVerify,
        code: verificationCode
      })
      
      toast({
        title: "Email verified successfully!",
        description: "Your email has been verified"
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

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      await verificationService.updateEmail(newEmail)
      setStep('verify-new')
      setCodeSent(false)
      setVerificationCode('')
      toast({
        title: "Email updated",
        description: "Your email has been updated. Please verify the new email."
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
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
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
        <p className="text-muted-foreground">
          We'll send a verification code to your email address
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Current Email</Label>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('change-email')}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {!codeSent ? (
        <Button
          onClick={() => handleSendCode(email)}
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
                onClick={() => handleSendCode(email)}
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

  const renderChangeEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <Edit2 className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Change Email Address</h3>
        <p className="text-muted-foreground">
          Enter your new email address
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="current-email">Current Email</Label>
          <Input
            id="current-email"
            type="email"
            value={email}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="new-email">New Email Address</Label>
          <Input
            id="new-email"
            type="email"
            placeholder="Enter new email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
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
          onClick={handleChangeEmail}
          disabled={isLoading || !newEmail}
          className="flex-1"
        >
          {isLoading ? "Updating..." : "Update Email"}
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
        <h3 className="text-lg font-semibold mb-2">Verify New Email</h3>
        <p className="text-muted-foreground">
          We've sent a verification code to your new email
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <Label className="text-sm font-medium">New Email</Label>
            <p className="text-sm text-muted-foreground">{newEmail}</p>
          </div>
        </CardContent>
      </Card>

      {!codeSent ? (
        <Button
          onClick={() => handleSendCode(newEmail)}
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
            {isLoading ? "Verifying..." : "Verify New Email"}
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
                onClick={() => handleSendCode(newEmail)}
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
            <Mail className="h-5 w-5" />
            Email Verification
          </DialogTitle>
        </DialogHeader>
        
        {step === 'verify' && renderVerifyStep()}
        {step === 'change-email' && renderChangeEmailStep()}
        {step === 'verify-new' && renderVerifyNewStep()}
      </DialogContent>
    </Dialog>
  )
}