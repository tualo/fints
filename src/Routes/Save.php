<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;
use Tualo\Office\Report\Report;


class Save extends \Tualo\Office\Basic\RouteWrapper
{
    public static function register()
    {
        Route::add('/fints/save', function ($matches) {

            $db = A::get('session')->getDB();
            $result = [];
            $result['dbg'] = [];
            $result['success'] = false;
            try {

                $payments = json_decode($_REQUEST['payments'], true);
                if (!is_null($payments)) {

                    foreach ($payments as $pay) {
                        $id = intval($pay['id']);
                        $res = Report::addPayment(
                            $pay['tabellenzusatz'],
                            $pay['belegnummer'],
                            $pay['betrag'] * $pay['bw_faktor'],
                            $pay['datum'],
                            $pay['zahlungsart']
                        );

                        $result['dbg'][] = $res;
                        if ($res >= 0) {
                            $sql = '
                            update
                                kontoauszuege
                            set
                                rechnungsnummer= concat(ifnull(rechnungsnummer,\'\'),\';\', \'' . $pay['belegnummer'] . '\' )
                            where
                                id = \'' . $id . '\'
                            ';
                            $db->direct($sql);
                            $db->direct('insert into kontoauszuege_belege (id,belegnummer,tabellenzusatz) values ({id},{belegnummer},{tabellenzusatz}) on duplicate key update id=values(id)', $pay);
                            $result['dbg'][] = $db->last_sql;
                            $result['success'] = true;
                        } else {
                            $result['success'] = false;

                            break;
                        }

                        if (floatval($pay['ueberzahlung']) != 0) {

                            $res = Report::addPayment(
                                $pay['tabellenzusatz'],
                                $pay['belegnummer'],
                                $pay['ueberzahlung'] * $pay['bw_faktor'],
                                $pay['datum'],
                                $pay['zahlungsart']
                            );

                            $result['dbg'][] = $res;
                        }
                    }
                }

                if ($result['success']) {
                    $db->commit();
                } else {
                    $db->execute('rollback');
                }
                A::result('success', $result['success']);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, ['post'], true);
    }
}
