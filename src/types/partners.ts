export type PartnerStatus = "active" | "pending" | "paused" | "archived";
export type PartnerVisibility = "published" | "draft" | "hidden";
export type PartnerRelationship =
  | "approved-affiliate"
  | "affiliate-reference"
  | "strategic-partner"
  | "community-partner";

export interface PartnerRecord {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  relationship: PartnerRelationship;
  status: PartnerStatus;
  visibility: PartnerVisibility;
  websiteUrl: string;
  offerUrl: string;
  offerLabel: string;
  offerDetail: string;
  discountCode: string;
  termsUrl: string;
  adminUrl?: string;
  logoUrl: string;
  accent: string;
  featured: boolean;
  verifiedAt: string;
  sourceNote: string;
  sortOrder: number;
}

export type PublicPartnerRecord = Omit<PartnerRecord, "adminUrl" | "sourceNote">;
