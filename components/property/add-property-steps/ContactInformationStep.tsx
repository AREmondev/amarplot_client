
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"

export function ContactInformationStep() {
  const { register, formState: { errors } } = useFormContext<ListingFormData>()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Mail className="w-16 h-16 text-orange-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">How can potential buyers contact you?</p>
      </div>
      <div>
        <Label htmlFor="phone">Phone *</Label>
        <Input id="phone" placeholder="+880 1712 345 678" {...register("contact.phone")} />
        {errors.contact?.phone && <p className="text-red-500 text-sm">{errors.contact.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" placeholder="seller@example.com" {...register("contact.email")} />
        {errors.contact?.email && <p className="text-red-500 text-sm">{errors.contact.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" placeholder="+880 1712 345 678" {...register("contact.whatsapp")} />
        {errors.contact?.whatsapp && <p className="text-red-500 text-sm">{errors.contact.whatsapp.message}</p>}
      </div>
    </div>
  )
}
