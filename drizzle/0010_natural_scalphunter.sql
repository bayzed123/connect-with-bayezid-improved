ALTER TABLE `blogPosts` ADD `submissionStatus` enum('admin','pending','approved','rejected') DEFAULT 'admin' NOT NULL;--> statement-breakpoint
ALTER TABLE `blogPosts` ADD `submittedBy` varchar(255);