"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Upload, CheckCircle, AlertCircle, FileImage, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import Image from "next/image"
import { DOCUMENT_TYPES } from "@/lib/constants"

interface NIDVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
}

export default function NIDVerificationModal({ isOpen, onClose, onVerified }: NIDVerificationModalProps) {
  const [step, setStep] = useState(1) // 1: Upload, 2: Details, 3: Review, 4: Success
  const [isLoading, setIsLoading] = useState(false)
  const [nidData, setNIDData] = useState({
    type: "",
    number: "",
    fullName: "",
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    address: "",
    frontImage: null as string | null,
    backImage: null as string | null,
  })

  const frontFileRef = useRef<HTMLInputElement>(null)
  const backFileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (type: "front" | "back", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setNIDData({
          ...nidData,
          [type === "front" ? "frontImage" : "backImage"]: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type: "front" | "back") => {
    setNIDData({
      ...nidData,
      [type === "front" ? "frontImage" : "backImage"]: null,
    })
  }

  const nextStep = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const submitVerification = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setStep(4)
      setTimeout(() => {
        onVerified()
        onClose()
        setStep(1)
        setNIDData({
          type: "",
          number: "",
          fullName: "",
          dateOfBirth: "",
          fatherName: "",
          motherName: "",
          address: "",
          frontImage: null,
          backImage: null,
        })
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isStep1Valid = () => nidData.frontImage && nidData.backImage
  const isStep2Valid = () => nidData.type && nidData.number && nidData.fullName && nidData.dateOfBirth

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            National ID Verification
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6 px-6">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && <div className={`w-12 h-1 mx-2 ${stepNum < step ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload NID Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Please upload clear photos of both sides of your National ID card.
              </div>

              {/* Front Side */}
              <div>
                <Label className="mb-2 block">Front Side *</Label>
                {nidData.frontImage ? (
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-4">
                    <Image
                      src={nidData.frontImage || "/placeholder.svg"}
                      alt="NID Front"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage("front")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => frontFileRef.current?.click()}
                  >
                    <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click to upload front side</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                )}
                <input
                  ref={frontFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("front", e)}
                  className="hidden"
                />
              </div>

              {/* Back Side */}
              <div>
                <Label className="mb-2 block">Back Side *</Label>
                {nidData.backImage ? (
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-4">
                    <Image
                      src={nidData.backImage || "/placeholder.svg"}
                      alt="NID Back"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage("back")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-muted rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => backFileRef.current?.click()}
                  >
                    <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Click to upload back side</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 5MB, JPG/PNG</p>
                  </div>
                )}
                <input
                  ref={backFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload("back", e)}
                  className="hidden"
                />
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Important Guidelines:</p>
                    <ul className="mt-1 text-yellow-700 space-y-1">
                      <li>• Ensure all text is clearly visible</li>
                      <li>• Avoid glare and shadows</li>
                      <li>• Images should be well-lit and in focus</li>
                      <li>• Do not crop or edit the images</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                NID Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nidType">ID Type *</Label>
                  <Select value={nidData.type} onValueChange={(value) => setNIDData({ ...nidData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nidNumber">ID Number *</Label>
                  <Input
                    id="nidNumber"
                    value={nidData.number}
                    onChange={(e) => setNIDData({ ...nidData, number: e.target.value })}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name (as per ID) *</Label>
                <Input
                  id="fullName"
                  value={nidData.fullName}
                  onChange={(e) => setNIDData({ ...nidData, fullName: e.target.value })}
                  placeholder="Enter full name exactly as shown on ID"
                />
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={nidData.dateOfBirth}
                  onChange={(e) => setNIDData({ ...nidData, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fatherName">Father&apos;s Name</Label>
                  <Input
                    id="fatherName"
                    value={nidData.fatherName}
                    onChange={(e) => setNIDData({ ...nidData, fatherName: e.target.value })}
                    placeholder="Father&apos;s name"
                  />
                </div>

                <div>
                  <Label htmlFor="motherName">Mother&apos;s Name</Label>
                  <Input
                    id="motherName"
                    value={nidData.motherName}
                    onChange={(e) => setNIDData({ ...nidData, motherName: e.target.value })}
                    placeholder="Mother&apos;s name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address (as per ID)</Label>
                <Input
                  id="address"
                  value={nidData.address}
                  onChange={(e) => setNIDData({ ...nidData, address: e.target.value })}
                  placeholder="Address as shown on ID"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Review & Submit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Please review your information before submitting for verification.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Front Side</h4>
                  {nidData.frontImage && (
                    <Image
                      src={nidData.frontImage || "/placeholder.svg"}
                      alt="NID Front"
                      width={200}
                      height={120}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Back Side</h4>
                  {nidData.backImage && (
                    <Image
                      src={nidData.backImage || "/placeholder.svg"}
                      alt="NID Back"
                      width={200}
                      height={120}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID Type:</span>
                    <div className="font-medium">{nidData.type}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID Number:</span>
                    <div className="font-medium">{nidData.number}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Full Name:</span>
                    <div className="font-medium">{nidData.fullName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date of Birth:</span>
                    <div className="font-medium">{nidData.dateOfBirth}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">Verification Process:</p>
                    <p className="mt-1 text-blue-700">
                      Your documents will be reviewed within 24-48 hours. You&apos;ll receive an email notification once the
                      verification is complete.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verification Submitted!</h3>
              <p className="text-muted-foreground">
                Your NID verification has been submitted successfully. We&apos;ll review your documents and notify you within
                24-48 hours.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Actions */}
        {step < 4 && (
          <div className="flex justify-between px-6 py-4 border-t">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={(step === 1 && !isStep1Valid()) || (step === 2 && !isStep2Valid())}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={submitVerification} disabled={isLoading}>
                  {isLoading ? "Submitting..." : "Submit for Verification"}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
