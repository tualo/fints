<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\FinTS\Camt052;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;
use Tualo\Office\Report\Report;


class Test extends \Tualo\Office\Basic\RouteWrapper
{
    public static function register()
    {
        Route::add('/fints/test', function ($matches) {

            $db = A::get('session')->getDB();
            try {
                $xmls = file_get_contents((string)A::get('basePath') . '/.ht_20260727071732.xml');
                A::result('data', Camt052::parseCamt052($xmls));
                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, ['get'], true);
    }
}
