import { Controller, Get, Query } from "@nestjs/common";
import { FilterService } from "./filter.service";

@Controller("api/menus")
export class FilterController {
  constructor(private readonly FilterService: FilterService) {}

  /**
   * GET /api/menus/filter
   * ?flavorIds=1,2
   * ?ingredientIds=3,5
   */
  @Get("filter")
  filterMenus(
    @Query("flavorIds") flavorIds?: string,
    @Query("ingredientIds") ingredientIds?: string,
  ) {
    return this.FilterService.filterMenus({
      flavorIds,
      ingredientIds,
    });
  }
}
