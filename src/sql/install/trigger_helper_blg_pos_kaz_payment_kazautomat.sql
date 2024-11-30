delimiter //

create or replace procedure `trigger_helper_blg_pos_kaz_payment_kazautomat`( 

    in brutto decimal(15,6),
    in beleg bigint,
    in vid bigint,
    in vzusatz varchar(100)
)
begin
    if (vzusatz='kazautomat') then

        select ifnull(max(id),0)+1 i into @newid from blg_pay_kazautomat;

        insert into blg_pay_kazautomat (
            
            id,
            datum,
            belegnummer,
            art,
            betrag,
            zusatz,
            referenztabellenzusatz,
            referenzbelegnummer

        ) values (

            @newid,
            current_date,
            vid,
            'konto',
            brutto,
            '',
            'kaz',
            beleg
        );

    end if;
end //
