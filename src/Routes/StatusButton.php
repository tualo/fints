<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class StatusButton extends \Tualo\Office\Basic\RouteWrapper
{
    public static function register()
    {
        Route::add('/fints/statusbuttons', function ($matches) {

            $db = A::get('session')->getDB();
            try {

                $sql = 'select id,name from kontoauszug_status where aktiv=1';
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
