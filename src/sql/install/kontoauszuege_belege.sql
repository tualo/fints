delimiter ;
CREATE TABLE `kontoauszuege_belege` (
  `id` int(11) NOT NULL DEFAULT 0,
  `belegnummer` bigint(20) NOT NULL DEFAULT 0,
  `tabellenzusatz` varchar(32) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`,`belegnummer`,`tabellenzusatz`)
);