
import type { LucideIcon } from 'lucide-react';

export interface AgentInfo {
  name: string;
  icon: string | LucideIcon;
  lucideIcon?: LucideIcon;
  cardDescription: string;
  slug: string;
  themeColor: string;
  coverImageHint: string;
  functionality?: string[];
  demoButtonText?: string;
}
