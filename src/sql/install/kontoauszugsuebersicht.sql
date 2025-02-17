select kontoauszuege_belege.belegnummer,
    kontoauszuege.id kontoauszugsid,
    a.fibukonto,
    kontoauszuege.valuta,
    kontoauszuege.betrag,
    p.betrag pay_betrag,
    sepa_subfeld('EREF', kontoauszuege.verwendungszweck1) eref,
    sepa_subfeld('SVWZ', kontoauszuege.verwendungszweck1) svwz,
    sepa_subfeld('KREF', kontoauszuege.verwendungszweck1) kref,
    sepa_subfeld('MREF', kontoauszuege.verwendungszweck1) mref,
    sepa_subfeld('CRED', kontoauszuege.verwendungszweck1) cred,
    sepa_subfeld('DEPT', kontoauszuege.verwendungszweck1) debt,
    sepa_subfeld('ABWA', kontoauszuege.verwendungszweck1) abwa,
    kontoauszuege.verwendungszweck1
from kontoauszuege
    join kontoauszuege_belege on kontoauszuege.id = kontoauszuege_belege.id
    and kontoauszuege_belege.tabellenzusatz = "rechnung"
    join blg_pay_rechnung p on kontoauszuege_belege.belegnummer = p.belegnummer
    join blg_adressen_rechnung b on b.id = p.belegnummer
    join adressen a on (adressen.kundennummer, adressen.kostenstelle) = (b.kundennummer, b.kostenstelle)
union all
select kontoauszuege_belege.belegnummer,
    kontoauszuege.id kontoauszugsid,
    a.fibukonto,
    kontoauszuege.valuta,
    kontoauszuege.betrag,
    p.betrag pay_betrag,
    sepa_subfeld('EREF', kontoauszuege.verwendungszweck1) eref,
    sepa_subfeld('SVWZ', kontoauszuege.verwendungszweck1) svwz,
    sepa_subfeld('KREF', kontoauszuege.verwendungszweck1) kref,
    sepa_subfeld('MREF', kontoauszuege.verwendungszweck1) mref,
    sepa_subfeld('CRED', kontoauszuege.verwendungszweck1) cred,
    sepa_subfeld('DEPT', kontoauszuege.verwendungszweck1) debt,
    sepa_subfeld('ABWA', kontoauszuege.verwendungszweck1) abwa,
    kontoauszuege.verwendungszweck1
from kontoauszuege
    join kontoauszuege_belege on kontoauszuege.id = kontoauszuege_belege.id
    and kontoauszuege_belege.tabellenzusatz = "krechnung"
    join blg_pay_rechnung p on kontoauszuege_belege.belegnummer = p.belegnummer
    join blg_adressen_rechnung b on b.id = p.belegnummer
    join uebersetzer a on (a.kundennummer, a.kostenstelle) = (b.kundennummer, b.kostenstelle)