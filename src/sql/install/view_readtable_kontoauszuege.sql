delimiter ;

create or replace view  view_readtable_kontoauszuege as
select 
	kontoauszuege.*,
    
    ifnull( kontoauszuege_belege_rechnung.brutto, 0) rechnung_brutto,
    kontoauszuege_belege_rechnung.belegnummern rechnung_belegnummern,
    ifnull( kontoauszuege_belege_krechnung.brutto, 0) krechnung_brutto,
    kontoauszuege_belege_krechnung.belegnummern krechnung_belegnummern,
    
    kontoauszuege.betrag - 
    ifnull( kontoauszuege_belege_rechnung.brutto, 0) + 
    ifnull( kontoauszuege_belege_krechnung.brutto, 0)  + 
    ifnull( kontoauszuege_belege_kazautomat.brutto, 0) 
    restwert
    
from 
(select * from kontoauszuege where valuta>='2019-01-01') kontoauszuege
left join (
  select 
  	group_concat(view_blg_list_rechnung.belegnummer separator ', ' ) belegnummern,
  	sum(view_blg_list_rechnung.brutto) brutto,
  	kontoauszuege_belege.id kontoauszuege_belege_id
  from 
    view_blg_list_rechnung
    join kontoauszuege_belege on (view_blg_list_rechnung.id,view_blg_list_rechnung.tabellenzusatz) = (kontoauszuege_belege.belegnummer,kontoauszuege_belege.tabellenzusatz)
  group by kontoauszuege_belege.id
) kontoauszuege_belege_rechnung on kontoauszuege_belege_rechnung.kontoauszuege_belege_id = kontoauszuege.id
left join (
  select 
  	group_concat(view_blg_list_krechnung.belegnummer separator ', ' ) belegnummern,
  	sum(view_blg_list_krechnung.brutto) brutto,
  	kontoauszuege_belege.id kontoauszuege_belege_id
  from 
    view_blg_list_krechnung
    join kontoauszuege_belege on (view_blg_list_krechnung.id,view_blg_list_krechnung.tabellenzusatz) = (kontoauszuege_belege.belegnummer,kontoauszuege_belege.tabellenzusatz)
  group by kontoauszuege_belege.id
) kontoauszuege_belege_krechnung on kontoauszuege_belege_krechnung.kontoauszuege_belege_id = kontoauszuege.id
left join (
  select 
  	group_concat(view_blg_list_kazautomat.belegnummer separator ', ' ) belegnummern,
  	sum(view_blg_list_kazautomat.brutto) brutto,
  	kontoauszuege_belege.id kontoauszuege_belege_id
  from 
    view_blg_list_kazautomat
    join kontoauszuege_belege on (view_blg_list_kazautomat.id,view_blg_list_kazautomat.tabellenzusatz) = (kontoauszuege_belege.belegnummer,kontoauszuege_belege.tabellenzusatz)
  group by kontoauszuege_belege.id
) kontoauszuege_belege_kazautomat on kontoauszuege_belege_kazautomat.kontoauszuege_belege_id = kontoauszuege.id

having restwert<>0;
