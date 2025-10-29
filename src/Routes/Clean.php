<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class Clean extends \Tualo\Office\Basic\RouteWrapper
{
    public static function register()
    {
        Route::add('/fints/clean', function ($matches) {

            $db = A::get('session')->getDB();
            try {
                $sessionfile = A::get('tempPath') . '/' . '.ht_fints_state';
                if (file_exists($sessionfile)) {
                    unlink($sessionfile);
                }
                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, array('get'), true);
    }
}
