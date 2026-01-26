// components/examples/i18n-example.tsx
"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

/**
 * Example component demonstrating how to use i18n translations
 * This shows how to integrate translations across different namespaces
 */
export function I18nExample() {
  const { t, i18n, ready } = useTranslation([
    "common",
    "navigation",
    "forms",
    "constants",
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !ready) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="text-lg">Loading translations...</div>
        </div>
      </div>
    );
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage("bn");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t("common:app.title")} - {t("common:app.subtitle")}
        </h1>
        <Button onClick={toggleLanguage}>
          {i18n.language === "en" ? "বাংলা" : "English"}
        </Button>
      </div>

      {/* Hero Section Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("common:hero.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {t("common:hero.subtitle")}
          </p>
          <div className="flex gap-2">
            <Button>{t("common:hero.search_button")}</Button>
            <Button variant="outline">{t("common:hero.advanced")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("navigation:header.navigation")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Badge>{t("navigation:header.buy")}</Badge>
            <Badge>{t("navigation:header.rent")}</Badge>
            <Badge>{t("navigation:header.sell")}</Badge>
            <Badge>{t("navigation:header.messages")}</Badge>
            <Badge>{t("navigation:header.notifications")}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Property Types Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("constants:property_types.Land")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted rounded">
              <h3 className="font-semibold">
                {t("constants:property_types.Flat")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("common:categories.flats.description")}
              </p>
            </div>
            <div className="p-3 bg-muted rounded">
              <h3 className="font-semibold">
                {t("constants:property_types.Plot")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("common:categories.plots.description")}
              </p>
            </div>
            <div className="p-3 bg-muted rounded">
              <h3 className="font-semibold">
                {t("constants:property_types.Mess")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("common:categories.mess.description")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forms Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("forms:auth.login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-sm font-medium">
                {t("forms:auth.email")}
              </label>
              <input
                type="email"
                placeholder={t("forms:auth.email")}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                {t("forms:auth.password")}
              </label>
              <input
                type="password"
                placeholder={t("forms:auth.password")}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <Button className="w-full">{t("forms:auth.login_button")}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Property Details Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("common:property.overview")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-semibold">3</div>
              <div className="text-sm text-muted-foreground">
                {t("common:property.bedrooms")}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-semibold">2</div>
              <div className="text-sm text-muted-foreground">
                {t("common:property.bathrooms")}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-semibold">1200 sq ft</div>
              <div className="text-sm text-muted-foreground">
                {t("common:property.size")}
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="font-semibold">
                {t("constants:facing_directions.North")}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("common:property.facing")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Example */}
      <Card>
        <CardHeader>
          <CardTitle>{t("navigation:footer.quick_links")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold mb-2">
                {t("navigation:footer.support")}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>{t("navigation:footer.help_center")}</li>
                <li>{t("navigation:footer.contact_us")}</li>
                <li>{t("navigation:footer.privacy_policy")}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                {t("navigation:footer.quick_links")}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>{t("navigation:footer.buy_property")}</li>
                <li>{t("navigation:footer.rent_property")}</li>
                <li>{t("navigation:footer.sell_property")}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Language Info */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            {t("common:ui.current_language")}:{" "}
            <strong>{i18n.language === "en" ? "English" : "বাংলা"}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default I18nExample;
