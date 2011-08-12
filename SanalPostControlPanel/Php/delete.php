<?php
require_once 'connection.php';

function mysql_fetch_all($search) {
$all = array();
while ($row = mysql_fetch_assoc($search)){ $all[] = $row; }
return $all;
}

if(key_exists("event",$_GET) && $_GET["event"]=="true")
{
$etkinlikID=$_POST["etkinlikId"];
$query="DELETE FROM etkinlik WHERE id='$etkinlikID'";
$result=mysql_query($query);
$response['success'] = $result;	
echo json_encode($response);
}
elseif(key_exists("eventDetail",$_GET) && $_GET["eventDetail"]=="true")
{
$etkinlikDetailId=$_POST["etkinlikDetailId"];
$query="DELETE FROM etkinlikdetay WHERE id='$etkinlikDetailId'";

$result=mysql_query($query);
$response['success'] = $result;	
echo json_encode($response);
}
elseif(key_exists("authorized",$_GET) && $_GET["authorized"]=="true")
{
$authorizedId=$_POST["authorizedId"];
$query="DELETE FROM etkinliksahibi WHERE id='$authorizedId'";

$result=mysql_query($query);
$response['success'] = $result;	
echo json_encode($response);
}

?>