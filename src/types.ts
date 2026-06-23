/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RepairService {
  IPHONE_SCREEN = "iPhone screen replacement",
  IPHONE_BATTERY = "iPhone battery replacement",
  IPHONE_BACK_GLASS = "iPhone back glass replacement",
  MACBOOK_SCREEN = "Macbook screen replacement",
  MACBOOK_MOTHERBOARD = "Macbook motherboard fix",
  MACBOOK_BATTERY = "Macbook battery replacement",
  ANDROID_DEVICES = "all android devices",
  LAPTOP_REPAIR = "all brand laptop repair",
  WINDOWS_LAPTOP = "windows laptop services",
}

export enum RepairIntent {
  BROKEN_SCREEN = "broken screen",
  DEAD_BATTERY = "dead battery",
  WATER_DAMAGE = "water damage",
  SLOW_PERFORMANCE = "slow performance",
  NOT_CHARGING = "not charging",
  OVERHEATING = "overheating",
}

export enum PostType {
  UPDATE = "What's New / Update",
  OFFER = "Special Offer",
  EVENT = "Event / Workshops",
  FESTIVAL = "Festival Poster",
}

export interface GBPPost {
  postType: PostType;
  imagePrompt: string;
  hook: string;
  body: string;
  benefits: string[];
  hashtags: string[];
  geoTags?: string[];
  cta: "Call Now" | "Book Online" | "Learn More";
  geoOptimization?: string;
  offerDetails?: {
    couponCode: string;
    discountValue: string;
    expiryDate: string;
  };
  eventDetails?: {
    title: string;
    dateRange: string;
    description: string;
  };
  festivalDetails?: {
    festivalName: string;
    festivalMessage: string;
  };
}

export interface GeneratorConfig {
  postType: PostType;
  services: RepairService[];
  intent?: RepairIntent | string;
  tone?: string;
  festivalName?: string;
}
