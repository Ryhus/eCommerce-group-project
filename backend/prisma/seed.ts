import { PrismaPg } from "@prisma/adapter-pg";
import { DiscountType, PrismaClient, ProductAttributeType } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required for seeding");

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const categories = [
  { key: "balls", name: "Balls", slug: "balls" },
  { key: "shoes", name: "Footwear", slug: "shoes" },
  { key: "fitness", name: "Fitness", slug: "fitness" },
  { key: "accessories", name: "Accessories", slug: "accessories" },
  { key: "football", name: "Football", slug: "football", parentKey: "balls" },
  { key: "basketball", name: "Basketball", slug: "basketball", parentKey: "balls" },
  { key: "strength", name: "Strength", slug: "strength", parentKey: "fitness" },
  { key: "yoga", name: "Yoga", slug: "yoga", parentKey: "fitness" },
  { key: "hydration", name: "Hydration", slug: "hydration", parentKey: "accessories" },
  { key: "tennis", name: "Tennis", slug: "tennis", parentKey: "accessories" },
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
  {
    key: "training-dumbbell-set",
    slug: "training-dumbbell-set",
    name: "Training Dumbbell Set",
    description: "Versatile rubber-coated dumbbells for progressive strength sessions.",
    sku: "FIT-STRENGTH-001",
    priceAmount: 5999,
    compareAtPriceAmount: 6999,
    categoryKey: "strength",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "everyday-yoga-mat",
    slug: "everyday-yoga-mat",
    name: "Everyday Yoga Mat",
    description: "Supportive non-slip mat for yoga, mobility work, and floor training.",
    sku: "FIT-YOGA-001",
    priceAmount: 2999,
    categoryKey: "yoga",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "insulated-sports-bottle",
    slug: "insulated-sports-bottle",
    name: "Insulated Sports Bottle",
    description: "Reusable insulated bottle that keeps drinks ready throughout training.",
    sku: "ACC-HYDRATION-001",
    priceAmount: 2499,
    categoryKey: "hydration",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "control-tennis-racket",
    slug: "control-tennis-racket",
    name: "Control Tennis Racket",
    description: "Balanced racket for confident control during practice and match play.",
    sku: "ACC-TENNIS-001",
    priceAmount: 8999,
    compareAtPriceAmount: 10999,
    categoryKey: "tennis",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=900&q=80",
  },
  {
    key: "training-backpack",
    slug: "training-backpack",
    name: "Training Backpack",
    description: "Streamlined everyday backpack with room for essential training gear.",
    sku: "ACC-BAG-001",
    priceAmount: 4999,
    categoryKey: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
];

const attributeValues: Record<string, { color: string; size: string }> = {
  football: { color: "orange", size: "standard" },
  basketball: { color: "brown", size: "standard" },
  shoes: { color: "red", size: "large" },
  strength: { color: "black", size: "standard" },
  yoga: { color: "green", size: "standard" },
  hydration: { color: "blue", size: "standard" },
  tennis: { color: "yellow", size: "standard" },
  accessories: { color: "black", size: "medium" },
};

function productAttributes(categoryKey: string) {
  const values = attributeValues[categoryKey] ?? { color: "black", size: "standard" };
  return [
    { type: ProductAttributeType.COLOR, value: values.color },
    { type: ProductAttributeType.SIZE, value: values.size },
    { type: ProductAttributeType.EQUIPMENT_TYPE, value: categoryKey },
  ];
}

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
        attributes: { deleteMany: {}, create: productAttributes(product.categoryKey) },
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
        attributes: { create: productAttributes(product.categoryKey) },
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
