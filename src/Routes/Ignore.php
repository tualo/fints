<?php
namespace Tualo\Office\FinTS\Routes;
use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;


class Ignore implements IRoute{
    public static function register(){
        Route::add('/fints/ignore',function($matches){

            $db = A::get('session')->getDB();
            try{
                /*
                $sessionfile = A::get('tempPath') . '/' .'.ht_fints_state';
                if (file_exists($sessionfile)) {
                    unlink($sessionfile);
                }
                */

                $sql = 'select id,name from kontoauszug_status';
                $states = $db->direct($sql,[],'id');
                $id = intval($_REQUEST['formID']);
                $state_id = intval($_REQUEST['state_id']);
                if (isset($states[$state_id])){
                    $sql = 'update kontoauszuege set rechnungsnummer= {state} where id = {id}';
                    $db->direct($sql,[
                        'id'=>$id,
                        'state'=>$states[$state_id]['name']
                    ]);
                    $db->commit();
                    $result['success'] = true;
                }

                A::result('success', true);
                
            }catch(\Exception $e){
        
                A::result('last_sql', $db->last_sql );
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        },['post'],true);

    }
}