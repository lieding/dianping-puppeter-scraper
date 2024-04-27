CREATE TABLE `restaurants` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`img` text,
	`addr` text,
	`tag` text,
	`avg_price` text,
	`recommends` text,
	`commentCnt` integer
);
