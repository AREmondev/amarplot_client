// app/my-properties/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { propertiesService, Property } from "@/lib/api/property";
import ListingGrid from "@/components/listings/listing-grid";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyPropertiesPage() {
  const { t } = useTranslation(["common", "forms"]);
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

    const getMyProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertiesService.getMyProperties(
          session.accessToken as string,
        );
        setProperties(data);
      } catch (err) {
        console.error("Error fetching my properties:", err);
        setError(t("common:failed_load_properties"));
      } finally {
        setLoading(false);
      }
    };

    getMyProperties();
  }, [session, status, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <div className="flex-1 overflow-auto p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              {/* Page Header Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
              </div>

              {/* Content Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 mb-4" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            {error}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{t("common:my_properties")}</h1>

      {properties.length > 0 ? (
        <ListingGrid properties={properties} />
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            {t("common:no_properties_listed")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
