<link rel="stylesheet" type="text/css" href="deneme.css" />
<style type="text/css">
<?php

if( ! $con = mysql_connect("localhost", "root", "164384") )
	{	
		die( "Can't connect: " . mysql_error()	);
	}					
mysql_select_db("sanalPos", $con);
mysql_query("SET NAMES 'utf8'");

function mysql_fetch_all($search) {
	$all = array();
while (
     $row = mysql_fetch_assoc($search)){ 
	$all[] = $row; 
}
return $all;
}
?>
</style>
<script src="ApplicationJS/MainView.js?v=0.013" type="text/javascript"></script>
<script type="text/javascript"> 
Ext.onReady(function(){
	pageInit(); 
})
</script> 