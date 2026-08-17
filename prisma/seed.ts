import { PrismaClient } from "@prisma/client";
import { portfolio } from "../src/lib/portfolio";

const prisma = new PrismaClient();

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.portfolioKnowledge.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.education.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.userProfile.deleteMany();

  await prisma.userProfile.create({
    data: {
      name: portfolio.name,
      location: portfolio.location,
      headline: portfolio.headline,
      bio: portfolio.bio,
      eyebrow: portfolio.eyebrow,
      availability: portfolio.availability,
      currentlyBuilding: portfolio.currentlyBuilding,
      stackLabel: portfolio.stackLabel,
      heroVideoUrl: portfolio.heroVideoUrl,
    },
  });

  await prisma.experience.createMany({
    data: portfolio.experiences.map((job, index) => ({
      company: job.company,
      role: job.role,
      startDate: job.startDate,
      endDate: job.endDate,
      highlights: job.highlights,
      technologies: job.technologies,
      sortOrder: index,
    })),
  });

  await prisma.project.createMany({
    data: portfolio.projects.map((project, index) => ({
      title: project.title,
      slug: project.slug,
      tag: project.tag,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
      highlights: project.highlights,
      technologies: project.technologies,
      imageUrl: project.imageUrl,
      projectUrl: project.projectUrl,
      pipeline: project.pipeline,
      architecture: project.architecture,
      sortOrder: index,
    })),
  });

  await prisma.skill.createMany({
    data: portfolio.skills.map((skill, index) => ({
      name: skill.name,
      category: skill.category,
      related: skill.related,
      sortOrder: index,
    })),
  });

  await prisma.publication.createMany({
    data: portfolio.publications.map((publication) => ({
      title: publication.title,
      description: publication.description,
      url: publication.url,
    })),
  });

  await prisma.education.createMany({
    data: portfolio.education.map((item, index) => ({
      institution: item.institution,
      degree: item.degree,
      detail: item.detail,
      startDate: item.startDate,
      endDate: item.endDate,
      sortOrder: index,
    })),
  });

  await prisma.socialLink.createMany({
    data: portfolio.social.map((item, index) => ({
      platform: item.platform,
      label: item.label,
      url: item.url,
      sortOrder: index,
    })),
  });

  await prisma.portfolioKnowledge.createMany({
    data: portfolio.knowledge.map((item) => ({
      category: item.category,
      title: item.title,
      content: item.content,
      keywords: item.keywords,
      sourceType: item.sourceType,
      sourceId: item.sourceId,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
