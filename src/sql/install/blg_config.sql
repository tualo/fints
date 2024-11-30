delimiter ;

call addFieldIfNotExists('blg_config','kontoauszug','tinyint default 0');

INSERT INTO `blg_config` (`id`, `name`, `tabellenzusatz`, `ausgangslager`, `eingangslager`, `lager_faktor`, `kopftext`, `fusstext`, `adress_bezug`, `preis_bezug`, `belegnummer_von`, `belegnummer_bis`, `konten_bezug`, `text_belegnummer`, `text_bezugnummer`, `text_subbezugnummer`, `text_datum`, `text_von_lager`, `text_an_lager`, `bezug_anzeigen`, `brutto_anzeigen`, `preisorientierung`, `lieferant_artikel`, `filter_warengruppe`, `keine_kommission_artikel`, `kommission_artikel`, `nicht_bestands_artikel`, `steuerrechnen`, `mengen_genauigkeit`, `epreis_genauigkeit`, `pv_report_class`, `gesperrt`, `auto_lock`, `transitlager`, `periodensperre`, `auto_append_formel`, `bw_faktor`, `aliasname`, `gegenkonto_bezug`, `bezug_id`, `bezug_kst`, `bestandspruefung`, `nur_kostenstelle_zusammenfassen`, `kontoauszug`) 
VALUES 
(1000000100,'Kontoauszugszahlung','kaz',1,1,-1,1,1,'bankkonten','preis',8100000001,8199999999,'normalbesteuert','','','','','','',0,0,'netto',0,'*',0,1,1,0,2,2,'',0,-1,0,1,0,1,'','','konto','kostenstelle',1,0,0),
(1000000200,'Automatischer Beleg','kazautomat',1,1,-1,1,1,'buchungskonten','preis',9100000001,9190000000,'normalbesteuert','','','','','','',1,0,'netto',0,'*',0,1,1,0,2,5,'',0,-1,0,1,0,-1,'','','konto','kostenstelle',1,0,0);
