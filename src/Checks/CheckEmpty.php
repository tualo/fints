<?php
namespace Tualo\Office\FinTS\Checks;

use Tualo\Office\Basic\Middleware\Session;
use Tualo\Office\Basic\PostCheck;
use Tualo\Office\Basic\TualoApplication as App;


class CheckEmpty  extends PostCheck {
    
    public static function test(array $config){
        $clientdb = App::get('clientDB');
        if (is_null($clientdb)) return;
        try{
            $res1 = App::get('clientDB')->direct('select * from bankkonten');
        }catch(\Exception $e){
            $res1 = [];
        }

        try{
            $res2 = App::get('clientDB')->direct('select * from fints_accounts');
        }catch(\Exception $e){
            $res2 = [];
        }

        
        if (
            (count($res1)==0) ||
            (count($res2)==0)
        ) {
            PostCheck::formatPrintLn(['red'],'bankkonten or fints_accounts is empty');
        }else{
            PostCheck::formatPrintLn(['green'],'bankkonten or fints_accounts is not empty');
        }
    }
}