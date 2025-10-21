"use client"

import { HeroSection } from "@/components/hero-section"
import { MissionSection } from "@/components/mission-section"
import { AwarenessSection } from "@/components/awareness-section"
import { CampaignSection } from "@/components/campaign-section"
import { CommunitySection } from "@/components/community-section"
import { ImpactSection } from "@/components/impact-section"

export default function Home() {

  return (
    <>
        <HeroSection />
        <MissionSection />
        <AwarenessSection />
        <CampaignSection />
        <CommunitySection />
        <ImpactSection />
    </>
  )
}
