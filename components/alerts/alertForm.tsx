"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, MapPin, Home, DollarSign, Ruler, Settings } from "lucide-react";
import { CITIES, PROPERTY_TYPES, ROOM_OPTIONS } from "@/lib/constants";
import { useCreateAlert, useUpdateAlert } from "@/lib/api/alerts";

interface CreateAlertModalProps {
  data?: any;
  isEditing?: boolean;
  onSuccess?: () => void;
}

export default function AlertModal({
  data,
  isEditing,
  onSuccess,
}: CreateAlertModalProps) {
  const [alertData, setAlertData] = useState({
    name: data?.name || "",
    location: data?.location || "",
    type: data?.type || "",
    priceRange: data?.priceRange || { min: 0, max: 10000000 },
    bedrooms: data?.bedrooms || "any",
    bathrooms: data?.bathrooms || "any",

    description: data?.description || "",
    notifications: {
      email: data?.notifications?.email || true,
      sms: data?.notifications?.sms || false,
      push: data?.notifications?.push || true,
    },
  });

  useEffect(() => {
    if (data) {
      console.log("data alert", data);
      setAlertData({
        name: data?.name || "",
        location: data?.location || "",
        type: data?.type || "",
        priceRange: data?.priceRange || { min: 0, max: 10000000 },
        bedrooms: data?.bedrooms || "any",
        bathrooms: data?.bathrooms || "any",

        description: data?.description || "",
        notifications: {
          email: data?.notifications?.email || true,
          sms: data?.notifications?.sms || false,
          push: data?.notifications?.push || true,
        },
      });
    }
  }, [data]);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const propertyTypes = [
    { value: "flat", label: "Flat", icon: Home },
    { value: "plot", label: "Plot", icon: MapPin },
    { value: "land", label: "Land", icon: Ruler },
    { value: "mess", label: "Mess", icon: Home },
  ];
  const createAlertMutation = useCreateAlert();
  const updateAlert = useUpdateAlert();
  const handleCreateAlert = () => {
    if (!alertData.name || !alertData.location || !alertData.type) {
      return;
    }
    createAlertMutation.mutate(
      {
        ...alertData,
        bedrooms:
          alertData.bedrooms === "any" ? null : parseInt(alertData.bedrooms),
        bathrooms:
          alertData.bathrooms === "any" ? null : parseInt(alertData.bathrooms),
      },
      {
        onSuccess,
      },
    );
    console.log(alertData);
  };
  const handleUpdateAlert = () => {
    const payload = {
      ...alertData,
      bedrooms:
        alertData.bedrooms === "any" ? null : Number(alertData.bedrooms),
      bathrooms:
        alertData.bathrooms === "any" ? null : Number(alertData.bathrooms),
    };

    updateAlert.mutate({ id: data._id, alert: payload }, { onSuccess });
  };
  const handleSubmit = () => {
    if (isEditing) {
      console.log("update", data);
      handleUpdateAlert();
      return;
    } else {
      handleCreateAlert();
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return alertData.name && alertData.location && alertData.type;
      case 2:
        return true; // Price range always has default values
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Notification preferences
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="alertName">Alert Name *</Label>
              <Input
                id="alertName"
                placeholder="e.g., 3 BHK in Gulshan"
                value={alertData.name}
                onChange={(e) =>
                  setAlertData({ ...alertData, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Select
                value={alertData.location}
                onValueChange={(value) =>
                  setAlertData({ ...alertData, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-3 block">Property Type *</Label>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        alertData.type === type.value
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setAlertData({ ...alertData, type: type.value })
                      }
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Price & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">
                Price Range: {alertData.priceRange.min} - ₹
                {alertData.priceRange.max}
              </Label>
              <Slider
                value={[alertData.priceRange.min, alertData.priceRange.max]}
                onValueChange={(value) => {
                  console.log("value", value);
                  setAlertData({
                    ...alertData,
                    priceRange: { min: value[0], max: value[1] },
                  });
                }}
                max={20000000}
                min={0}
                step={100000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹0</span>
                <span>₹2 Crore</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minBudget">Minimum Budget</Label>
                <Input
                  id="minBudget"
                  type="number"
                  placeholder="500000"
                  value={alertData.priceRange.min}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      priceRange: {
                        min: Number.parseInt(e.target.value) || 0,
                        max: alertData.priceRange.max,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="maxBudget">Maximum Budget</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  placeholder="2000000"
                  value={alertData.priceRange.max}
                  onChange={(e) =>
                    setAlertData({
                      ...alertData,
                      priceRange: {
                        min: alertData.priceRange.min,
                        max: Number.parseInt(e.target.value) || 20000000,
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Quick Budget Presets</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Under ₹50L", range: [0, 5000000] },
                  { label: "₹50L - ₹1Cr", range: [5000000, 10000000] },
                  { label: "₹1Cr - ₹2Cr", range: [10000000, 20000000] },
                  { label: "Above ₹2Cr", range: [20000000, 50000000] },
                ].map((preset) => (
                  <Button
                    key={preset.label}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAlertData({
                        ...alertData,
                        priceRange: {
                          min: preset.range[0],
                          max: preset.range[1],
                        },
                      })
                    }
                    className="text-xs"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select
                  value={alertData.bedrooms}
                  onValueChange={(value) =>
                    setAlertData({ ...alertData, bedrooms: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select
                  value={alertData.bathrooms}
                  onValueChange={(value) =>
                    setAlertData({ ...alertData, bathrooms: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_OPTIONS.slice(0, 5).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Additional Requirements</Label>
              <Textarea
                id="description"
                placeholder="Any specific requirements or preferences..."
                value={alertData.description}
                onChange={(e) =>
                  setAlertData({ ...alertData, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">
                How would you like to be notified?
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Get detailed property matches via email
                    </div>
                  </div>
                  <Checkbox
                    checked={alertData.notifications.email}
                    onCheckedChange={(checked) =>
                      setAlertData({
                        ...alertData,
                        notifications: {
                          ...alertData.notifications,
                          email: checked as boolean,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">SMS Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Instant SMS for urgent matches
                    </div>
                  </div>
                  <Checkbox
                    checked={alertData.notifications.sms}
                    onCheckedChange={(checked) =>
                      setAlertData({
                        ...alertData,
                        notifications: {
                          ...alertData.notifications,
                          sms: checked as boolean,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Real-time notifications in the app
                    </div>
                  </div>
                  <Checkbox
                    checked={alertData.notifications.push}
                    onCheckedChange={(checked) =>
                      setAlertData({
                        ...alertData,
                        notifications: {
                          ...alertData.notifications,
                          push: checked as boolean,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Alert Summary</h4>
              <div className="space-y-1 text-sm">
                <div>
                  <strong>Name:</strong> {alertData.name || "Untitled Alert"}
                </div>
                <div>
                  <strong>Location:</strong>{" "}
                  {alertData.location || "Not specified"}
                </div>
                <div>
                  <strong>Type:</strong> {alertData.type || "Not specified"}
                </div>
                <div>
                  <strong>Budget:</strong> ₹
                  {/* {alertData.priceRange.min.toLocaleString()} - ₹
                  {alertData.priceRange.max.toLocaleString()} */}
                  {alertData.priceRange.min} - ₹{alertData.priceRange.max}
                </div>
                {alertData.bedrooms && (
                  <div>
                    <strong>Bedrooms:</strong> {alertData.bedrooms}+
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={!isStepValid()}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid()}>
              {isEditing ? "Update Alert" : "Create Alert"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
