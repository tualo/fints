delimiter ;

CREATE TABLE `fints_accounts` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `port` int(11) DEFAULT 443,
  `code` char(8) NOT NULL,
  `banking_username` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
);