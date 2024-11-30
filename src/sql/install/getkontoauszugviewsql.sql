delimiter //

drop function if exists getkontoauszugviewsql //
create function `getkontoauszugviewsql`(  )
returns json
reads sql data
comment ''
begin 

    declare template longtext;

    set template = ' ';


    select
        concat( 'create or replace view view_cmp_kontoauszug_open as ',
        group_concat(
        concat(
            'select ',
            '',quote(lower(blg_config.tabellenzusatz)),' tabellenzusatz, ',
            '',quote(blg_config.id),' belegartid, ',
            '',blg_config.bw_faktor,' bw_faktor, ',
            'hdr.id, ',
            'hdr.id belegnummer, ',
            'concat(hdr.id,\' \',hdr.datum, if(hdr.referenz<>"", concat(" ",hdr.referenz),""), " ",  format( round( ',blg_config.bw_faktor,'*hdr.offen,2),2 ), " ", dstable.adressen_anzeige) _display, ',
            'hdr.datum, ',
            'hdr.buchungsdatum, ',
            'hdr.faelligam, ',
            'dstable.',ds.displayfield,' displayfield, ',
            'dstable.',ds.searchfield,' searchfield, ',
            'hdr.zahlart, ',
            'hdr.referenz, ',
            'concat(bez.kundennummer,"-",bez.kostenstelle) bezugsnummer, ',
            'concat(bez.kundennummer) account, ',
            '',blg_config.bw_faktor,'*hdr.netto netto, ',
            '',blg_config.bw_faktor,'*hdr.brutto brutto, ',
            '',blg_config.bw_faktor,'*hdr.offen offen ',
            'from ',
            'blg_hdr_',lower(blg_config.tabellenzusatz),'  hdr ',
            'join blg_', ds.table_name,'_',lower(blg_config.tabellenzusatz),' bez ',
            '    on bez.id = hdr.id and hdr.offen<>0 ',
            'join ', if( ifnull(ds.read_table,'')='' , ds.table_name, ds.read_table),' dstable ',
            '    on dstable.',bezug_id,' = bez.kundennummer ',
            '    and dstable.',bezug_kst,' = bez.kostenstelle '
        )
        
        separator ' union '

        ),' ') s
    into 
        template
    from
        blg_config
        join ds 
            on ds.table_name = blg_config.adress_bezug

    where 
        kontoauszug = 1;
    return template;
end //
