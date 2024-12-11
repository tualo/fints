delimiter ;

CREATE TABLE IF NOT EXISTS `fints_accounts` (
  `id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `port` int(11) DEFAULT 443,
  `code` char(8) NOT NULL,
  `banking_username` varchar(30) NOT NULL,
  `name` varchar(100) default '',
  PRIMARY KEY (`id`)
);

alter table `fints_accounts` add column if not exists   `name` varchar(100) default '';
alter table `fints_accounts` add column if not exists   `inhabername` varchar(100) default '';
alter table `fints_accounts` add column if not exists   `iban` varchar(100) default '';
