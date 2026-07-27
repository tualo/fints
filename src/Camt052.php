<?php

namespace Tualo\Office\FinTS;



class Camt052
{
    public static function parseCamt052($xmlContent)
    {
        $transactions = array();

        $xmlContentParts = explode("\n", $xmlContent);
        foreach ($xmlContentParts as $line) {
            $xml = simplexml_load_string($line);

            // Namespaces auslesen
            $namespaces = $xml->getNamespaces(true);
            $ns = $namespaces[''] ?? 'urn:iso:std:iso:20022:tech:xsd:camt.052.001.08';


            // Navigiere zur BkToCstmrAcctRpt mit Namespace
            $doc = $xml->children($ns);
            $bkToCstmrAcctRpt = $doc->BkToCstmrAcctRpt;

            if ($bkToCstmrAcctRpt === null) {
                die("BkToCstmrAcctRpt nicht gefunden!\n");
            }

            $rpt = $bkToCstmrAcctRpt->Rpt;

            // Account-Informationen
            $acct = $rpt->Acct;
            $iban = (string)$acct->Id->IBAN;
            $currency = (string)$acct->Ccy;
            /*
        echo "IBAN: $iban\n";
        echo "Währung: $currency\n";
        echo "Anzahl Transaktionen: " . count($rpt->Ntry) . "\n\n";
*/
            // Alle Transaktionen durchlaufen
            foreach ($rpt->Ntry as $entry) {


                // Extrahiere Daten aus der Transaktion
                $bookingdate = (string)$entry->BookgDt->Dt;
                $valutadate = (string)$entry->ValDt->Dt;
                $amount = (string)$entry->Amt;
                $cdtDbt = (string)$entry->CdtDbtInd; // CRDT = Credit, DBIT = Debit

                // Wenn Debit, dann negativer Betrag
                if ($cdtDbt === 'DBIT') {
                    $amount = '-' . $amount;
                }

                // Detaillierte Transaktionsinformationen
                $description1 = '';
                $description2 = '';
                $description3 = '';
                $empfaengername = '';
                $blz = '';
                $kontonummer = '';

                // NtryDtls durchsuchen
                if (isset($entry->NtryDtls->TxDtls)) {
                    foreach ($entry->NtryDtls->TxDtls as $txDtl) {
                        // Empfänger/Absender Information
                        if (isset($txDtl->RltdPties->Cdtr->Pty->Nm)) {
                            $empfaengername = (string)$txDtl->RltdPties->Cdtr->Pty->Nm;
                        }
                        if (isset($txDtl->RltdPties->CdtrAcct->Id->IBAN)) {
                            $kontonummer = (string)$txDtl->RltdPties->CdtrAcct->Id->IBAN;
                        }
                        if (isset($txDtl->RltdAgts->CdtrAgt->FinInstnId->BICFI)) {
                            $blz = (string)$txDtl->RltdAgts->CdtrAgt->FinInstnId->BICFI;
                        }

                        // Verwendungszweck / Beschreibung
                        if (isset($txDtl->RmtInf->Ustrd)) {
                            $fullRemittance = (string)$txDtl->RmtInf->Ustrd;
                            $parts = explode(' ', $fullRemittance, 3);
                            $description1 = $parts[0] ?? '';
                            $description2 = $parts[1] ?? '';
                            $description3 = $parts[2] ?? '';
                        }
                    }
                } else {
                }

                // Eindeutige ID generieren
                $uniqueid = md5($valutadate . $amount . $description1 . $description2 . $description3);

                // Hash-Array erstellen (wie gewünscht)
                $hash = array(
                    'bankkonto' => $iban,
                    'buchungsdatum' => $bookingdate,
                    'valuta' => $valutadate,
                    'betrag' => $amount,
                    'waehrung' => $currency,
                    'empfaengername1' => $empfaengername,
                    'blz' => $blz,
                    'kontonummer' => $kontonummer,
                    'verwendungszweck1' => $description1,
                    'verwendungszweck2' => $description2,
                    'verwendungszweck3' => $description3,
                    'uniqueid' => $uniqueid,
                );

                $transactions[] = $hash;
            }
        }

        return $transactions;
    }
}
