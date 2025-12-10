CREATE TABLE `pois` (
	`id` text PRIMARY KEY NOT NULL,
	`city_id` text NOT NULL,
	`name_pl` text NOT NULL,
	`name_en` text,
	`name_de` text,
	`name_fr` text,
	`name_uk` text,
	`description_pl` text,
	`description_en` text,
	`description_de` text,
	`description_fr` text,
	`description_uk` text,
	`category` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`address` text,
	`image_url` text,
	`opening_hours` text,
	`website` text,
	`phone` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refresh_tokens_token_unique` ON `refresh_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `tour_pois` (
	`tour_id` text NOT NULL,
	`poi_id` text NOT NULL,
	`order` integer NOT NULL,
	PRIMARY KEY(`tour_id`, `poi_id`),
	FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`poi_id`) REFERENCES `pois`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tours` (
	`id` text PRIMARY KEY NOT NULL,
	`city_id` text NOT NULL,
	`name_pl` text NOT NULL,
	`name_en` text,
	`name_de` text,
	`name_fr` text,
	`name_uk` text,
	`description_pl` text NOT NULL,
	`description_en` text,
	`description_de` text,
	`description_fr` text,
	`description_uk` text,
	`category` text NOT NULL,
	`difficulty` text NOT NULL,
	`distance` integer DEFAULT 0 NOT NULL,
	`duration` integer DEFAULT 0 NOT NULL,
	`image_url` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT false NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);