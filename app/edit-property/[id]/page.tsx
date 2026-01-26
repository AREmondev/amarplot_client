"use client";

import { AddPropertyForm } from '@/components/property/add-property-refactored/AddPropertyForm';
import { propertiesService } from '@/lib/api/property';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const EditProperty = () => {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
console.log(property, 'property in edit page');
  useEffect(() => {
    const fetchProperty = async () => {
      if (!params?.id) return; // Ensure ID exists
      try {
        const data = await propertiesService.getPropertyById(params.id as string);
        // console.log(data.data);
        setProperty(data.data);
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params?.id]);
console.log(property, 'property in edit page useEffect');

  if (loading) return <p>Loading property details...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div>
      <AddPropertyForm editingProperty={property} />
    </div>
  );
};

export default EditProperty;
