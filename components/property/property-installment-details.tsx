// components/property/property-installment-details.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Percent, DollarSign, FileText, AlertCircle } from "lucide-react";

interface InstallmentData {
  available: boolean;
  duration_months?: number;
  down_payment_percentage?: number;
  monthly_amount?: number;
  service_details?: string;
  terms_and_conditions?: string;
}

interface PropertyInstallmentDetailsProps {
  installment?: InstallmentData;
  totalPrice: number;
}

export function PropertyInstallmentDetails({ installment, totalPrice }: PropertyInstallmentDetailsProps) {
  // If installment is not available, don't render the component
  if (!installment?.available) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `BDT ${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `BDT ${(price / 100000).toFixed(2)} Lac`;
    }
    return `BDT ${price.toLocaleString()}`;
  };

  const calculateDownPayment = () => {
    if (installment.down_payment_percentage) {
      return (totalPrice * installment.down_payment_percentage) / 100;
    }
    return 0;
  };

  const calculateRemainingAmount = () => {
    return totalPrice - calculateDownPayment();
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-600" />
          Installment Options
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            Available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Installment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {installment.duration_months && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold text-gray-900">{installment.duration_months} Months</p>
              </div>
            </div>
          )}
          
          {installment.down_payment_percentage && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <Percent className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Down Payment</p>
                <p className="font-semibold text-gray-900">
                  {installment.down_payment_percentage}% ({formatPrice(calculateDownPayment())})
                </p>
              </div>
            </div>
          )}
          
          {installment.monthly_amount && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Monthly Payment</p>
                <p className="font-semibold text-gray-900">{formatPrice(installment.monthly_amount)}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Remaining Amount</p>
              <p className="font-semibold text-gray-900">{formatPrice(calculateRemainingAmount())}</p>
            </div>
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Payment Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Property Price:</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            {installment.down_payment_percentage && (
              <div className="flex justify-between">
                <span className="text-gray-600">Down Payment ({installment.down_payment_percentage}%):</span>
                <span className="font-medium text-orange-600">-{formatPrice(calculateDownPayment())}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Amount to be financed:</span>
              <span className="font-semibold">{formatPrice(calculateRemainingAmount())}</span>
            </div>
            {installment.monthly_amount && installment.duration_months && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total installment payments:</span>
                <span className="font-medium">{formatPrice(installment.monthly_amount * installment.duration_months)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Service Details */}
        {installment.service_details && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Service Details
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{installment.service_details}</p>
          </div>
        )}

        {/* Terms and Conditions */}
        {installment.terms_and_conditions && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Terms & Conditions
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">{installment.terms_and_conditions}</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Interested in installment payment?</strong>
          </p>
          <p className="text-xs text-gray-600">
            Contact the property owner to discuss installment terms and finalize the payment plan.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}