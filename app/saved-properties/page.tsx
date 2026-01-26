// app/saved-properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from 'react-i18next';
import { propertiesService, Property } from "@/lib/api/property";
import ListingGrid from "@/components/listings/listing-grid";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function SavedPropertiesPage() {
  const { t } = useTranslation(['common', 'constants']);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while session is loading

    if (!session) {
      router.push("/auth"); // Redirect to login if not authenticated
      return;
    }

    const getSavedProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertiesService.getSavedProperties(session.accessToken as string);
        setProperties(data);
      } catch (err) {
        console.error("Error fetching saved properties:", err);
        setError(t('common:failed_to_load_saved_properties'));
      } finally {
        setLoading(false);
      }
    };

    getSavedProperties();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center">{t('common:loading_saved_properties')}</CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center text-red-500">{error}</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t('common:saved_properties')}</h1>

      {properties.length > 0 ? (
        <ListingGrid properties={properties} />
      ) : (
        <Card>
          <CardContent className="p-6 text-center">{t('common:no_saved_properties_yet')}</CardContent>
        </Card>
      )}
    </div>
  );
}