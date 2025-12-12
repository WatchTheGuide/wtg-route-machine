CREATE INDEX `media_uploaded_by_idx` ON `media` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `media_context_type_idx` ON `media` (`context_type`);--> statement-breakpoint
CREATE INDEX `media_context_idx` ON `media` (`context_type`,`context_id`);--> statement-breakpoint
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);