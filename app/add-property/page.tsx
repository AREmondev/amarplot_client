'use client';

import { AddPropertyForm } from '@/components/property/add-property-refactored/AddPropertyForm';
import WithVerification from "@/components/common/with-verification";
import { useRouter } from 'next/navigation';

const AddPropertyPage = () => {
  // initialDraft, editingProperty, onCancel
  const router = useRouter();
  const onCancel = () => {
    router.push("/");
  };

  

  return (
    <WithVerification>
      <AddPropertyForm  />
    </WithVerification>
  );
};

export default AddPropertyPage;