"use client"

import CommunityDetailsClient from "@/components/communities/community-details-client"
import { communitiesService } from "@/lib/api/communities";
import { communities } from "@/lib/dummy-data";
import { Community } from "@/types";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";



export default async function CommunityPage() {

  const params = useParams()
  console.log("params", params)
  const id = params?.id
  const [community, setCommunity] = useState<Community>()

  const fetchCommunity = async () => {
    if (!id) return
    const response = await communitiesService.getCommunityById(id)
    
    console.log("response", response)
    setCommunity(response.data)
  }
  useEffect(() => {
    if (!id) return
  
    fetchCommunity()
  }, [id])

  if (!community) return null
  // return (
  //   <div>
  //     communities
  //   </div>
  // )
  return <CommunityDetailsClient community={community} />
}
