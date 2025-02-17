CREATE or replace PROCEDURE `saldenausgleich_blg_rechnung`() BEGIN
declare newid bigint;
for kns in (
    select distinct kundennummer,
        offen
    from (
            select blg_hdr_rechnung.id,
                brutto,
                referenz,
                offen,
                blg_adressen_rechnung.kundennummer
            from blg_hdr_rechnung
                join blg_adressen_rechnung on blg_hdr_rechnung.id = blg_adressen_rechnung.id
            where blg_hdr_rechnung.id > 202300000
                and blg_hdr_rechnung.id not in (
                    select invoice_id
                    from projectmanagement
                )
                and referenz not in (
                    select name
                    from projectmanagement
                )
                and offen > 0
        ) x
    limit 100
) DO
select 'check' msg,
    kns.kundennummer,
    kns.offen;
for reports in (
    select a.offen a_offen,
        a.id a_id,
        b.offen b_offen,
        b.id b_id
    from (
            select blg_hdr_rechnung.id,
                brutto,
                referenz,
                offen,
                blg_adressen_rechnung.kundennummer
            from blg_hdr_rechnung
                join blg_adressen_rechnung on blg_hdr_rechnung.id = blg_adressen_rechnung.id
            where blg_hdr_rechnung.id > 202300000
                and blg_hdr_rechnung.id not in (
                    select invoice_id
                    from projectmanagement
                )
                and referenz not in (
                    select name
                    from projectmanagement
                )
                and offen = kns.offen
                and kundennummer = kns.kundennummer
            limit 1
        ) a
        join (
            select blg_hdr_rechnung.id,
                brutto,
                referenz,
                offen,
                blg_adressen_rechnung.kundennummer
            from blg_hdr_rechnung
                join blg_adressen_rechnung on blg_hdr_rechnung.id = blg_adressen_rechnung.id
            where blg_hdr_rechnung.id > 202300000
                and blg_hdr_rechnung.id not in (
                    select invoice_id
                    from projectmanagement
                )
                and referenz not in (
                    select name
                    from projectmanagement
                )
                and offen = kns.offen * -1
                and kundennummer = kns.kundennummer
            limit 1
        ) b on a.kundennummer = b.kundennummer
) DO
select reports.a_id,
    reports.b_id,
    reports.a_offen,
    reports.b_offen;
set newid = (
        select ifnull(max(id), 0) + 1
        from blg_min_rechnung
    );
insert into blg_min_rechnung (
        id,
        name,
        belegnummer,
        bemerkung,
        betrag
    )
values (
        newid,
        'Verrechnung',
        reports.a_id,
        reports.b_id,
        reports.a_offen
    ),
(
        newid + 1,
        'Verrechnung',
        reports.b_id,
        reports.a_id,
        reports.b_offen
    );
call recalculateHeader('rechnung', reports.a_id);
call recalculateHeader('rechnung', reports.b_id);
END for;
END for;
END