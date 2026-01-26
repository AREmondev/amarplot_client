'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

// Placeholder for property data - in a real app, this would come from an API
const properties = [
  {
    id: "prop-001",
    title: "Modern Apartment in Gulshan",
    status: "active",
    isFeatured: false,
    isHotProduct: false,
    lastBumped: "2024-07-10",
  },
  {
    id: "prop-002",
    title: "Family House in Banani",
    status: "pending",
    isFeatured: false,
    isHotProduct: false,
    lastBumped: "2024-07-05",
  },
  {
    id: "prop-003",
    title: "Studio Flat near DU",
    status: "active",
    isFeatured: true,
    isHotProduct: false,
    lastBumped: "2024-07-12",
  },
  {
    id: "prop-004",
    title: "Commercial Space in Motijheel",
    status: "active",
    isFeatured: false,
    isHotProduct: true,
    lastBumped: "2024-07-08",
  },
]

export default function AdminPropertyList() {
  const [propertyList, setPropertyList] = useState(properties)

  const handleBumpUp = (id: string) => {
    console.log(`Bump up property: ${id}`)
    // In a real application, this would be an API call
    setPropertyList(prev => prev.map(p => p.id === id ? { ...p, lastBumped: new Date().toISOString().split('T')[0] } : p))
  }

  const handleFeatureToggle = (id: string) => {
    console.log(`Toggle feature for property: ${id}`)
    // In a real application, this would be an API call
    setPropertyList(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
  }

  const handleHotProductToggle = (id: string) => {
    console.log(`Toggle hot product for property: ${id}`)
    // In a real application, this would be an API call
    setPropertyList(prev => prev.map(p => p.id === id ? { ...p, isHotProduct: !p.isHotProduct } : p))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Listings Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Hot Product</TableHead>
              <TableHead>Last Bumped</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propertyList.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>
                  <Badge variant={property.status === "active" ? "default" : "outline"}>
                    {property.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {property.isFeatured ? <Badge variant="secondary">Yes</Badge> : <Badge variant="outline">No</Badge>}
                </TableCell>
                <TableCell>
                  {property.isHotProduct ? <Badge variant="secondary">Yes</Badge> : <Badge variant="outline">No</Badge>}
                </TableCell>
                <TableCell>{property.lastBumped}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBumpUp(property.id)}>
                        Bump Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFeatureToggle(property.id)}>
                        {property.isFeatured ? "Unfeature" : "Feature on Homepage"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleHotProductToggle(property.id)}>
                        {property.isHotProduct ? "Remove from Hot Products" : "Mark as Hot Product"}
                      </DropdownMenuItem>
                      {/* Add more actions here, e.g., Edit, View Details, Delete */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
