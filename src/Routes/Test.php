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
                $transactions = Camt052::parseCamt052($xmls);
                A::result('data', $transactions);


                foreach ($transactions as $transaction) {



                    $r = $db->direct(
                        'select 1 from kontoauszuege where  uniqueid={uniqueid} limit 1',
                        [
                            'uniqueid' => $transaction['uniqueid']
                        ]
                    );
                    if (count($r) == 0) {

                        $kontoauszuege = \Tualo\Office\DS\DSTable::instance('kontoauszuege');
                        $kontoauszuege->insert($transaction, [
                            'ignore' => true,
                            'updateOnDuplicate' => false
                        ]);
                    }
                }

                A::result('success', true);
            } catch (\Exception $e) {

                A::result('last_sql', $db->last_sql);
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        }, ['get'], true);
    }
}
