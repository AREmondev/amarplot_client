
"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ListingFormData } from "@/lib/schemas/property"
import { PROPERTY_CONDITIONS } from "@/lib/constants"

export function PropertyDetailsStep() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<ListingFormData>()
  const formData = watch()

  const propertyType = formData.property_type;
  const isResidential = propertyType === "Flat" || propertyType === "House" || propertyType === "Mess";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Home className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Details</h2>
        <p className="text-gray-600">Provide more details about your property.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isResidential && (
          <>
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input id="bedrooms" type="number" placeholder="e.g., 3" {...register("bedrooms", { valueAsNumber: true })} />
              {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
            </div>
            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input id="bathrooms" type="number" placeholder="e.g., 2" {...register("bathrooms", { valueAsNumber: true })} />
              {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
            </div>
            <div>
              <Label htmlFor="unit_number">Unit Number</Label>
              <Input id="unit_number" placeholder="e.g., 5B" {...register("unit_number")} />
              {errors.unit_number && <p className="text-red-500 text-sm">{errors.unit_number.message}</p>}
            </div>
          </>
        )}
        <div>
          <Label htmlFor="holding_number">Holding Number</Label>
          <Input id="holding_number" placeholder="e.g., DHK-GUL-2023-4567" {...register("holding_number")} />
          {errors.holding_number && <p className="text-red-500 text-sm">{errors.holding_number.message}</p>}
        </div>
        {isResidential && (
          <>
            <div>
              <Label htmlFor="construction_status">Construction Status</Label>
              <Select value={formData.construction_status} onValueChange={(value) => setValue("construction_status", value as any)}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                  <SelectItem value="Under Construction">Under Construction</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              {errors.construction_status && <p className="text-red-500 text-sm">{errors.construction_status.message}</p>}
            </div>
            <div>
              <Label htmlFor="year_built">Year Built</Label>
              <Input id="year_built" type="number" placeholder="e.g., 2023" {...register("year_built", { valueAsNumber: true })} />
              {errors.year_built && <p className="text-red-500 text-sm">{errors.year_built.message}</p>}
            </div>
            <div>
              <Label htmlFor="facing_direction">Facing Direction</Label>
              <Input id="facing_direction" placeholder="e.g., South-Facing" {...register("facing_direction")} />
              {errors.facing_direction && <p className="text-red-500 text-sm">{errors.facing_direction.message}</p>}
            </div>
            <div>
              <Label htmlFor="property_condition">Property Condition</Label>
              <Select value={formData.property_condition} onValueChange={(value) => setValue("property_condition", value as any)}>
                <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                <SelectContent>
                  {PROPERTY_CONDITIONS.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_condition && <p className="text-red-500 text-sm">{errors.property_condition.message}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
