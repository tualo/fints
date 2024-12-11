DELIMITER //

CREATE OR REPLACE FUNCTION `getNewKontoauszugID`() RETURNS bigint


BEGIN
    return (select ifnull( max(id),0) +1 from kontoauszuege);
END //
