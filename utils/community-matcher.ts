interface UserProfile {
  location: string
  userType: "student" | "businessman" | "job_holder" | "investor" | "other"
  interests: string[]
  budget: { min: number; max: number }
  propertyTypes: string[]
}

interface Community {
  id: number
  name: string
  location: string
  category: string
  tags: string[]
  targetAudience: string[]
  priceRange?: { min: number; max: number }
  propertyTypes?: string[]
  relevanceScore?: number
}

export function getRelevantCommunities(communities: Community[], userProfile: UserProfile | null): Community[] {
  if (!userProfile) return communities

  return communities
    .map((community) => {
      let relevanceScore = 0

      // Location matching (highest priority)
      if (community.location.includes(userProfile.location) || community.location === "Nationwide") {
        relevanceScore += 40
      }

      // User type matching
      if (community.targetAudience.includes(userProfile.userType)) {
        relevanceScore += 30
      }

      // Interest matching
      const matchingInterests = community.tags.filter((tag) =>
        userProfile.interests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase())),
      )
      relevanceScore += matchingInterests.length * 10

      // Property type matching
      if (community.propertyTypes) {
        const matchingTypes = community.propertyTypes.filter((type) => userProfile.propertyTypes.includes(type))
        relevanceScore += matchingTypes.length * 5
      }

      // Budget compatibility
      if (community.priceRange) {
        const budgetOverlap =
          Math.min(userProfile.budget.max, community.priceRange.max) -
          Math.max(userProfile.budget.min, community.priceRange.min)
        if (budgetOverlap > 0) {
          relevanceScore += 15
        }
      }

      return { ...community, relevanceScore }
    })
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
}

export function getCommunityRecommendationReason(community: Community, userProfile: UserProfile | null): string {
  if (!userProfile || !community.relevanceScore) return ""

  const reasons = []

  if (community.location.includes(userProfile.location)) {
    reasons.push(`Located in ${userProfile.location}`)
  }

  if (community.targetAudience.includes(userProfile.userType)) {
    const userTypeLabels = {
      student: "students",
      businessman: "business owners",
      job_holder: "professionals",
      investor: "investors",
      other: "property enthusiasts",
    }
    reasons.push(`Perfect for ${userTypeLabels[userProfile.userType]}`)
  }

  const matchingInterests = community.tags.filter((tag) =>
    userProfile.interests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase())),
  )
  if (matchingInterests.length > 0) {
    reasons.push(`Matches your interests: ${matchingInterests.join(", ")}`)
  }

  return reasons.slice(0, 2).join(" • ")
}
