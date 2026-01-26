"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  Bell, 
  Check, 
  ChevronRight, 
  Download, 
  Edit, 
  Filter, 
  Heart, 
  Home, 
  Mail, 
  Menu, 
  MoreHorizontal, 
  Plus, 
  Save, 
  Search, 
  Settings, 
  Share, 
  Trash, 
  Upload, 
  User 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { IconButton } from "@/components/ui/icon-button"
import { LinkButton } from "@/components/ui/link-button"
import { ToggleButton } from "@/components/ui/toggle-button"
import { SplitButton } from "@/components/ui/split-button"
import { FloatingActionButton } from "@/components/ui/floating-action-button"
import { 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"

export default function ButtonShowcasePage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [toggleState, setToggleState] = React.useState(false)

  const handleLoadingDemo = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="container mx-auto py-12">
      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Button Components Showcase</h1>
          <p className="text-muted-foreground">A comprehensive showcase of all button components with their variants and features.</p>
        </div>

        {/* Standard Button Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Standard Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="outline-primary">Outline Primary</Button>
            <Button variant="outline-destructive">Outline Destructive</Button>
          </div>
        </section>

        {/* Button Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="xs">Extra Small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
          </div>
        </section>

        {/* Button Shapes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Shapes</h2>
          <div className="flex flex-wrap gap-4">
            <Button rounded="none">Square</Button>
            <Button rounded="sm">Small Radius</Button>
            <Button>Default Radius</Button>
            <Button rounded="lg">Large Radius</Button>
            <Button rounded="xl">Extra Large Radius</Button>
            <Button rounded="full">Fully Rounded</Button>
          </div>
        </section>

        {/* Buttons with Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons with Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<Search />}>Search</Button>
            <Button rightIcon={<ArrowRight />}>Next</Button>
            <Button leftIcon={<Download />} rightIcon={<ChevronRight />}>Download</Button>
            <Button variant="outline" leftIcon={<Edit />}>Edit</Button>
            <Button variant="secondary" rightIcon={<Save />}>Save</Button>
            <Button variant="destructive" leftIcon={<Trash />}>Delete</Button>
          </div>
        </section>

        {/* Loading Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Loading Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button isLoading>Loading</Button>
            <Button isLoading loadingText="Saving...">Save</Button>
            <Button variant="outline" isLoading loadingText="Processing...">Submit</Button>
            <Button variant="secondary" onClick={handleLoadingDemo} isLoading={isLoading}>
              {isLoading ? "Loading..." : "Click to Load"}
            </Button>
          </div>
        </section>

        {/* Full Width Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Full Width Buttons</h2>
          <div className="space-y-4 max-w-md">
            <Button fullWidth>Full Width Button</Button>
            <Button variant="outline" fullWidth leftIcon={<Mail />}>Contact Us</Button>
            <Button variant="secondary" fullWidth isLoading loadingText="Submitting...">Submit Form</Button>
          </div>
        </section>

        {/* Button Groups */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Button Groups</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Attached Buttons (Default)</h3>
              <ButtonGroup>
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Segmented Buttons</h3>
              <ButtonGroup variant="segmented">
                <Button>Day</Button>
                <Button>Week</Button>
                <Button>Month</Button>
                <Button>Year</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Vertical Button Group</h3>
              <ButtonGroup orientation="vertical">
                <Button leftIcon={<Home />}>Dashboard</Button>
                <Button leftIcon={<User />}>Profile</Button>
                <Button leftIcon={<Settings />}>Settings</Button>
              </ButtonGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Full Width Button Group</h3>
              <ButtonGroup fullWidth>
                <Button>Cancel</Button>
                <Button variant="primary">Submit</Button>
              </ButtonGroup>
            </div>
          </div>
        </section>

        {/* Icon Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Icon Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <IconButton icon={<Search />} aria-label="Search" />
            <IconButton icon={<Heart />} variant="secondary" aria-label="Favorite" />
            <IconButton icon={<Menu />} variant="outline" aria-label="Menu" />
            <IconButton icon={<Settings />} variant="ghost" aria-label="Settings" />
            <IconButton icon={<Trash />} variant="destructive" aria-label="Delete" />
            <IconButton icon={<Bell />} variant="subtle" aria-label="Notifications" />
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Icon Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <IconButton icon={<Plus />} size="xs" aria-label="Add" />
              <IconButton icon={<Plus />} size="sm" aria-label="Add" />
              <IconButton icon={<Plus />} aria-label="Add" />
              <IconButton icon={<Plus />} size="lg" aria-label="Add" />
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Icon Button Shapes</h3>
            <div className="flex flex-wrap gap-4">
              <IconButton icon={<Search />} rounded="none" aria-label="Search" />
              <IconButton icon={<Search />} rounded="sm" aria-label="Search" />
              <IconButton icon={<Search />} aria-label="Search" />
              <IconButton icon={<Search />} rounded="lg" aria-label="Search" />
              <IconButton icon={<Search />} rounded="xl" aria-label="Search" />
              <IconButton icon={<Search />} rounded="full" aria-label="Search" />
            </div>
          </div>
        </section>

        {/* Link Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Link Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <LinkButton href="/">Home</LinkButton>
            <LinkButton href="/" variant="secondary" leftIcon={<User />}>Profile</LinkButton>
            <LinkButton href="https://github.com" external variant="outline" rightIcon={<ArrowRight />}>GitHub</LinkButton>
            <LinkButton href="/" variant="ghost">Documentation</LinkButton>
          </div>
        </section>

        {/* Toggle Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Toggle Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <ToggleButton>Toggle Me</ToggleButton>
            <ToggleButton variant="outline" leftIcon={<Filter />}>Filter</ToggleButton>
            <ToggleButton variant="subtle" rightIcon={<Check />}>Selected</ToggleButton>
            <ToggleButton variant="primary" pressed={toggleState} onChange={setToggleState}>
              {toggleState ? "On" : "Off"}
            </ToggleButton>
          </div>
        </section>

        {/* Split Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Split Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <SplitButton 
              menuItems={
                <>
                  <DropdownMenuItem>Save as Draft</DropdownMenuItem>
                  <DropdownMenuItem>Schedule</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </>
              }
            >
              Save
            </SplitButton>
            
            <SplitButton 
              variant="secondary"
              leftIcon={<Share />}
              menuItems={
                <>
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Twitter</DropdownMenuItem>
                  <DropdownMenuItem>Facebook</DropdownMenuItem>
                </>
              }
            >
              Share
            </SplitButton>
            
            <SplitButton 
              variant="outline"
              menuItems={
                <>
                  <DropdownMenuItem>Small</DropdownMenuItem>
                  <DropdownMenuItem>Medium</DropdownMenuItem>
                  <DropdownMenuItem>Large</DropdownMenuItem>
                </>
              }
            >
              Export
            </SplitButton>
          </div>
        </section>

        {/* Floating Action Buttons */}
        <section className="space-y-4 relative h-64 border rounded-lg p-4">
          <h2 className="text-2xl font-semibold">Floating Action Buttons</h2>
          <p className="text-muted-foreground">Positioned within this container for demonstration</p>
          
          <FloatingActionButton 
            icon={<Plus />} 
            position="bottom-right"
            label="Add"
          />
          
          <FloatingActionButton 
            icon={<Edit />} 
            variant="secondary"
            position="bottom-left"
            size="sm"
          />
          
          <FloatingActionButton 
            icon={<Upload />} 
            variant="success"
            position="top-right"
            extended
            label="Upload"
          />
          
          <FloatingActionButton 
            icon={<MoreHorizontal />} 
            variant="outline"
            position="top-left"
            elevation="high"
          />
        </section>
      </div>
    </div>
  )
}