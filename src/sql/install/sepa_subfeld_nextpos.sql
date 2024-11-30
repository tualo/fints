delimiter //

DROP FUNCTION IF EXISTS `sepa_subfeld_nextpos` //
DROP FUNCTION IF EXISTS`sepa_subfeld` //
CREATE FUNCTION `sepa_subfeld_nextpos`(intext text) RETURNS int(11)
DETERMINISTIC

BEGIN
 DECLARE pos integer;
 DECLARE npos integer;

 set pos=length(intext)+1;

 set npos=position('EREF+' in intext);
 if npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('KREF+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('MREF+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('CRED+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('DEBT+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('SVWZ+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 
 set npos=position('ABWA+' in intext);
 if  npos<>0 and npos<pos then set pos = npos; end if; 

 RETURN pos;
END //

CREATE FUNCTION `sepa_subfeld`(feld char(4),intext text) RETURNS text 
DETERMINISTIC
BEGIN
  DECLARE res text;
  DECLARE pos integer;
  DECLARE stoppos integer;
  SET pos = position(concat(feld,'+') in intext);
  IF pos=0 THEN RETURN ''; END IF;

  SET stoppos = sepa_subfeld_nextpos(SUBSTRING(intext,pos+5));


  RETURN substring(intext,pos+5,stoppos-1);
END //