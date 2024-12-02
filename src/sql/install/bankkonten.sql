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




create or replace view view_readtable_buchungskonten as
select
    concat(buchungskonten.konto,' ',buchungskonten.notiz) searchfld,
    concat(buchungskonten.konto,' ',buchungskonten.notiz) adressen_anzeige,
    konto kundennummer,
    buchungskonten.*
from 
    buchungskonten

//