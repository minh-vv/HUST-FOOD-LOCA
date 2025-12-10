import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query('q') query: string) {
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        message: 'Search query is required',
        data: null,
      };
    }

    const results = await this.searchService.searchByKeyword(query.trim());
    return {
      success: true,
      message: 'Search results',
      data: results,
    };
  }
}
