import { useState, useEffect } from "react";
import { useForm, FormProvider, useWatch, appendErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddPropertyLayout } from "./AddPropertyLayout";
import { StepNavigator } from "./StepNavigator";
import { propertySteps } from "./steps";
import {
  BaseListingSchema,
  ListingFormData,
  PublishedListingSchema,
} from "@/lib/schemas/property";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useGooglePlacesAutocomplete } from "@/hooks/use-google-places-autocomplete";
import { generateMockListingFormData } from "@/lib/mock-data-generator";
import { propertiesService } from "@/lib/api/property"; // Assuming this path
import { useRouter } from "next/navigation";

interface AddPropertyFormProps {
  initialDraft?: {
    step: number;
    data: ListingFormData;
  };
  editingProperty?: ListingFormData & { listing_id: string };
  // onCancel: () => void;
}

export const AddPropertyForm = ({
  initialDraft,
  editingProperty,
  // onCancel,
}: AddPropertyFormProps) => {
  const totalSteps = propertySteps.length;
  const [currentStep, setCurrentStep] = useState(initialDraft?.step || 1);
  const [highestStepVisited, setHighestStepVisited] = useState(
    initialDraft?.step || 1,
  );
  const { data: session } = useSession();
  const { toast } = useToast();
  const autocomplete = useGooglePlacesAutocomplete();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const methods = useForm<ListingFormData>({
    resolver: zodResolver(BaseListingSchema),
    defaultValues: generateMockListingFormData(), // temporary defaults
  });

  const { reset } = methods;

  useEffect(() => {
    if (editingProperty) {
      const transformedData: ListingFormData = {
        ...editingProperty,
        location: {
          address: editingProperty.location?.address || "",
          city: editingProperty.location?.city || "",
          neighborhood: editingProperty.location?.neighborhood || "",
          zip_code: editingProperty.location?.zip_code || "",
          coordinates: {
            latitude:
              editingProperty.location?.coordinates?.coordinates?.[1] || null,
            longitude:
              editingProperty.location?.coordinates?.coordinates?.[0] || null,
          },
        },
        images: editingProperty.images || [],
        // imageFiles: [],
      };

      reset(transformedData);
    }
  }, [editingProperty, reset]);

  // || generateMockListingFormData()
  // useEffect(() => {
  //   console.log("Current Form Values:", watch());
  // }, [useWatch()]);

  // useEffect(() => {
  //   console.log("Validation Errors:", errors);
  // }, [appendErrors]);
  // console.log(editingProperty, "editingProperty");
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    register,
    trigger,
  } = methods;
  console.log("errors", errors);

  console.log("watch", watch());
  const formData = watch(); // Use watch to get current form values

  useEffect(() => {
    if (currentStep > highestStepVisited) {
      setHighestStepVisited(currentStep);
    }
  }, [currentStep, highestStepVisited]);

  const handleNext = async () => {
    const currentStepIndex = currentStep - 1;
    const currentStepConfig = propertySteps[currentStepIndex];
    const currentStepFields = currentStepConfig.fields;

    // Special rule for Media Upload step
    if (currentStepConfig.id === "media-uploads") {
      if (!formData.images?.length && !formData.imageFiles?.length) {
        toast({
          title: "Image Required",
          description: "You must upload at least one image before continuing.",
          variant: "destructive",
        });
        return;
      }
    }

    // Trigger validation for this step
    const isValid = await trigger(currentStepFields);

    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Collect invalid fields
      const invalidFields = currentStepFields.filter(
        (field) => !!errors[field],
      );

      toast({
        title: "Validation Error",
        description: `Missing or invalid: ${invalidFields.join(", ")}`,
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= highestStepVisited) {
      setCurrentStep(step);
    } else if (step === currentStep + 1) {
      handleNext();
    }
  };

  const handlePropertyTypeChange = (
    value: "Flat" | "House" | "Land" | "Plot" | "Mess",
  ) => {
    setValue("property_type", value);
    if (value === "Land" || value === "Plot") {
      setValue("bedrooms", undefined);
      setValue("bathrooms", undefined);
      setValue("unit_number", undefined);
      setValue("amenities", undefined);
      setValue("year_built", undefined);
      setValue("property_condition", undefined);
      setValue("eco_features", undefined);
      setValue("smart_features", undefined);
      setValue("nearby_places", undefined);
    }
  };

  const reverseGeocodeCoordinates = async (
    latitude: number,
    longitude: number,
  ) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      console.warn("Google Maps Geocoder not available.");
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    try {
      const response = await geocoder.geocode({ location: latlng });
      if (response.results[0]) {
        const addressComponents = response.results[0].address_components;
        let address = "";
        let city = "";
        let neighborhood = "";
        let zip_code = "";

        for (const component of addressComponents) {
          if (
            component.types.includes("street_address") ||
            component.types.includes("route") ||
            component.types.includes("premise")
          ) {
            address = `${component.long_name} ${address}`;
          } else if (
            component.types.includes("sublocality_level_1") ||
            component.types.includes("sublocality")
          ) {
            neighborhood = component.long_name;
          } else if (
            component.types.includes("locality") ||
            component.types.includes("administrative_area_level_2")
          ) {
            city = component.long_name;
          } else if (component.types.includes("postal_code")) {
            zip_code = component.long_name;
          }
        }
        // Fallback for address if street_address/route not found
        if (!address && response.results[0].formatted_address) {
          address = response.results[0].formatted_address.split(",")[0] || "";
        }

        return {
          address: address.trim(),
          city: city,
          neighborhood: neighborhood,
          zip_code: zip_code,
        };
      }
      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  function toFormData(
    data: Record<string, any>,
    excludeKeys: string[] = [],
    extraFields: Record<string, any> = {},
  ): FormData {
    const formData = new FormData();

    const filteredData = Object.keys(data)
      .filter((key) => !excludeKeys.includes(key))
      .reduce((obj: any, key) => {
        obj[key] = data[key];
        return obj;
      }, {});

    // Transform coordinates if they exist
    if (filteredData.location && filteredData.location.coordinates) {
      const { latitude, longitude } = filteredData.location.coordinates;
      filteredData.location.coordinates = {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    // Append main data as a JSON string
    formData.append("data", JSON.stringify(filteredData));

    // Append image files from form state
    if (data.imageFiles && Array.isArray(data.imageFiles)) {
      data.imageFiles.forEach((file: File) => {
        formData.append("images", file);
      });
    }

    // Append any extra fields like status = draft
    Object.entries(extraFields).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return formData;
  }

  const onPublish = async (data: ListingFormData) => {
    console.log("Attempting to publish property...", data);

    if (!session?.user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to post a property.",
        variant: "destructive",
      });
      return;
    }

    const validationResult = PublishedListingSchema.safeParse({
      ...data,
      status: "published",
    });
    console.log("validationResult", validationResult);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.errors.map(
        (err) => err.path.join("."), // turns ['location', 'address'] into "location.address"
      );
      console.log(validationResult, "validationResult");
      toast({
        title: "Validation Error",
        description: `Please Fill the ${fieldErrors.join(", ")} `,
        variant: "destructive",
      });

      return;
    }
    const formDataToSend = toFormData({ ...data, status: "published" }, [
      "is_featured",
      "is_verified",
      "images",
      "imageFiles",
    ]);

    try {
      let result;
      if (editingProperty) {
        // Prefer _id over listing_id
        const idToUpdate = editingProperty._id || editingProperty._id;
        result = await propertiesService.updateProperty(
          idToUpdate,
          formDataToSend,
        );
      } else {
        result = await propertiesService.createProperty(formDataToSend);
      }

      toast({
        title: "Success",
        description: editingProperty
          ? "Property updated successfully!"
          : "Property published successfully!",
      });

      router.push("/dashboard/properties");
    } catch (error: any) {
      console.error("Failed to publish property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish property.",
        variant: "destructive",
      });
    }
  };

  const onSaveDraftSubmit = async (data: ListingFormData) => {
    if (!session?.user?.token) {
      toast({
        title: "Error",
        description: "You must be logged in to save a draft.",
        variant: "destructive",
      });
      return;
    }

    const formDataToSend = toFormData({ ...data, status: "draft" }, [
      "is_featured",
      "is_verified",
      "images",
      "imageFiles",
    ]);

    try {
      await propertiesService.saveDraft(formDataToSend);
      toast({ title: "Success", description: "Draft saved successfully!" });
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save draft.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Update imageFiles in form state
      setValue("imageFiles", [...(formData.imageFiles || []), ...files]);
      // Update images (URLs) in form state for display
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setValue("images", [...(formData.images || []), ...imageUrls]);
    }
  };

  const removeImage = (index: number) => {
    // Remove from imageFiles in form state
    setValue(
      "imageFiles",
      formData.imageFiles?.filter((_, i) => i !== index),
    );
    // Remove from images (URLs) in form state
    setValue(
      "images",
      formData.images?.filter((_, i) => i !== index),
    );
  };

  // Main component render
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onPublish)} className="py-8">
        <AddPropertyLayout
          sidebar={
            <StepNavigator
              steps={propertySteps}
              currentStep={propertySteps[currentStep - 1].id} // Adjust for 0-based index
              onStepClick={(stepId) =>
                handleStepClick(
                  propertySteps.findIndex((s) => s.id === stepId) + 1,
                )
              }
            />
          }
          content={
            <Card>
              <CardContent className="p-6">
                {/* Pass all necessary props to the current step component */}
                {propertySteps[currentStep - 1].component &&
                  (() => {
                    const CurrentStepComponent =
                      propertySteps[currentStep - 1].component;
                    return (
                      <CurrentStepComponent
                        control={control}
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        formData={formData}
                        autocomplete={autocomplete}
                        showSuggestions={showSuggestions}
                        setShowSuggestions={setShowSuggestions}
                        handlePropertyTypeChange={handlePropertyTypeChange}
                        reverseGeocodeCoordinates={reverseGeocodeCoordinates}
                        handleImageUpload={handleImageUpload}
                        removeImage={removeImage}
                      />
                    );
                  })()}
                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={handleNext}>
                      Next Step
                    </Button>
                  ) : (
                    <div className="flex space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSubmit(onSaveDraftSubmit)}
                      >
                        Save Draft
                      </Button>
                      <Button type="submit">Publish Property</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          }
        />
      </form>
    </FormProvider>
  );
};
