CREATE TABLE `visitorAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(255) NOT NULL,
	`page` varchar(255) NOT NULL,
	`timeSpent` int NOT NULL,
	`scrollDepth` int NOT NULL DEFAULT 0,
	`referrer` text,
	`userAgent` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `visitorAnalytics_id` PRIMARY KEY(`id`)
);
