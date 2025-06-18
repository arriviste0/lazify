
import type { LucideIcon } from 'lucide-react';

// Existing AgentInfo for coverflow slider (if still used elsewhere or for reference)
export interface AgentInfo {
  name: string;
  icon: string | LucideIcon; // Can be emoji string or LucideIcon component
  lucideIcon?: LucideIcon; // Explicit LucideIcon
  cardDescription: string;
  slug: string;
  themeColor: string; // e.g., 'blue-500', 'rose-500' for tailwind bg utility
  coverImageHint: string;
  functionality?: string[];
  demoButtonText?: string;
}

// New type for the interactive agent demos
export type DemoType =
  | 'inboxZero'
  | 'leadSpark'
  | 'contentCraft'
  | 'scheduleSync'
  | 'taskMaster'
  | 'financeTracker'
  | 'shopSmart';

export interface InteractiveAgentInfo {
  id: string;
  name: string;
  iconEmoji: string; // Using emoji for the new carousel cards
  description: string;
  demoType: DemoType;
  themeColorClass: string; // e.g., 'bg-blue-500', used for accents
  longDescription?: string;
  features?: string[];
  slideImageUrl?: string; // Image for the card background
  slideImageHint?: string; // AI hint for the card background image
}

