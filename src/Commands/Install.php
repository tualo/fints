<?php
namespace Tualo\Office\FinTS\Commandline;
use Tualo\Office\Basic\ICommandline;
use Tualo\Office\Basic\CommandLineInstallSQL;

class Install extends CommandLineInstallSQL  implements ICommandline{
    public static function getDir():string {   return dirname(__DIR__,1); }
    public static $shortName  = 'fints';
    public static $files = [
        'install/ds_class' => 'setup ds_class ',
        'install/bankkonten' => 'setup bankkonten ',
        'install/fints_accounts' => 'setup fints_accounts ',
        'install/fints_accounts.ds' => 'setup fints_accounts.ds ',
    ];
    
}