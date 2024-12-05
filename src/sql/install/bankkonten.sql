delimiter //

create table if not exists `bankkonten` (
  `konto` varchar(255) not null,
  `kontonummer` varchar(10) default '',
  `bic` varchar(15) default null,
  `blz` varchar(15) default null,
  `waehrung` varchar(5) default '',
  `last_fints_query` datetime default null,
  `kostenstelle` int(11) default 0,
  primary key (`konto`)
) //


alter table `bankkonten` add column if not exists `name` varchar(50) default '' //

create or replace view view_readtable_bankkonten as
select
    concat(bankkonten.konto,' ',bankkonten.name) searchfld,
    concat(bankkonten.konto,' ',bankkonten.name) adressen_anzeige,
    konto kundennummer,
    bankkonten.*
from 
    bankkonten

//