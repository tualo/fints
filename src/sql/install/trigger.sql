delimiter //

create or replace trigger `blg_hdr_kaz_referenz` before insert
    on blg_hdr_kaz for each row
begin
    declare errno smallint unsigned default 31001;
    if exists(select id from blg_hdr_kaz where referenz=new.referenz and zbeleg = new.zbeleg and zbeleg_zusatz = new.zbeleg_zusatz) then
        signal sqlstate '45000' set mysql_errno = errno, message_text = 'Der Kontoauszug ist bereits verbucht';
    end if;
end //


create or replace trigger `blg_pos_kaz_kontoauszuege_belege` after insert
    on blg_pos_kaz for each row
begin
    insert into kontoauszuege_belege (id,belegnummer,tabellenzusatz) 
    values (new.zid, new.referenz,new.zzusatz) on duplicate key update id=values(id);
end //


create or replace trigger `blg_pos_kaz_payment` after insert
    on blg_pos_kaz for each row
begin
    declare errno smallint unsigned default 31001;

    -- repeat for every type
    call trigger_helper_blg_pos_kaz_payment_rechnung(new.brutto,new.beleg,new.vid,new.vzusatz);
    call trigger_helper_blg_pos_kaz_payment_krechnung(new.brutto,new.beleg,new.vid,new.vzusatz);
    call trigger_helper_blg_pos_kaz_payment_kazautomat(new.brutto,new.beleg,new.vid,new.vzusatz);

end //



create or replace trigger `blg_pay_krechnung_open_ai` after insert on blg_pay_krechnung for each row
begin
    call recalculateheaderkrechnung(new.belegnummer);
end //

create or replace trigger `blg_pay_krechnung_open_au` after update on blg_pay_krechnung for each row
begin
    call recalculateheaderkrechnung(new.belegnummer);
end //

create or replace trigger `blg_pay_krechnung_open_au` after delete on blg_pay_krechnung for each row
begin
    call recalculateheaderkrechnung(old.belegnummer);
end //


create or replace trigger `blg_pay_krechnung_open_ai` after insert on blg_pay_krechnung for each row
begin

    replace into deferred_sql_tasks (
        taskid,
        sessionuser,
        state,
        createtime,
        sqlstatement,
        hostname
    ) values (
        "proc_briefwahlkandidaten",
        getSessionUser(),
        0,
        current_timestamp(),
        concat("call recalculateheader('krechnung',", new.belegnummer, "    );"),
        @@hostname
    );
    
end //

create or replace trigger `blg_pay_krechnung_open_au` after update on blg_pay_krechnung for each row
begin
    call recalculateheader('krechnung',new.belegnummer);
end //

create or replace trigger `blg_pay_krechnung_open_ad` after delete on blg_pay_krechnung for each row
begin
    call recalculateheader('krechnung',old.belegnummer);
end //


create or replace trigger `blg_pay_rechnung_open_ai` after insert on blg_pay_rechnung for each row
begin
    call recalculateheader('rechnung',new.belegnummer);
end //

create or replace trigger `blg_pay_rechnung_open_au` after update on blg_pay_rechnung for each row
begin
    call recalculateheader('rechnung',new.belegnummer);
end //

create or replace trigger `blg_pay_rechnung_open_ad` after delete on blg_pay_rechnung for each row
begin
    call recalculateheader('rechnung',old.belegnummer);
end //