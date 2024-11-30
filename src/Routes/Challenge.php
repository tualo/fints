<?php
namespace Tualo\Office\FinTS\Routes;
use Tualo\Office\Basic\TualoApplication as A;
use Tualo\Office\Basic\Route;
use Tualo\Office\Basic\IRoute;
use Tualo\Office\DS\DSReadRoute;
use Tualo\Office\FinTS\FinTS;

class Challenge implements IRoute{
    public static function register(){
        Route::add('/fints/challenge',function($matches){

            $db = A::get('session')->getDB();
            try{
                if (!class_exists("\Fhp\Options\Credentials")){
                    throw new \Exception("fints not installed");
                }
                if(!defined('FHP_REGISTRATION_NO')){
                    throw new \Exception('FinTS Produktcode fehlt');
                }
                if(!defined('FHP_SOFTWARE_VERSION')){
                    throw new \Exception('FinTS Produktversion fehlt');
                }
        
                if (!isset($_REQUEST['usepin'])){
                    throw new \Exception('Das Passwort fehlt');
                }
                if (!isset($_REQUEST['useaccount'])){
                    throw new \Exception('Das Account fehlt');
                }
        
                include_once __DIR__.'/classes/FinTS.php';
        
                $fints_account = DSReadRoute::readSingleItem($db,'fints_accounts',array(
                    'filter'=>array(
                        array(
                            'property'=>'fints_accounts__id',
                            'operator'=>'eq',
                            'value'=>$_REQUEST['useaccount']
                        )
                    )
                ));
                if ($fints_account===false) throw new \Exception('Das Konto konnte nicht ermittelt werden');
        
                
                // include_once __DIR__.'/classes/FinTS.php';
                $options = new \Fhp\Options\FinTsOptions();
                $options->productName = constant('FHP_REGISTRATION_NO');
                $options->productVersion = constant('FHP_SOFTWARE_VERSION');
                $options->url = $fints_account['fints_accounts__url'];
                $options->bankCode = $fints_account['fints_accounts__code'];
                $credentials = \Fhp\Options\Credentials::create($fints_account['fints_accounts__banking_username'], $_REQUEST['usepin']);
        
                $persistedInstance = $persistedAction = null;
        
        
                $sessionfile = A::get('tempPath') . '/' .'.ht_fints_state';
                if (file_exists($sessionfile)) {
                    
                    list($persistedInstance, $persistedAction) = unserialize(file_get_contents($sessionfile));
                    
                }
                $fints = \Fhp\FinTs::new($options, $credentials, $persistedInstance);
                $response = FinTS::handleRequest($_REQUEST, $fints, $db, $persistedAction);
                file_put_contents($sessionfile, serialize([$fints->persist(), $persistedAction]));
        
                A::result('success', true);
            }catch(\Exception $e){

                A::result('last_sql', $db->last_sql );
                A::result('msg', $e->getMessage());
            }
            A::contenttype('application/json');
        },array('get'),true);

    }
}