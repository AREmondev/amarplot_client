"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Bell,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateAlertModal from "@/components/alerts/create-alert-modal";
import EditAlertModal from "@/components/alerts/edit-alert-modal";
import { useToast } from "@/hooks/use-toast";
import {
  alertsService,
  useDeleteAlert,
  useUserPropertyAlertsQuery,
} from "@/lib/api/alerts";
import { LoadingExample } from "../common/loading-example";
import AlertModal from "./alertForm";

export interface AlertType {
  _id: string;
  name: string;
  location: string;
  type: "Flat" | "House" | "Duplex" | "Studio" | any; // Added specific types for better safety
  priceRange: {
    min: number;
    max: number;
  }; // Represented as a tuple [min, max]
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  maxArea: number;
  active: boolean;
  matches: number;
  lastMatch: string; // Or Date if you plan to parse it
  createdAt: string; // Or Date
  notifications: NotificationSettings;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export default function AlertManagement() {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<AlertType | null>(null);
  const { toast } = useToast();

  const toggleAlertStatus = (alertId: number) => {};
  const createAlertMutation = useDeleteAlert();

  const deleteAlert = (alertId: string) => {
    createAlertMutation.mutate(alertId);
  };

  const handleCreateAlert = (newAlert: any) => {
    setShowCreateModal(false);
  };

  const handleEditAlert = (updatedAlert: any) => {
    setEditingAlert(null);
  };

  const { data: alertsData, isLoading, isError } = useUserPropertyAlertsQuery();
  console.log(
    "alertsData, isLoading, isError  ",
    alertsData,
    isLoading,
    isError,
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching alerts</p>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Property Alerts
              </CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                Manage your property alerts and get notified when new matches
                are found
              </p>
            </div>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Property Alert</DialogTitle>
                </DialogHeader>
                <AlertModal onSuccess={() => setShowCreateModal(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {alertsData.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {alertsData.filter((a: AlertType) => a.active).length}
            </div>
            <div className="text-sm text-muted-foreground">Active Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {alertsData.reduce((sum, a: AlertType) => sum + a.matches, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">
              {
                alertsData.filter((a: AlertType) => a.active && a.matches > 0)
                  .length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              Alerts with Matches
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alertsData.map((alert: AlertType) => (
          <AlertCard
            setEditingAlert={setEditingAlert}
            toggleAlertStatus={toggleAlertStatus}
            deleteAlert={deleteAlert}
            alert={alert}
          />
        ))}

        {alertsData.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No alerts created yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Create your first property alert to get notified when matching
                properties become available.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Alert
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Alert Modal */}
      {editingAlert && (
        <Dialog
          open={!!editingAlert}
          onOpenChange={() => setEditingAlert(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Alert: {editingAlert.name}</DialogTitle>
            </DialogHeader>
            <AlertModal
              onSuccess={() => setEditingAlert(null)}
              isEditing={true}
              data={editingAlert}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface AlertCardProps {
  alert: AlertType;
  setEditingAlert: (alert: AlertType) => void;
  toggleAlertStatus: (alertId: number) => void;
  deleteAlert: (alertId: number) => void;
}

const AlertCard = ({
  alert,
  setEditingAlert,
  toggleAlertStatus,
  deleteAlert,
}: AlertCardProps) => {
  return (
    <Card
      key={alert._id}
      className={`border-2 ${alert.active ? "border-primary/20" : "border-muted"}`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg">{alert.name}</h3>
              <Badge variant={alert.active ? "default" : "secondary"}>
                {alert.active ? "Active" : "Paused"}
              </Badge>
              {alert.matches > 0 && (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent/20"
                >
                  {alert.matches} matches
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              {alert.location}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <div className="font-medium">{alert.type}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Price Range:</span>
                <div className="font-medium">
                  ₹{alert.priceRange.min.toLocaleString()} - ₹
                  {alert.priceRange.max.toLocaleString()}
                </div>
              </div>
              {alert.bedrooms && (
                <div>
                  <span className="text-muted-foreground">Bedrooms:</span>
                  <div className="font-medium">{alert.bedrooms}+</div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Last Match:</span>
                <div className="font-medium">{alert.lastMatch}</div>
              </div>
            </div>

            {alert.minArea && (
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Area: </span>
                <span className="font-medium">
                  {alert.minArea} - {alert.maxArea || "∞"} sq ft
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">
                Notifications:
              </span>
              {alert.notifications.email && (
                <Badge variant="outline" className="text-xs">
                  Email
                </Badge>
              )}
              {alert.notifications.sms && (
                <Badge variant="outline" className="text-xs">
                  SMS
                </Badge>
              )}
              {alert.notifications.push && (
                <Badge variant="outline" className="text-xs">
                  Push
                </Badge>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingAlert(alert)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Alert
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleAlertStatus(alert._id)}>
                {alert.active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Pause Alert
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Activate Alert
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => deleteAlert(alert._id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Alert
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {alert.matches > 0 && (
          <div className="border-t pt-4">
            <Button variant="outline" size="sm" className="mr-2 bg-transparent">
              View {alert.matches} Matches
            </Button>
            {alert.active && <Button size="sm">Get Notified</Button>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
