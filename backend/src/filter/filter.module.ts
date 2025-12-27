import { Module } from "@nestjs/common";
import { FilterController } from "./filter.controller";
import { FilterService } from "./filter.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FilterController],
  providers: [FilterService],
})
export class FilterModule {}