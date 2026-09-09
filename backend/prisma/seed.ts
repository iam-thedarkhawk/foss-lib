import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface SeedAlternative {
  name: string;
  description: string;
  website?: string;
  repoUrl: string;
  license: string;
  platforms: string[];
  fitNotes?: string;
}

interface SeedApp {
  name: string;
  description: string;
  website?: string;
  alternatives: SeedAlternative[];
}

interface SeedCategory {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  apps: SeedApp[];
}

async function main() {
  const jsonPath = path.join(__dirname, "seedData.json");
  const rawData = fs.readFileSync(jsonPath, "utf-8");
  const categories: SeedCategory[] = JSON.parse(rawData);

  console.log(`Seeding ${categories.length} categories...`);

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon || null,
        description: cat.description || null,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon || null,
        description: cat.description || null,
      },
    });

    for (const app of cat.apps) {
      let proprietaryApp = await prisma.proprietaryApp.findFirst({
        where: { name: app.name, categoryId: category.id },
      });

      if (!proprietaryApp) {
        proprietaryApp = await prisma.proprietaryApp.create({
          data: {
            name: app.name,
            description: app.description,
            website: app.website || null,
            categoryId: category.id,
          },
        });
      } else {
        proprietaryApp = await prisma.proprietaryApp.update({
          where: { id: proprietaryApp.id },
          data: {
            description: app.description,
            website: app.website || null,
          },
        });
      }

      for (const alt of app.alternatives) {
        const platString = Array.isArray(alt.platforms)
          ? alt.platforms.join(",")
          : alt.platforms || "LINUX,WINDOWS,MACOS";

        let alternative = await prisma.fossAlternative.findFirst({
          where: { name: alt.name },
        });

        if (!alternative) {
          alternative = await prisma.fossAlternative.create({
            data: {
              name: alt.name,
              description: alt.description,
              license: alt.license,
              platforms: platString,
              repoUrl: alt.repoUrl,
              website: alt.website || null,
              stars: Math.floor(Math.random() * 8000) + 1200,
            },
          });
        } else {
          alternative = await prisma.fossAlternative.update({
            where: { id: alternative.id },
            data: {
              description: alt.description,
              license: alt.license,
              platforms: platString,
              repoUrl: alt.repoUrl,
              website: alt.website || null,
            },
          });
        }

        await prisma.appAlternative.upsert({
          where: {
            appId_alternativeId: {
              appId: proprietaryApp.id,
              alternativeId: alternative.id,
            },
          },
          update: { fitNotes: alt.fitNotes || null },
          create: {
            appId: proprietaryApp.id,
            alternativeId: alternative.id,
            fitNotes: alt.fitNotes || null,
          },
        });
      }
    }
  }

  // Seed sample submissions
  const existingSubmissions = await prisma.submission.count();
  if (existingSubmissions === 0) {
    await prisma.submission.createMany({
      data: [
        {
          proprietaryName: "Trello",
          alternativeName: "Wekan",
          alternativeRepoUrl: "https://github.com/wekan/wekan",
          categoryGuess: "Productivity",
          description: "Open-source kanban board built with Meteor. Great self-hosted alternative with full card management and webhooks.",
          submitterEmail: "community@fosslib.org",
          status: "PENDING",
        },
        {
          proprietaryName: "Airtable",
          alternativeName: "NocoDB",
          alternativeRepoUrl: "https://github.com/nocodb/nocodb",
          categoryGuess: "Productivity",
          description: "Smart spreadsheet that turns any database into an Airtable-like relational database with spreadsheet interface.",
          submitterEmail: "dev@fosslib.org",
          status: "PENDING",
        },
        {
          proprietaryName: "1Password",
          alternativeName: "KeePassXC",
          alternativeRepoUrl: "https://github.com/keepassxreboot/keepassxc",
          categoryGuess: "Security & Privacy",
          description: "Community-driven port of KeePass for desktop. Secure, local, cross-platform password manager.",
          submitterEmail: "security@fosslib.org",
          status: "APPROVED",
        },
      ],
    });
  }

  console.log("Database seeded successfully with all categories, apps, and alternatives!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
