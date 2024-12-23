<?php

namespace Tualo\Office\FinTS;

use Tualo\Office\Basic\TualoApplication as A;
use Fhp\CurlException;
use Fhp\Protocol\ServerException;
use Fhp\Protocol\UnexpectedResponseException;
use Tualo\Office\DS\DSCreateRoute;


use nemiah\phpSepaXml\SEPACreditor;
use nemiah\phpSepaXml\SEPADebitor;
use nemiah\phpSepaXml\SEPADirectDebitBasic;
use nemiah\phpSepaXml\SEPATransfer;
use Digitick\Sepa\PaymentInformation;
use Digitick\Sepa\TransferFile\Factory\TransferFileFacadeFactory;

use Tualo\Office\DS\DSTable;

class Sepa
{

    public function __construct()
    {
    }

    public static function createCustomerCredit()
    {
        $db = A::get('session')->getDB();
        $fints_accounts = DSTable::instance('fints_accounts')->f('id','eq',  $_REQUEST['useaccount'] )->read();
        if ($fints_accounts->empty()) throw new \Exception('Das Konto konnte nicht ermittelt werden');
        if ($fints_accounts===false) throw new \Exception('Das Konto konnte nicht ermittelt werden');
        $fints_account = $fints_accounts->getSingle();


        $bankkonten = DSTable::instance('bankkonten')->f('iban','eq', $fints_account['iban'])->read();
        if ($bankkonten->empty()) throw new \Exception('Das Konto konnte nicht ermittelt werden');
        if ($bankkonten===false) throw new \Exception('Das Konto konnte nicht ermittelt werden');
        $bankkonto = $bankkonten->getSingle();


        // print_r($bankkonto); exit();
        $customerCredit = TransferFileFacadeFactory::createCustomerCredit("tualo-".time(), $fints_account['inhabername'],$painFormat = 'pain.001.001.03');

        // create a payment, it's possible to create multiple payments,
        // "firstPayment" is the identifier for the transactions
        $customerCredit->addPaymentInfo('firstPayment', array(
            'id' 					=> 'firstPayment',
            'debtorName' 			=> $fints_account['inhabername'],
            'debtorAccountIBAN'	=> $fints_account['iban'],
            'debtorAgentBIC' 		=> $bankkonto['bic'],
            'dueDate' 				=> new \DateTime(date('Y-m-d',strtotime('now + 5 days'))),  
        ));


        $customerCredit->addTransfer('firstPayment', array(
            'amount'                  => intval( $_REQUEST['value']*100) , // `amount` should be in cents
            'creditorIban'            => $_REQUEST['iban'],
            'creditorBic'             => '',
            'creditorName'            => $_REQUEST['name'],
            'dueDate' 				=> new \DateTime(date('Y-m-d',strtotime('now + 5 days'))),  
            'remittanceInformation'   => $_REQUEST['text']
        ));

        // Retrieve the resulting XML
        return $customerCredit->asXML();
    }
}