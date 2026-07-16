import { Controller, Get, Param, ParseUUIDPipe, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { CatalogService } from "./catalog.service.js";
import { CategoryDto, ProductDto, ProductPageDto } from "./dto/catalog-response.dto.js";
import { ProductQueryDto } from "./dto/product-query.dto.js";

@Controller("catalog")
@ApiTags("catalog")
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get("categories")
  @ApiOkResponse({ type: CategoryDto, isArray: true })
  categories() {
    return this.catalog.categoryTree();
  }

  @Get("products")
  @ApiOkResponse({ type: ProductPageDto })
  products(@Query() query: ProductQueryDto) {
    return this.catalog.products(query);
  }

  @Get("products/:productId")
  @ApiOkResponse({ type: ProductDto })
  product(@Param("productId", new ParseUUIDPipe()) productId: string) {
    return this.catalog.product(productId);
  }
}
