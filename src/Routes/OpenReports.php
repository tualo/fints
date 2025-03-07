<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class OpenReports implements IRoute
{

    public static function columns_table_name_filter($array, $table_name)
    {
        $res = array();
        foreach ($array as $value) {
            if ($value['table_name'] == $table_name) {
                $res[] = ' replace( replace( ifnull( ' . $value['table_name'] . '.' . $value['column_name'] . ',\'\'),\'\\\'\',\' \') ,\'"\',\' \')  ';
            }
        };
        return $res;
    }
    public static function register()
    {
        Route::add('/fints/openreports', function ($matches) {

            $db = A::get('session')->getDB();
            try {

                $sql = 'select id,name,tabellenzusatz,adress_bezug,preis_bezug,bezug_id,bezug_kst from blg_config';
                $belege = $db->direct($sql, [], 'id');

                $sql = 'select id,name,lower(tabellenzusatz) tabellenzusatz,adress_bezug,preis_bezug,bw_faktor,bezug_id,bezug_kst from blg_config';
                $belege_tz = $db->direct($sql, [], 'tabellenzusatz');


                /*
                $sql = 'select base_table,blg_table,name,id_column from bezug_config';
                $bezug_config = $db->direct($sql,[],'base_table');
                */

                $sql = 'select table_name,displayfield,searchfield from ds';
                $ds_config = $db->direct($sql, [], 'table_name');

                $tzlist = ['rechnung', 'krechnung'];
                // array('rechnung','krechnung');
                $columns = $db->direct('select table_name,column_name from ds_column where  column_name<>"offen" ');

                $sql_template = '
                    SELECT
                        \'{tz}\' tabellenzusatz,
                        \'{belegartid}\' belegartid,
                        {bw_faktor} bw_faktor,
                        blg_hdr_{tz}.id,
                        blg_hdr_{tz}.id belegnummer,
                        concat(blg_hdr_{tz}.id,\' \',blg_hdr_{tz}.datum, if(blg_hdr_{tz}.referenz<>\'\', concat(\' \',blg_hdr_{tz}.referenz),\'\'), \' \', round( {bw_faktor}*blg_hdr_{tz}.offen,2) ) _display,
                        blg_hdr_{tz}.datum,
                        blg_hdr_{tz}.buchungsdatum,
                        blg_hdr_{tz}.faelligam,
                        {dstable}.{dsname} name,
                        
                        {searchformula}
                        blg_hdr_{tz}.zahlart,
                        blg_hdr_{tz}.referenz,
                        concat(blg_{bez}_{tz}.kundennummer,\'-\',blg_{bez}_{tz}.kostenstelle) bezugsnummer,
                        {bw_faktor}*blg_hdr_{tz}.netto netto,
                        {bw_faktor}*blg_hdr_{tz}.brutto brutto,
                        {bw_faktor}*blg_hdr_{tz}.offen offen
                    FROM
                        blg_hdr_{tz} join blg_{bez}_{tz}
                            on blg_{bez}_{tz}.id = blg_hdr_{tz}.id
                        join view_readtable_{dstable} {dstable}
                            on {dstable}.{idcolumn} = blg_{bez}_{tz}.kundennummer
                            {kst_concat}


                ';
                $formula = array();
                if (isset($_REQUEST['all']) && ($_REQUEST['all'] == 1)) {
                    if (isset($_REQUEST['query'])) {
                        $words = explode(' ', $_REQUEST['query']);
                        foreach ($words as $word) {
                            $formula[] = ' if({dstable}.{searchfield} like \'%' . $word . '%\',1,0 ) ';
                            $formula[] = ' if({dstable}.{idcolumn} like \'%' . $word . '%\',1,0 ) ';
                            $formula[] = ' if(blg_hdr_{tz}.id like \'%' . $word . '%\',1,0 ) ';
                            $formula[] = ' if(blg_hdr_{tz}.referenz like \'%' . $word . '%\',1,0 ) ';
                        }
                        $sql_template .= ' WHERE {searchformula_where} >= ' . count($words) . '  ';
                    }
                } else {
                    $sql_template .= ' WHERE round(blg_hdr_{tz}.offen,1) <> 0 ';
                }
                $sqls = array();
                foreach ($tzlist as $tz) {
                    $beleg_index = $belege_tz[$tz]['id'];
                    $bw_faktor = $belege_tz[$tz]['bw_faktor'];
                    $tsql = $sql_template;

                    if (count($formula) > 0) {
                        $tsql = str_replace('{searchformula}', ' ' . implode('+', $formula) . ' searchformula, ', $tsql);
                        $tsql = str_replace('{searchformula_where}', ' ' . implode('+', $formula) . '  ', $tsql);
                    } else {
                        $tsql = str_replace('{searchformula}', ' 0 searchformula,', $tsql);
                        $tsql = str_replace('{searchformula_where}', ' 0 ', $tsql);
                    }


                    $tsql = str_replace('{kst_concat}', ' and {dstable}.kostenstelle = blg_{bez}_{tz}.kostenstelle ', $tsql);
                    $tsql = str_replace('{tz}', $tz, $tsql);
                    $tsql = str_replace('{bw_faktor}', $bw_faktor, $tsql);
                    $tsql = str_replace('{belegartid}', $beleg_index, $tsql);

                    $tsql = str_replace('{bez}', $belege_tz[$tz]['adress_bezug'], $tsql);
                    $tsql = str_replace('{dstable}', $belege_tz[$tz]['adress_bezug'], $tsql);
                    $tsql = str_replace('{idcolumn}', $belege_tz[$tz]['bezug_id'], $tsql);
                    $tsql = str_replace('{dsname}', $ds_config[$belege_tz[$tz]['adress_bezug']]['displayfield'], $tsql);
                    $tsql = str_replace('{searchfield}', $ds_config[$belege_tz[$tz]['adress_bezug']]['searchfield'], $tsql);


                    $matchcols = self::columns_table_name_filter($columns, $belege_tz[$tz]['adress_bezug']);
                    if (count($matchcols) > 0) {
                        $tsql = str_replace('{matchcols}', ' concat( \'["\',' . implode(',\'","\',', $matchcols) . ' ,\'"]\') matchcols, ', $tsql);
                    } else {
                        $tsql = str_replace('{matchcols}', ' \'[]\' matchcols,', $tsql);
                    }


                    $sqls[] = $tsql;
                }
                $sql = implode(' union ', $sqls) . ' order by searchformula desc ,datum desc';



                $data = $db->direct($sql);
                A::result('data', $data);
                A::result('total', count($data));
                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, array('get'), true);



        Route::add('/fints/reports', function ($matches) {

            $db = A::get('session')->getDB();
            try {

                $sql = 'select id,name,tabellenzusatz,adress_bezug,preis_bezug,bezug_id,bezug_kst from blg_config';
                $belege = $db->direct($sql, [], 'id');

                $sql = 'select id,name,lower(tabellenzusatz) tabellenzusatz,adress_bezug,preis_bezug,bw_faktor,bezug_id,bezug_kst from blg_config';
                $belege_tz = $db->direct($sql, [], 'tabellenzusatz');


                /*
                $sql = 'select base_table,blg_table,name,id_column from bezug_config';
                $bezug_config = $db->direct($sql,[],'base_table');
                */

                $sql = 'select table_name,displayfield,searchfield from ds';
                $ds_config = $db->direct($sql, [], 'table_name');

                $tzlist = ['rechnung', 'krechnung'];
                // array('rechnung','krechnung');
                $columns = $db->direct('select table_name,column_name from ds_column where  column_name<>"offen" ');

                $sql_template = '
                    SELECT
                        \'{tz}\' tabellenzusatz,
                        \'{belegartid}\' belegartid,
                        {bw_faktor} bw_faktor,
                        blg_hdr_{tz}.id,
                        blg_hdr_{tz}.id belegnummer,
                        concat(blg_hdr_{tz}.id,\' \',blg_hdr_{tz}.datum, if(blg_hdr_{tz}.referenz<>\'\', concat(\' \',blg_hdr_{tz}.referenz),\'\'), \' \', round( {bw_faktor}*blg_hdr_{tz}.offen,2) ) _display,
                        blg_hdr_{tz}.datum,
                        blg_hdr_{tz}.buchungsdatum,
                        blg_hdr_{tz}.faelligam,
                        {dstable}.{dsname} name,
                        
                        {searchformula}
                        blg_hdr_{tz}.zahlart,
                        blg_hdr_{tz}.referenz,
                        concat(blg_{bez}_{tz}.kundennummer,\'-\',blg_{bez}_{tz}.kostenstelle) bezugsnummer,
                        {bw_faktor}*blg_hdr_{tz}.netto netto,
                        {bw_faktor}*blg_hdr_{tz}.brutto brutto,
                        {bw_faktor}*blg_hdr_{tz}.offen offen
                    FROM
                        blg_hdr_{tz} join blg_{bez}_{tz}
                            on blg_{bez}_{tz}.id = blg_hdr_{tz}.id
                        join view_readtable_{dstable} {dstable}
                            on {dstable}.{idcolumn} = blg_{bez}_{tz}.kundennummer
                            {kst_concat}


                ';
                $formula = array();

                if (isset($_REQUEST['query'])) {
                    $words = explode(' ', $_REQUEST['query']);
                    foreach ($words as $word) {
                        $formula[] = ' if({dstable}.{searchfield} like \'%' . $word . '%\',1,0 ) ';
                        $formula[] = ' if({dstable}.{idcolumn} like \'%' . $word . '%\',1,0 ) ';
                        $formula[] = ' if(blg_hdr_{tz}.id like \'%' . $word . '%\',1,0 ) ';
                        $formula[] = ' if(blg_hdr_{tz}.referenz like \'%' . $word . '%\',1,0 ) ';
                    }
                    $sql_template .= ' WHERE {searchformula_where} >= ' . count($words) . '  ';
                }

                $sqls = array();
                foreach ($tzlist as $tz) {
                    $beleg_index = $belege_tz[$tz]['id'];
                    $bw_faktor = $belege_tz[$tz]['bw_faktor'];
                    $tsql = $sql_template;

                    if (count($formula) > 0) {
                        $tsql = str_replace('{searchformula}', ' ' . implode('+', $formula) . ' searchformula, ', $tsql);
                        $tsql = str_replace('{searchformula_where}', ' ' . implode('+', $formula) . '  ', $tsql);
                    } else {
                        $tsql = str_replace('{searchformula}', ' 0 searchformula,', $tsql);
                        $tsql = str_replace('{searchformula_where}', ' 0 ', $tsql);
                    }


                    $tsql = str_replace('{kst_concat}', ' and {dstable}.kostenstelle = blg_{bez}_{tz}.kostenstelle ', $tsql);
                    $tsql = str_replace('{tz}', $tz, $tsql);
                    $tsql = str_replace('{bw_faktor}', $bw_faktor, $tsql);
                    $tsql = str_replace('{belegartid}', $beleg_index, $tsql);

                    $tsql = str_replace('{bez}', $belege_tz[$tz]['adress_bezug'], $tsql);
                    $tsql = str_replace('{dstable}', $belege_tz[$tz]['adress_bezug'], $tsql);
                    $tsql = str_replace('{idcolumn}', $belege_tz[$tz]['bezug_id'], $tsql);
                    $tsql = str_replace('{dsname}', $ds_config[$belege_tz[$tz]['adress_bezug']]['displayfield'], $tsql);
                    $tsql = str_replace('{searchfield}', $ds_config[$belege_tz[$tz]['adress_bezug']]['searchfield'], $tsql);


                    $matchcols = self::columns_table_name_filter($columns, $belege_tz[$tz]['adress_bezug']);
                    if (count($matchcols) > 0) {
                        $tsql = str_replace('{matchcols}', ' concat( \'["\',' . implode(',\'","\',', $matchcols) . ' ,\'"]\') matchcols, ', $tsql);
                    } else {
                        $tsql = str_replace('{matchcols}', ' \'[]\' matchcols,', $tsql);
                    }


                    $sqls[] = $tsql;
                }
                $sql = implode(' union ', $sqls) . ' order by searchformula desc ,datum desc';



                $data = $db->direct($sql);
                A::result('data', $data);
                A::result('total', count($data));
                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, array('get'), true);
    }
}
