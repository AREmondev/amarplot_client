
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/lib/constants"

export function BasicInformationStep() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<ListingFormData>()
  const formData = watch()

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Start with the essentials.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="title">Property Title *</Label>
          <Input id="title" placeholder="e.g., Modern 3-Bedroom Flat" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="property_type">Property Type *</Label>
          <Select value={formData.property_type} onValueChange={(value) => setValue("property_type", value as any)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.property_type && <p className="text-red-500 text-sm">{errors.property_type.message}</p>}
        </div>
        <div>
          <Label htmlFor="transaction_type">Transaction Type *</Label>
          <Select value={formData.transaction_type} onValueChange={(value) => setValue("transaction_type", value as any)}>
            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
              {TRANSACTION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.transaction_type && <p className="text-red-500 text-sm">{errors.transaction_type.message}</p>}
        </div>
        <div>
          <Label htmlFor="price">Price (BDT) *</Label>
          <Input id="price" type="number" placeholder="e.g., 12000000" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="size">Size (sq ft) *</Label>
          <Input id="size" placeholder="e.g., 1350" {...register("size")} />
          {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea id="description" placeholder="Describe your property..." {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
      </div>
    </div>
  )
}
