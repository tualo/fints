delimiter ;


CREATE TABLE IF NOT EXISTS `kontoauszug_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `aktiv` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`id`)
) ;