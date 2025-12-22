-- AlterTable
ALTER TABLE `restaurant_menu` ADD COLUMN `menu_name` VARCHAR(200) NULL;

-- CreateTable
CREATE TABLE `menu_images` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `menu_id` INTEGER NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `display_order` INTEGER NULL DEFAULT 0,
    `is_primary` BOOLEAN NULL DEFAULT false,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_menu_id`(`menu_id`),
    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menu_images` ADD CONSTRAINT `fk_menu` FOREIGN KEY (`menu_id`) REFERENCES `restaurant_menu`(`menu_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
