
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, CreditCard } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"

export function LegalFinancialsStep() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<ListingFormData>()
  const formData = watch()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <ShieldCheck className="w-16 h-16 text-cyan-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal & Financials</h2>
        <p className="text-gray-600">Provide legal and financial information.</p>
      </div>
      <div>
        <Label htmlFor="legal_status">Legal Verification Status</Label>
        <Select value={formData.legal_verification?.status} onValueChange={(value) => setValue("legal_verification.status", value as any)}>
          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        {errors.legal_verification?.status && <p className="text-red-500 text-sm">{errors.legal_verification.status.message}</p>}
      </div>
      <div>
        <Label htmlFor="legal_details">Legal Details</Label>
        <Textarea id="legal_details" placeholder="e.g., RAJUK Approved, Khatiyan No. 1234" {...register("legal_verification.details")} />
        {errors.legal_verification?.details && <p className="text-red-500 text-sm">{errors.legal_verification.details.message}</p>}
      </div>

      {/* Installment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-600" />
            Installment Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="installment_available">Installment Available</Label>
            <Switch
              id="installment_available"
              checked={formData.installment?.available || false}
              onCheckedChange={(checked) => setValue("installment.available", checked)}
            />
          </div>

          {formData.installment?.available && (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration_months">Duration (Months)</Label>
                  <Input
                    id="duration_months"
                    type="number"
                    placeholder="e.g., 12, 24, 36"
                    {...register("installment.duration_months", { valueAsNumber: true })}
                  />
                  {errors.installment?.duration_months && (
                    <p className="text-red-500 text-sm">{errors.installment.duration_months.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="down_payment_percentage">Down Payment (%)</Label>
                  <Input
                    id="down_payment_percentage"
                    type="number"
                    placeholder="e.g., 20, 30, 50"
                    {...register("installment.down_payment_percentage", { valueAsNumber: true })}
                  />
                  {errors.installment?.down_payment_percentage && (
                    <p className="text-red-500 text-sm">{errors.installment.down_payment_percentage.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="monthly_amount">Monthly Amount (BDT)</Label>
                <Input
                  id="monthly_amount"
                  type="number"
                  placeholder="e.g., 50000, 75000"
                  {...register("installment.monthly_amount", { valueAsNumber: true })}
                />
                {errors.installment?.monthly_amount && (
                  <p className="text-red-500 text-sm">{errors.installment.monthly_amount.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="service_details">Service Details</Label>
                <Textarea
                  id="service_details"
                  placeholder="Describe how the installment service works, processing fees, etc."
                  {...register("installment.service_details")}
                />
                {errors.installment?.service_details && (
                  <p className="text-red-500 text-sm">{errors.installment.service_details.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="terms_and_conditions">Terms & Conditions</Label>
                <Textarea
                  id="terms_and_conditions"
                  placeholder="Installment terms, penalties, early payment options, etc."
                  {...register("installment.terms_and_conditions")}
                />
                {errors.installment?.terms_and_conditions && (
                  <p className="text-red-500 text-sm">{errors.installment.terms_and_conditions.message}</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
