<?php

	if( ! $con = mysql_connect("localhost", "root", "164384") )

	{	

		die( "Can't connect: " . mysql_error()	);

	}					

	mysql_select_db("urunsepetim_com", $con);

    mysql_query("SET NAMES 'utf8'");

?>