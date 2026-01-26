"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageCircle, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

const communities = [
  {
    id: 1,
    name: "Gulshan Property Owners",
    location: "Gulshan, Dhaka",
    members: 1250,
    posts: 89,
    image: "/placeholder.svg?height=100&width=100",
    description: "Connect with property owners and investors in Gulshan.",
  },
  {
    id: 2,
    name: "Student Housing Dhaka",
    location: "University Area, Dhaka",
    members: 2100,
    posts: 156,
    image: "/placeholder.svg?height=100&width=100",
    description: "Find and share student accommodation options.",
  },
  {
    id: 3,
    name: "Land Investors BD",
    location: "Nationwide",
    members: 850,
    posts: 67,
    image: "/placeholder.svg?height=100&width=100",
    description: "Discuss land investment with experienced investors.",
  },
  {
    id: 4,
    name: "Dhaka Professionals Network",
    location: "Dhaka",
    members: 1800,
    posts: 234,
    image: "/placeholder.svg?height=100&width=100",
    description: "Share apartment hunting tips and insights.",
  },
]



export default function CommunitiesPreview() {

  const router = useRouter()

  const handleJoinCommunity = (communityId: number) => {
    router.push(`/communities/${communityId}`)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join Our Communities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with like-minded property enthusiasts, share experiences, and get local insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {communities.map((community) => (
            <Card
              key={community.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            >
                <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Image
                            src={community.image || "/placeholder.svg"}
                            alt={community.name}
                            width={60}
                            height={60}
                            className="rounded-full border-2 border-primary/20"
                        />
                        <div>
                            <h3 className="font-semibold text-lg">{community.name}</h3>
                            <div className="flex items-center text-muted-foreground text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                {community.location}
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{community.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {community.members.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {community.posts}
                        </div>
                    </div>
                    <Button onClick={() => handleJoinCommunity(community.id)} className="w-full" variant="outline" asChild>
                        <Link href={`/communities/${community.id}`} className="flex items-center">Join Community <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild>
            <Link href="/communities">Explore All Communities</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}