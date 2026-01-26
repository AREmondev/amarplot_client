"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Bus,
  Hospital,
  School,
  ShoppingBag,
  Utensils,
  PlusCircle,
} from "lucide-react";
import { Listing } from "@/types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface NearbyPlacesFormProps {
  nearbyFacilities?: Listing["nearby_facilities"];
  value?: NearbyPlaceFormValues[];
  onChange?: (places: NearbyPlaceFormValues[]) => void;
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  distance: z.string().min(1, { message: "Distance is required." }),
  type: z.enum([
    "Hospital",
    "School",
    "Market",
    "Transport",
    "Restaurant",
    "Other",
  ]),
});

type NearbyPlaceFormValues = z.infer<typeof formSchema>;

function AddNearbyPlaceForm({
  onAddFacility,
  onClose,
}: {
  onAddFacility: (facility: NearbyPlaceFormValues) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<NearbyPlaceFormValues>({
    name: "",
    distance: "",
    type: "Other",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof NearbyPlaceFormValues, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof NearbyPlaceFormValues, string>> = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }
    if (!formData.distance) {
      newErrors.distance = "Distance is required.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onAddFacility(formData);
      setFormData({ name: "", distance: "", type: "Other" });
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="space-y-4">
        <div>
          <label htmlFor="place-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Place Name
          </label>
          <Input
            id="place-name"
            placeholder="e.g., City Hospital"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="place-distance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Distance
          </label>
          <Input
            id="place-distance"
            placeholder="e.g., 2 km"
            value={formData.distance}
            onChange={(e) => setFormData(prev => ({ ...prev, distance: e.target.value }))}
            className="mt-1"
          />
          {errors.distance && <p className="text-sm text-red-500 mt-1">{errors.distance}</p>}
        </div>

        <div>
          <label htmlFor="place-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Type
          </label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as NearbyPlaceFormValues['type'] }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hospital">Hospital</SelectItem>
              <SelectItem value="School">School</SelectItem>
              <SelectItem value="Market">Market</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Restaurant">Restaurant</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button type="button" onClick={handleSubmit}>Add Place</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
    </div>
  );
}

const getIcon = (type: string) => {
  switch (type) {
    case "Hospital":
      return <Hospital className="h-5 w-5 text-primary" />;
    case "School":
      return <School className="h-5 w-5 text-primary" />;
    case "Market":
      return <ShoppingBag className="h-5 w-5 text-primary" />;
    case "Transport":
      return <Bus className="h-5 w-5 text-primary" />;
    case "Restaurant":
      return <Utensils className="h-5 w-5 text-primary" />;
    default:
      return <MapPin className="h-5 w-5 text-primary" />;
  }
};

export function NearbyPlacesForm({ nearbyFacilities, value = [], onChange }: NearbyPlacesFormProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddFacility = (newFacility: NearbyPlaceFormValues) => {
    const updatedFacilities = [...value, newFacility];
    onChange?.(updatedFacilities);
  };

  const allFacilities = [...(nearbyFacilities || []), ...value];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Nearby Places & Transportation
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <PlusCircle className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Add New Nearby Place</h4>
            <AddNearbyPlaceForm
              onAddFacility={handleAddFacility}
              onClose={() => setShowAddForm(false)}
            />
          </div>
        )}

        {allFacilities.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No nearby facilities added yet. Click the '+' button to add one.
          </p>
        ) : (
          allFacilities.map((facility, index) => (
            <div key={index} className="flex items-center gap-2">
              {getIcon(facility.type)}
              <div>
                <h3 className="font-semibold">{facility.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {facility.distance}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
