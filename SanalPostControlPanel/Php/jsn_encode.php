<?php
function jsn_encode($array,$input="ISO-8859-9"){
		function encode(&$item, $key){
			global $input;
			$item = iconv($input,"UTF-8",$item);
		}
		array_walk_recursive($array, 'encode');
		return json_encode( $array );
	}