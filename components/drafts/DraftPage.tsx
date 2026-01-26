"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  Trash2,
  Play,
  Calendar,
  Search,
  MapPin,
} from "lucide-react";
import type { DraftData } from "@/types";

interface DraftsProps {
  drafts: DraftData[];
  onDelete: (id: string) => void;
  onResume: (draft: DraftData) => void;
}

export function Drafts({ drafts, onDelete, onResume }: DraftsProps) {
  const { t } = useTranslation(["common", "forms"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const getStepName = (step: number) => {
    switch (step) {
      case 1:
        return t("forms:basic_information");
      case 2:
        return t("forms:location_details");
      case 3:
        return t("forms:upload_images");
      case 4:
        return t("forms:review_publish");
      default:
        return t("common:unknown_step");
    }
  };

  const formatLastSaved = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return t("common:just_now");
    if (diffInHours < 24) return t("common:hours_ago", { count: diffInHours });
    return date.toLocaleDateString();
  };

  // Filter and sort drafts
  const filterDrafts = (step?: number) => {
    let filtered = drafts;

    // Filter by step if provided
    if (step) {
      filtered = filtered.filter((d) => d.step === step);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          (d.data.title &&
            d.data.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.data.type &&
            d.data.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (d.data.location?.address &&
            d.data.location.address
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Sort drafts
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.lastSaved).getTime() - new Date(b.lastSaved).getTime()
        );
        break;
      case "progress":
        filtered.sort((a, b) => b.step - a.step);
        break;
      case "name":
        filtered.sort((a, b) =>
          (a.data.title || "").localeCompare(b.data.title || "")
        );
        break;
    }

    return filtered;
  };

  const step1Drafts = filterDrafts(1);
  const step2Drafts = filterDrafts(2);
  const step3Drafts = filterDrafts(3);
  const step4Drafts = filterDrafts(4);
  const allDrafts = filterDrafts();

  const DraftCard = ({ draft }: { draft: DraftData }) => (
    <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {draft.data.title || t("forms:untitled_property")}
              </h3>
              {draft.data.type && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  {draft.data.type}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {t("forms:step_of_total", { current: draft.step, total: 4 })}:{" "}
                  {getStepName(draft.step)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {t("common:saved")} {formatLastSaved(draft.lastSaved)}
                </span>
              </div>
            </div>

            {draft.data.price && (
              <p className="text-lg font-semibold text-blue-600 mb-2">
                {draft.data.price}
              </p>
            )}

            {draft.data.location?.address && (
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{draft.data.location.address}</span>
              </div>
            )}

            {draft.data.description && (
              <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                {draft.data.description}
              </p>
            )}

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(draft.step / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-6">
            <Button
              onClick={() => onResume(draft)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{t("common:continue")}</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onDelete(draft.id)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DraftGrid = ({ drafts }: { drafts: DraftData[] }) => (
    <>
      {drafts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("common:no_drafts_found")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("common:try_adjusting_search")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("common:draft_properties")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("common:drafts_saved", { count: drafts.length })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t("forms:search_drafts_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={t("common:sort_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  {t("common:recently_saved")}
                </SelectItem>
                <SelectItem value="oldest">
                  {t("common:oldest_first")}
                </SelectItem>
                <SelectItem value="progress">
                  {t("common:most_progress")}
                </SelectItem>
                <SelectItem value="name">{t("common:name_a_z")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <span>{t("common:all")}</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {allDrafts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="step1" className="flex items-center space-x-2">
            <span>{t("forms:step_1")}</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {step1Drafts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="step2" className="flex items-center space-x-2">
            <span>{t("forms:step_2")}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {step2Drafts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="step3" className="flex items-center space-x-2">
            <span>{t("forms:step_3")}</span>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700"
            >
              {step3Drafts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="step4" className="flex items-center space-x-2">
            <span>{t("forms:step_4")}</span>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700"
            >
              {step4Drafts.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <DraftGrid drafts={allDrafts} />
        </TabsContent>

        <TabsContent value="step1" className="space-y-6">
          <DraftGrid drafts={step1Drafts} />
        </TabsContent>

        <TabsContent value="step2" className="space-y-6">
          <DraftGrid drafts={step2Drafts} />
        </TabsContent>

        <TabsContent value="step3" className="space-y-6">
          <DraftGrid drafts={step3Drafts} />
        </TabsContent>

        <TabsContent value="step4" className="space-y-6">
          <DraftGrid drafts={step4Drafts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
