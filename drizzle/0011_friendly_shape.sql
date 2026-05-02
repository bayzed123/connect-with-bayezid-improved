ALTER TABLE `orders` ADD `transactionId` varchar(255);--> statement-breakpoint
ALTER TABLE `orders` ADD `paymentProofUrl` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `invoiceStatus` enum('pending','successful','failed') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `invoiceNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_invoiceNumber_unique` UNIQUE(`invoiceNumber`);