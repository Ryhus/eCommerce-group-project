CREATE TYPE "ProductAttributeType" AS ENUM ('COLOR', 'SIZE', 'EQUIPMENT_TYPE');

CREATE TABLE "ProductAttribute" (
  "id" UUID NOT NULL,
  "productId" UUID NOT NULL,
  "type" "ProductAttributeType" NOT NULL,
  "value" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductAttribute_productId_type_value_key"
  ON "ProductAttribute"("productId", "type", "value");
CREATE INDEX "ProductAttribute_type_value_idx" ON "ProductAttribute"("type", "value");
CREATE INDEX "ProductAttribute_productId_idx" ON "ProductAttribute"("productId");

ALTER TABLE "ProductAttribute"
  ADD CONSTRAINT "ProductAttribute_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
