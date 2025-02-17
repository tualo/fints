<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class ResetAccountItem implements IRoute
{
    public static function register()
    {
        Route::add('/fints/resetaccountitem/(?P<id>[\w\-\_\|]+)', function ($matches) {

            $db = A::get('session')->getDB();
            try {
                $liste = $db->direct("select * from kontoauszuege_belege where id = {id}", $matches);
                if (count($liste) > 0) {
                    throw new \Exception('Es gibt ausgezifferte Belege für diesen Kontoauszug. Bitte löschen Sie diese zuerst.');
                }
                $db->direct("update kontoauszuege set rechnungsnummer=null where id = {id}", $matches);
                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, array('get'), true);
    }
}
