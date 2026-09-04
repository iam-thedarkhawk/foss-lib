import { PrismaClient, License, Platform } from "@prisma/client";

const prisma = new PrismaClient();

type SeedAlternative = {
  name: string;
  description: string;
  license: License;
  platforms: Platform[];
  repoUrl: string;
  website?: string;
  fitNotes?: string;
};

type SeedApp = {
  name: string;
  description: string;
  website?: string;
  alternatives: SeedAlternative[];
};

type SeedCategory = {
  name: string;
  slug: string;
  apps: SeedApp[];
};

const CATEGORIES: SeedCategory[] = [
  {
    name: "Office & Productivity",
    slug: "office-productivity",
    apps: [
      {
        name: "Microsoft Office",
        description: "Word processing, spreadsheets, and presentations suite.",
        website: "https://www.microsoft.com/microsoft-365",
        alternatives: [
          {
            name: "LibreOffice",
            description: "Full-featured office suite: Writer, Calc, Impress, and more.",
            license: "MPL2",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://gitlab.com/libreoffice/core",
            website: "https://www.libreoffice.org",
            fitNotes: "Very close 1:1 match, reads/writes .docx/.xlsx/.pptx.",
          },
          {
            name: "OnlyOffice (Community Edition)",
            description: "Collaborative office suite with strong MS Office format fidelity.",
            license: "AGPL",
            platforms: ["WEB", "SELF_HOSTED", "WINDOWS", "LINUX"],
            repoUrl: "https://github.com/ONLYOFFICE/DocumentServer",
            website: "https://www.onlyoffice.com",
            fitNotes: "Better for real-time collaborative editing than LibreOffice.",
          },
        ],
      },
      {
        name: "Notion",
        description: "All-in-one workspace for notes, docs, and databases.",
        website: "https://www.notion.so",
        alternatives: [
          {
            name: "AppFlowy",
            description: "Open-source workspace app aiming to replicate Notion's core features.",
            license: "AGPL",
            platforms: ["WINDOWS", "MACOS", "LINUX", "WEB"],
            repoUrl: "https://github.com/AppFlowy-IO/AppFlowy",
            website: "https://appflowy.io",
            fitNotes: "Still catching up on database views and API surface.",
          },
        ],
      },
    ],
  },
  {
    name: "Design & Creativity",
    slug: "design-creativity",
    apps: [
      {
        name: "Adobe Photoshop",
        description: "Industry-standard raster image editing.",
        website: "https://www.adobe.com/products/photoshop.html",
        alternatives: [
          {
            name: "GIMP",
            description: "GNU Image Manipulation Program — raster editing and retouching.",
            license: "GPLV3",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://gitlab.gnome.org/GNOME/gimp",
            website: "https://www.gimp.org",
            fitNotes: "Steeper learning curve; missing some non-destructive AI features.",
          },
        ],
      },
      {
        name: "Adobe Illustrator",
        description: "Vector graphics editor for logos, illustrations, and print design.",
        website: "https://www.adobe.com/products/illustrator.html",
        alternatives: [
          {
            name: "Inkscape",
            description: "Vector graphics editor supporting SVG natively.",
            license: "GPLV3",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://gitlab.com/inkscape/inkscape",
            website: "https://inkscape.org",
          },
        ],
      },
      {
        name: "Figma",
        description: "Collaborative interface design and prototyping tool.",
        website: "https://www.figma.com",
        alternatives: [
          {
            name: "Penpot",
            description: "Open-source design and prototyping platform, browser-based.",
            license: "MPL2",
            platforms: ["WEB", "SELF_HOSTED"],
            repoUrl: "https://github.com/penpot/penpot",
            website: "https://penpot.app",
            fitNotes: "Strong Figma-like UI; smaller plugin ecosystem.",
          },
        ],
      },
    ],
  },
  {
    name: "Communication",
    slug: "communication",
    apps: [
      {
        name: "Slack",
        description: "Team messaging and channel-based communication.",
        website: "https://slack.com",
        alternatives: [
          {
            name: "Mattermost",
            description: "Self-hostable team messaging platform built for developers.",
            license: "APACHE2",
            platforms: ["SELF_HOSTED", "WEB", "WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://github.com/mattermost/mattermost",
            website: "https://mattermost.com",
          },
          {
            name: "Rocket.Chat",
            description: "Self-hostable chat platform with channels, video calls, and apps.",
            license: "MIT",
            platforms: ["SELF_HOSTED", "WEB"],
            repoUrl: "https://github.com/RocketChat/Rocket.Chat",
            website: "https://www.rocket.chat",
          },
        ],
      },
      {
        name: "Zoom",
        description: "Video conferencing and webinars.",
        website: "https://zoom.us",
        alternatives: [
          {
            name: "Jitsi Meet",
            description: "Free, encrypted video conferencing that runs in the browser.",
            license: "APACHE2",
            platforms: ["WEB", "SELF_HOSTED", "ANDROID", "IOS"],
            repoUrl: "https://github.com/jitsi/jitsi-meet",
            website: "https://meet.jit.si",
            fitNotes: "No account needed for quick meetings; self-host for full control.",
          },
        ],
      },
    ],
  },
  {
    name: "Developer Tools",
    slug: "developer-tools",
    apps: [
      {
        name: "Postman",
        description: "API client for building, testing, and documenting APIs.",
        website: "https://www.postman.com",
        alternatives: [
          {
            name: "Insomnia",
            description: "REST/GraphQL/gRPC client with a clean, fast UI.",
            license: "MIT",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://github.com/Kong/insomnia",
            website: "https://insomnia.rest",
          },
          {
            name: "Bruno",
            description: "Offline-first API client that stores collections as plain text files in git.",
            license: "MIT",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://github.com/usebruno/bruno",
            website: "https://www.usebruno.com",
            fitNotes: "Great fit if you want API collections to live in version control.",
          },
        ],
      },
    ],
  },
  {
    name: "Media & Editing",
    slug: "media-editing",
    apps: [
      {
        name: "Adobe Premiere Pro",
        description: "Professional non-linear video editing.",
        website: "https://www.adobe.com/products/premiere.html",
        alternatives: [
          {
            name: "Kdenlive",
            description: "Non-linear video editor built on the MLT framework.",
            license: "GPLV2",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://invent.kde.org/multimedia/kdenlive",
            website: "https://kdenlive.org",
            fitNotes: "Solid for most editing workflows; fewer motion-graphics presets.",
          },
        ],
      },
      {
        name: "Adobe Lightroom",
        description: "Photo cataloguing and non-destructive raw editing.",
        website: "https://www.adobe.com/products/photoshop-lightroom.html",
        alternatives: [
          {
            name: "darktable",
            description: "Virtual lighttable and darkroom for photographers, RAW workflow.",
            license: "GPLV3",
            platforms: ["WINDOWS", "MACOS", "LINUX"],
            repoUrl: "https://github.com/darktable-org/darktable",
            website: "https://www.darktable.org",
          },
        ],
      },
    ],
  },
  {
    name: "Cloud & Storage",
    slug: "cloud-storage",
    apps: [
      {
        name: "Dropbox",
        description: "Cloud file storage and sync.",
        website: "https://www.dropbox.com",
        alternatives: [
          {
            name: "Nextcloud",
            description: "Self-hosted file sync, share, and collaboration platform.",
            license: "AGPL",
            platforms: ["SELF_HOSTED", "WEB", "ANDROID", "IOS"],
            repoUrl: "https://github.com/nextcloud/server",
            website: "https://nextcloud.com",
            fitNotes: "Also covers calendar, contacts, and office docs via apps.",
          },
        ],
      },
      {
        name: "Evernote",
        description: "Note-taking with tagging, notebooks, and web clipping.",
        website: "https://evernote.com",
        alternatives: [
          {
            name: "Joplin",
            description: "Note-taking and to-do app with sync and end-to-end encryption.",
            license: "MIT",
            platforms: ["WINDOWS", "MACOS", "LINUX", "ANDROID", "IOS"],
            repoUrl: "https://github.com/laurent22/joplin",
            website: "https://joplinapp.org",
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const cat of CATEGORIES) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });

    for (const app of cat.apps) {
      // No unique constraint on (name, category), so find-or-create manually.
      const existingApp = await prisma.proprietaryApp.findFirst({
        where: { name: app.name, categoryId: category.id },
      });

      const proprietaryApp = existingApp
        ? await prisma.proprietaryApp.update({
            where: { id: existingApp.id },
            data: { description: app.description, website: app.website },
          })
        : await prisma.proprietaryApp.create({
            data: {
              name: app.name,
              description: app.description,
              website: app.website,
              categoryId: category.id,
            },
          });

      for (const alt of app.alternatives) {
        const existing = await prisma.fossAlternative.findFirst({
          where: { name: alt.name },
        });

        const alternative = existing
          ? await prisma.fossAlternative.update({
              where: { id: existing.id },
              data: {
                description: alt.description,
                license: alt.license,
                platforms: alt.platforms,
                repoUrl: alt.repoUrl,
                website: alt.website,
              },
            })
          : await prisma.fossAlternative.create({
              data: {
                name: alt.name,
                description: alt.description,
                license: alt.license,
                platforms: alt.platforms,
                repoUrl: alt.repoUrl,
                website: alt.website,
              },
            });

        await prisma.appAlternative.upsert({
          where: {
            appId_alternativeId: {
              appId: proprietaryApp.id,
              alternativeId: alternative.id,
            },
          },
          update: { fitNotes: alt.fitNotes },
          create: {
            appId: proprietaryApp.id,
            alternativeId: alternative.id,
            fitNotes: alt.fitNotes,
          },
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
