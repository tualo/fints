<?php

namespace Tualo\Office\FinTS;

use Fhp\CurlException;
use Fhp\Protocol\ServerException;
use Fhp\Protocol\UnexpectedResponseException;
use Tualo\Office\DS\DSCreateRoute;

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
                if ($login->needsTan()) {
                    $tanRequest = $login->getTanRequest();
                    $persistedAction = serialize($login);
                    return ['result' => 'needsTan', 'challenge' => $tanRequest->getChallenge()];
                }
                return ['result' => 'success'];
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
                $oneAccount = $getAccounts->getAccounts()[0];

                $request_record = array(
                    'konto' => $oneAccount->getIban(),
                    'kontonummer' => $oneAccount->getAccountNumber(),
                    'blz' => $oneAccount->getBlz(),
                    'bic' => $oneAccount->getBic(),
                    'waehrung' => $oneAccount->getSubAccount(),
                    'last_fints_query' => date('Y-m-d H:i:s')
                );

                $bankkontenAppend = DSCreateRoute::createRecord($db, 'bankkonten', array('updateOnDuplicate' => 1), $request_record);
                if ($bankkontenAppend === false) throw new \Exception('DS Bankkonten kann nicht geschrieben werden. '  );
                $sql = "select if(cast( ifnull(max(buchungsdatum),'2017-01-01') as date)<date_add(current_date, interval -190 day), date_add(current_date, interval -190 day),  cast( ifnull(max(BUCHUNGSDATUM),'2017-01-01') as date) ) mdt  from kontoauszuege where  bankkonto={konto}";
                $maxLastDate = $db->singleValue($sql, $bankkontenAppend, 'mdt');

                $from = new \DateTime($maxLastDate);

                $to = new \DateTime();
                $oneAccount = $getAccounts->getAccounts()[0];
                $getStatement = \Fhp\Action\GetStatementOfAccount::create($oneAccount, $from, $to);
                $fints->execute($getStatement);
                /*if ($getStatement->needsTan()) {
                        handleStrongAuthentication($getStatement); // See login.php for the implementation.
                    }*/

                $updateOnDuplicate = true;


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
                            'bankkonto' => $bankkontenAppend['konto'],
                            'buchungsdatum' => $bookingdate,
                            'valuta' => $vaultadate,
                            'betrag' => $amount,
                            'waehrung' => $bankkontenAppend['waehrung'],
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
                        $knres = DSCreateRoute::createRecord($db, 'kontoauszuege', array('updateOnDuplicate' => 1), $hash);
                        if ($knres === false) throw new \Exception('Der Kontoauszug kann nicht geschrieben werden. ' );
                    }
                }

            case 'logout':
                $fints->close();
                return ['result' => 'success'];
            default:
                throw new \InvalidArgumentException("Unknown action " . $request['action']);
        }
    }
}
