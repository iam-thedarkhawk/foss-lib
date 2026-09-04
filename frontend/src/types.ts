export type License =
  | "MIT"
  | "GPLV2"
  | "GPLV3"
  | "APACHE2"
  | "BSD"
  | "MPL2"
  | "AGPL"
  | "OTHER";

export type Platform =
  | "WINDOWS"
  | "MACOS"
  | "LINUX"
  | "WEB"
  | "ANDROID"
  | "IOS"
  | "SELF_HOSTED";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface FossAlternative {
  id: string;
  name: string;
  description: string;
  license: License;
  platforms: Platform[];
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
