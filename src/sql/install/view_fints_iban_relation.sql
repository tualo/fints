create or replace view view_fints_iban_relation as
select 

distinct 
regexp_replace(upper(kontoauszuege.kontonummer),'[^0-9A-Z]','') konto, blg_adressen_rechnung.kundennummer,blg_adressen_rechnung.kostenstelle

from 

kontoauszuege_belege join blg_adressen_rechnung on (kontoauszuege_belege.belegnummer,kontoauszuege_belege.tabellenzusatz) = (blg_adressen_rechnung.id,'rechnung')
join kontoauszuege on kontoauszuege_belege.id = kontoauszuege.id
union all

select 

distinct 
regexp_replace(upper(kontoauszuege.kontonummer),'[^0-9A-Z]',''), blg_uebersetzer_krechnung.kundennummer,blg_uebersetzer_krechnung.kostenstelle

from 

kontoauszuege_belege join blg_uebersetzer_krechnung on (kontoauszuege_belege.belegnummer,kontoauszuege_belege.tabellenzusatz) = (blg_uebersetzer_krechnung.id,'krechnung')
join kontoauszuege on kontoauszuege_belege.id = kontoauszuege.id

 union all

select 

distinct 

regexp_replace(upper(uebersetzer.iban),'[^0-9A-Z]','') konto, uebersetzer.kundennummer,uebersetzer.kostenstelle

from uebersetzer where uebersetzer.iban <> ''


 union all

select 

distinct 
regexp_replace(upper(adressen.iban),'[^0-9A-Z]','') konto, adressen.kundennummer,adressen.kostenstelle

from adressen where adressen.iban <> ''
 
 ;
create or replace view view_fints_list_relation as
select distinct kundennummer from    view_fints_iban_relation ;

