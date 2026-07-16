import { PrismaPg } from "@prisma/adapter-pg";
import { DiscountType, PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const categories = [
  { key: "balls", name: "Balls", slug: "balls" },
  { key: "shoes", name: "Shoes", slug: "shoes" },
  { key: "football", name: "Football", slug: "football", parentKey: "balls" },
  { key: "basketball", name: "Basketball", slug: "basketball", parentKey: "balls" },
];

const products = [
  {
    key: "match-football",
    slug: "match-football",
    name: "Match Football",
    description: "Durable match ball for training and competitive games.",
    sku: "BALL-FOOTBALL-001",
    priceAmount: 3499,
    compareAtPriceAmount: 4499,
    categoryKey: "football",
    image: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "indoor-basketball",
    slug: "indoor-basketball",
    name: "Indoor Basketball",
    description: "Composite leather basketball with reliable indoor grip.",
    sku: "BALL-BASKET-001",
    priceAmount: 2999,
    categoryKey: "basketball",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "running-shoes",
    slug: "running-shoes",
    name: "Everyday Running Shoes",
    description: "Lightweight neutral running shoes for everyday road sessions.",
    sku: "SHOES-RUN-001",
    priceAmount: 7999,
    compareAtPriceAmount: 9999,
    categoryKey: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
];

async function main() {
  const categoryIds = new Map<string, string>();

  for (const category of categories.filter((item) => !item.parentKey)) {
    const saved = await prisma.category.upsert({
      where: { key: category.key },
      update: { name: category.name, slug: category.slug, parentId: null },
      create: { key: category.key, name: category.name, slug: category.slug },
    });
    categoryIds.set(category.key, saved.id);
  }

  for (const category of categories.filter((item) => item.parentKey)) {
    const parentId = categoryIds.get(category.parentKey!);
    if (!parentId) throw new Error(`Missing parent category ${category.parentKey}`);
    const saved = await prisma.category.upsert({
      where: { key: category.key },
      update: { name: category.name, slug: category.slug, parentId },
      create: { key: category.key, name: category.name, slug: category.slug, parentId },
    });
    categoryIds.set(category.key, saved.id);
  }

  for (const product of products) {
    const categoryId = categoryIds.get(product.categoryKey);
    if (!categoryId) throw new Error(`Missing product category ${product.categoryKey}`);
    await prisma.product.upsert({
      where: { key: product.key },
      update: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        isActive: true,
        variant: {
          upsert: {
            update: {
              sku: product.sku,
              priceAmount: product.priceAmount,
              compareAtPriceAmount: product.compareAtPriceAmount ?? null,
            },
            create: {
              sku: product.sku,
              priceAmount: product.priceAmount,
              compareAtPriceAmount: product.compareAtPriceAmount ?? null,
            },
          },
        },
        images: { deleteMany: {}, create: [{ url: product.image, alt: product.name, sortOrder: 0 }] },
        categories: { deleteMany: {}, create: [{ categoryId }] },
      },
      create: {
        key: product.key,
        slug: product.slug,
        name: product.name,
        description: product.description,
        variant: {
          create: {
            sku: product.sku,
            priceAmount: product.priceAmount,
            compareAtPriceAmount: product.compareAtPriceAmount ?? null,
          },
        },
        images: { create: [{ url: product.image, alt: product.name, sortOrder: 0 }] },
        categories: { create: [{ categoryId }] },
      },
    });
  }

  await prisma.discountCode.upsert({
    where: { code: "WELCOME10" },
    update: {
      description: "10% off your cart",
      type: DiscountType.PERCENTAGE,
      percentageBasisPoints: 1000,
      fixedAmount: null,
      isPublic: true,
      isActive: true,
    },
    create: {
      code: "WELCOME10",
      description: "10% off your cart",
      type: DiscountType.PERCENTAGE,
      percentageBasisPoints: 1000,
      isPublic: true,
      isActive: true,
    },
  });

  await prisma.discountCode.upsert({
    where: { code: "SPORT5" },
    update: {
      description: "€5 off orders over €30",
      type: DiscountType.FIXED_AMOUNT,
      fixedAmount: 500,
      percentageBasisPoints: null,
      minimumSubtotal: 3000,
      isPublic: true,
      isActive: true,
    },
    create: {
      code: "SPORT5",
      description: "€5 off orders over €30",
      type: DiscountType.FIXED_AMOUNT,
      fixedAmount: 500,
      minimumSubtotal: 3000,
      isPublic: true,
      isActive: true,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
