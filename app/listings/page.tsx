import ListingFilters from "@/components/listings/listing-filters"
import ListingGrid from "@/components/listings/listing-grid"

export default function ListingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Property Listings</h1>
          <p className="text-muted-foreground">Browse through our extensive collection of properties</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ListingFilters />
          </div>
          <div className="lg:col-span-3">
            <ListingGrid properties={[]} />
          </div>
        </div>
      </div>
    </div>
  )
}
