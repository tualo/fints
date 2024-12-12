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

class FinTS
{


    public static function handleRequest($request, \Fhp\FinTs $fints, $db, &$persistedAction)
    {
        // global $persistedAction;
        switch ($request['action']) {
            case 'getTanModes':
                return array_map(function ($mode) {
                    return [
                        'id' => $mode->getId(),
                        'name' => $mode->getName(),
                        'isDecoupled' => $mode->isDecoupled(),
                        'needsTanMedium' => $mode->needsTanMedium(),
                    ];
                }, array_values($fints->getTanModes()));
            case 'getTanMedia':
                return array_map(function ($medium) {
                    return ['name' => $medium->getName(), 'phoneNumber' => $medium->getPhoneNumber()];
                }, $fints->getTanMedia(intval($request['tanmode'])));
            case 'login':
                $fints->selectTanMode(intval($request['tanmode']), $request['tanmedium'] ?? null);
                $login = $fints->login();
                // var_dump($fints);

                if ($login->needsTan()) {
                    $tanRequest = $login->getTanRequest();
                    $persistedAction = serialize($login);
                    return ['result' => 'needsTan', 'challenge' => $tanRequest->getChallenge()];
                }
                return [

                    'result' => 'success',
                    'needsTan'=>'false',
                    'needsTanV' => $login->needsTan()
                ];
            case 'submitTan':
                $fints->submitTan(unserialize($persistedAction), $request['tan']);
                return ['result' => 'success'];
            case 'checkDecoupledSubmission':
                if ($fints->checkDecoupledSubmission(unserialize($persistedAction))) {
                    return ['result' => 'success'];
                } else {
                    return ['result' => 'ongoing'];
                }
            case 'getStatements':

                $getAccounts = \Fhp\Action\GetSEPAAccounts::create();
                
                $fints->execute($getAccounts); // We assume that needsTan() is always false here.
                if ($getAccounts->needsTan()) {
                    $tanRequest = $getAccounts->getTanRequest();
                    $persistedAction = serialize($getAccounts);
                    return ['result' => 'needsTan','fromAction'=>'getStatements', 'challenge' => $tanRequest->getChallenge()];
                    // handleStrongAuthentication($getAccounts); // See login.php for the implementation.
                }
                

                $oneAccount = $getAccounts->getAccounts()[0];



                $request_record = array(
                    'konto' => $oneAccount->getIban(),
                    'kontonummer' => $oneAccount->getAccountNumber(),
                    'blz' => $oneAccount->getBlz(),
                    'bic' => $oneAccount->getBic(),
                    'waehrung' => $oneAccount->getSubAccount(),
                    'last_fints_query' => date('Y-m-d H:i:s')
                );

                A::result('request_record', $request_record);

                /*
                $bankkontenAppend = DSCreateRoute::createRecord($db, 'bankkonten', array('updateOnDuplicate' => 1), $request_record);
                if ($bankkontenAppend === false) throw new \Exception('DS Bankkonten kann nicht geschrieben werden. '  );
                */
                $sql = "select if(cast( ifnull(max(buchungsdatum),'2017-01-01') as date)<date_add(current_date, interval -30 day), date_add(current_date, interval -30 day),  cast( ifnull(max(BUCHUNGSDATUM),'2017-01-01') as date) ) mdt  from kontoauszuege where  bankkonto={konto}";
                $maxLastDate = $db->singleValue($sql, $request_record, 'mdt');

                $from = new \DateTime($maxLastDate);

                $to = new \DateTime();
                $oneAccount = $getAccounts->getAccounts()[0];
                $getStatement = \Fhp\Action\GetStatementOfAccount::create($oneAccount, $from, $to);

                if ($getStatement->needsTan()) {
                    $tanRequest = $getStatement->getTanRequest();
                    $persistedAction = serialize($getStatement);
                    return ['result' => 'needsTan','fromAction'=>'getStatements', 'challenge' => $tanRequest->getChallenge()];
                    // handleStrongAuthentication($getAccounts); // See login.php for the implementation.
                }
                
                $fints->execute($getStatement);


                if ($getStatement->needsTan()) {
                    $tanRequest = $getStatement->getTanRequest();
                    $persistedAction = serialize($getStatement);
                    return ['result' => 'needsTan','fromAction'=>'getStatements', 'challenge' => $tanRequest->getChallenge()];
                    // handleStrongAuthentication($getAccounts); // See login.php for the implementation.
                }
                

                $soa = $getStatement->getStatement();
                foreach ($soa->getStatements() as $statement) {
                    $statement->getDate()->format('Y-m-d');
                    $kontostand = $statement->getStartBalance();

                    foreach ($statement->getTransactions() as $transaction) {
                        $factor = ($transaction->getCreditDebit() == \Fhp\Model\StatementOfAccount\Statement::CD_DEBIT ? -1 : 1);
                        $amount = $factor * $transaction->getAmount();
                        $name = $transaction->getName();
                        $bookingtext = $transaction->getBookingText();
                        $description1 = $transaction->getDescription1();
                        $description2 = $transaction->getDescription2();
                        $bookingdate = $transaction->getBookingDate()->format('Y-m-d');
                        $vaultadate = $transaction->getValutaDate()->format('Y-m-d');
                        $xblz = $transaction->getBankCode();
                        $xbankkonto = $transaction->getAccountNumber();

                        // $transaction->getEndToEndID()

                        $kontostand += $amount;
                        $hash = array(
                            'bankkonto' => $request_record['konto'],
                            'buchungsdatum' => $bookingdate,
                            'valuta' => $vaultadate,
                            'betrag' => $amount,
                            'waehrung' => $request_record['waehrung'],
                            'empfaengername1' => $name,
                            'blz' => $xblz,
                            'kontonummer' => $xbankkonto,
                            'verwendungszweck1' => $description1,
                            'verwendungszweck2' => $description2,
                            'verwendungszweck3' => $bookingtext,
                            // not the best, but may fit
                            'uniqueid' => $vaultadate . $amount . $description1 . $description2 . $bookingtext,
                            'kontostand' => $kontostand
                        );
                        A::result('hash', $hash);

                        $kontoauszuege = \Tualo\Office\DS\DSTable::instance('kontoauszuege');
                        $kontoauszuege->insert($hash);
                        /*
                        $knres = DSCreateRoute::createRecord($db, 'kontoauszuege', array('updateOnDuplicate' => 1), $hash);
                        if ($knres === false) throw new \Exception('Der Kontoauszug kann nicht geschrieben werden. ' );
                        */
                    }
                }

            case 'logout':
                $fints->close();
                return ['result' => 'success'];

            case 'transfer':



                $getAccounts = \Fhp\Action\GetSEPAAccounts::create();
                $fints->execute($getAccounts); // We assume that needsTan() is always false here.
                if ($getAccounts->needsTan()) {
                    $tanRequest = $getAccounts->getTanRequest();
                    $persistedAction = serialize($getAccounts);
                    return ['result' => 'needsTan','fromAction'=>'getStatements', 'challenge' => $tanRequest->getChallenge()];
                }
                

                $oneAccount = $getAccounts->getAccounts()[0];


                $sendSEPATransfer = \Fhp\Action\SendSEPATransfer::create($oneAccount, $_REQUEST['sepa_xml']);
                $fints->execute($sendSEPATransfer);
                if ($sendSEPATransfer->needsTan()) {
                    handleStrongAuthentication($sendSEPATransfer); // See login.php for the implementation.
                }

            default:
                throw new \InvalidArgumentException("Unknown action " . $request['action']);
        }
    }
}
