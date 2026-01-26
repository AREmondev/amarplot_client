// components/property/property-description.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyDescriptionProps {
  description?: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description || 'No description available.'}</p>
      </CardContent>
    </Card>
  );
}
