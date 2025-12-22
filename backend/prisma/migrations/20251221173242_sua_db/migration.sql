/*
  Warnings:

  - You are about to alter the column `created_at` on the `dish_images` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- AlterTable
ALTER TABLE `dish_images` MODIFY `display_order` INTEGER NULL DEFAULT 0,
    MODIFY `is_primary` BOOLEAN NULL DEFAULT false,
    MODIFY `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `dishes` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `dish_ingredients` (
    `dish_ingredient_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dish_id` INTEGER NOT NULL,
    `ingredient_id` INTEGER NOT NULL,
    `is_main` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `dish_ingredients_dish_id_idx`(`dish_id`),
    INDEX `dish_ingredients_ingredient_id_idx`(`ingredient_id`),
    UNIQUE INDEX `dish_ingredients_dish_id_ingredient_id_key`(`dish_id`, `ingredient_id`),
    PRIMARY KEY (`dish_ingredient_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dish_flavors` (
    `dish_flavor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `dish_id` INTEGER NOT NULL,
    `flavor_id` INTEGER NOT NULL,
    `intensity` INTEGER NOT NULL DEFAULT 3,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `dish_flavors_dish_id_idx`(`dish_id`),
    INDEX `dish_flavors_flavor_id_idx`(`flavor_id`),
    UNIQUE INDEX `dish_flavors_dish_id_flavor_id_key`(`dish_id`, `flavor_id`),
    PRIMARY KEY (`dish_flavor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dish_ingredients` ADD CONSTRAINT `dish_ingredients_ingredient_id_fkey` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`ingredient_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dish_ingredients` ADD CONSTRAINT `dish_ingredients_dish_id_fkey` FOREIGN KEY (`dish_id`) REFERENCES `dishes`(`dish_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dish_flavors` ADD CONSTRAINT `dish_flavors_flavor_id_fkey` FOREIGN KEY (`flavor_id`) REFERENCES `flavors`(`flavor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dish_flavors` ADD CONSTRAINT `dish_flavors_dish_id_fkey` FOREIGN KEY (`dish_id`) REFERENCES `dishes`(`dish_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `dish_images` RENAME INDEX `dish_images_dish_id_idx` TO `idx_dish_id`;
