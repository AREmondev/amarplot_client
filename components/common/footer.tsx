import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AP</span>
              </div>
              <span className="font-heading font-bold text-xl">AmarPlot</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted partner in finding the perfect property. Buy, sell, or rent with confidence.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/search?transaction_type=buy" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Buy Property
              </Link>
              <Link href="/search?transaction_type=rent" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Rent Property
              </Link>
              <Link href="/add-property" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Sell Property
              </Link>
              <Link href="/map" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Map Search
              </Link>
              <Link href="/communities" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Communities
              </Link>
              <Link href="/trends" className="block text-muted-foreground hover:text-foreground cursor-pointer">
                Price Trends
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm">
              <Link href="/help" className="block text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@amarplot.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+880 1234-567890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Subscribe to our newsletter</p>
              <div className="flex space-x-2">
                <Input placeholder="Enter your email" className="text-sm" />
                <Button size="sm" className="cursor-pointer">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 AmarPlot. All rights reserved. Built with ❤️ for Bangladesh.</p>
        </div>
      </div>
    </footer>
  )
}
