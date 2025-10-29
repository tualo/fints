<?php

namespace Tualo\Office\FinTS\Routes;

use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class Accounts extends \Tualo\Office\Basic\RouteWrapper
{
  public static function register()
  {
    Route::add('/fints/accounts', function ($matches) {

      $db = A::get('session')->getDB();
      try {

        $sql = '
                  select
                    id,
                    bankkonto,
                    buchungsdatum,
                    valuta,
                    betrag,
                    waehrung,
                    empfaengername1,
                    empfaengername2,
                    blz,
                    kontonummer,
                    verwendungszweck,
                    rechnungsnummer,

                    sepa_subfeld("MREF",verwendungszweck) mref,
                    sepa_subfeld("EREF",verwendungszweck) eref,
                    sepa_subfeld("KREF",verwendungszweck) kref,
                    sepa_subfeld("CRED",verwendungszweck) cred,
                    sepa_subfeld("DEBT",verwendungszweck) debt,
                    if ( sepa_subfeld("SVWZ",verwendungszweck) ="",verwendungszweck,sepa_subfeld("SVWZ",verwendungszweck))  svwz,
                    sepa_subfeld("ABWA",verwendungszweck) abwa


                  from 
                  ( 
                    select
                  id,
                  bankkonto,
                  buchungsdatum,
                  valuta,
                  betrag,
                  waehrung,
                  empfaengername1,
                  empfaengername2,
                  blz,
                  kontonummer,
                  concat(
                    ifnull(verwendungszweck1,"")," ",
                    ifnull(verwendungszweck2,"")," ",
                    ifnull(verwendungszweck3,"")," ",
                    ifnull(verwendungszweck4,"")," ",
                    ifnull(verwendungszweck5,"")," "
                  ) verwendungszweck,
                  verwendungszweck1,
                  verwendungszweck2,
                  verwendungszweck3,
                  verwendungszweck4,
                  verwendungszweck5,
                  rechnungsnummer
                  from kontoauszuege where rechnungsnummer is null
                  and valuta > curdate() - interval 5 month
                  ) sub
                ';
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
