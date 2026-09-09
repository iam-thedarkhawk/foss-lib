export type License =
  | "MIT"
  | "GPL-2.0"
  | "GPL-3.0"
  | "GPL-3.0-or-later"
  | "Apache-2.0"
  | "BSD"
  | "BSD-3-Clause"
  | "MPL-2.0"
  | "AGPL-3.0"
  | "AGPL-3.0-only"
  | "OTHER"
  | string;

export type Platform =
  | "WINDOWS"
  | "MACOS"
  | "LINUX"
  | "WEB"
  | "ANDROID"
  | "IOS"
  | "SELF_HOSTED"
  | string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  _count?: {
    apps: number;
  };
}

export interface FossAlternative {
  id: string;
  name: string;
  description: string;
  license: License;
  platforms: string[];
  repoUrl: string;
  website?: string | null;
  stars?: number | null;
}

export interface AppAlternativeLink {
  id: string;
  fitNotes?: string | null;
  alternative: FossAlternative;
}

export interface ProprietaryApp {
  id: string;
  name: string;
  description: string;
  website?: string | null;
  category: Category;
  alternatives: AppAlternativeLink[];
}

export interface AlternativeDetail extends FossAlternative {
  apps: Array<{
    id: string;
    fitNotes?: string | null;
    app: Pick<ProprietaryApp, "id" | "name" | "description" | "category">;
  }>;
}

export interface AlternativeListItem extends FossAlternative {
  apps: AlternativeDetail["apps"];
}

export interface Submission {
  id: string;
  proprietaryName: string;
  alternativeName: string;
  alternativeRepoUrl: string;
  alternativeWebsite?: string | null;
  categoryGuess?: string | null;
  description: string;
  submitterEmail?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  createdAt: string;
}
