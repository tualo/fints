<?php
namespace Tualo\Office\FinTS\Checks;

use Tualo\Office\Basic\Middleware\Session;
use Tualo\Office\Basic\PreCheck as PCheck;
use Tualo\Office\Basic\TualoApplication as App;


class PreCheck  extends PCheck {
    public static function test(array $config){
        $clientdb = App::get('clientDB');
        if (is_null($clientdb)) return;
        if ($clientdb->singleRow('select starttime from wm_loginpage_settings where starttime>now() and id = 1', []) === false) {
            if ($clientdb->singleValue('select count(*) c from wm_loginpage_settings where id = 1', [],'c') == 1) {
                throw new \Exception("Es kann nur vor dem Start der Wahlfrist aktualisiert werden");
            }
        }else{
            PreCheck::formatPrintLn(['green'],'onlinevote, starttime ok, update möglich');
        }
        // exit(65);
    }
}