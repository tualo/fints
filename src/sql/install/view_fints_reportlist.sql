
create or replace view view_fints_reportlist as
select
    0=1 as verwenden,
    0.00001 as confidence,
    'rechnung' as tabellenzusatz,
    'Kundenrechnung' as typ,
    a.kundennummer,
    a.kostenstelle,
    h.id belegnummer,
    concat(h.project_name,' ', h.referenz) referenz,
    h.brutto,
    h.netto,
    h.offen,
    h.bezahlt,
    h.minderung,
    h.datum,
    1 bw_faktor

from 
    blg_hdr_rechnung h
    join blg_adressen_rechnung a
        on h.id = a.id
        and datum >= curdate() - interval 1 year
        and brutto <> 0
     

union all

select
    0=1 as verwenden,
    0.00001 as confidence,
    'krechnung' as tabellenzusatz,
    'Übersetzerrechnung' as typ,
    a.kundennummer,
    a.kostenstelle,
    h.id belegnummer,
    concat('','', h.referenz) referenz,
    h.brutto  * -1 brutto,
    h.netto  * -1 netto,
    h.offen * -1 offen,
    h.bezahlt,
    h.minderung,
    h.datum,
    -1 bw_faktor

from 
    blg_hdr_krechnung h
    join blg_uebersetzer_krechnung a
        on h.id = a.id
        and datum >= curdate() - interval 1 year
        and brutto <> 0
