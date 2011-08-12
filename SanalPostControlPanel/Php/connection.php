<?php
if( ! $con = mysql_connect("localhost", "root", "") )
	{	
		die( "Can't connect: " . mysql_error()	);
	}					
mysql_select_db("cart", $con);
mysql_query("SET NAMES 'utf8'");
?>