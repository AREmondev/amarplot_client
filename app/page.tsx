import RecentlyAdded from "@/components/common/recently-added";
import HotDeals from "@/components/common/hot-deals";
import CommunitiesPreview from "@/components/communities/communities-preview";
import PriceTrendChart from "@/components/dashboard/price-trend-chart";
import { HeroSection } from "@/components/common/hero-section";
import { FeaturedCategories } from "@/components/common/featured-categories";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedCategories />

      {/* <FeaturedCategories /> */}
      <RecentlyAdded />
      <HotDeals />
      {/* <PriceTrendChart /> */}
      <CommunitiesPreview />
    </div>
  );
}
