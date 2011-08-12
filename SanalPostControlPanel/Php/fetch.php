<?php
require_once 'connection.php';
function mysql_fetch_all($search) {
$all = array();
while ($row = mysql_fetch_assoc($search)){ $all[] = $row; }
return $all;
} 
if(key_exists("xmlcategory",$_GET) && $_GET["xmlcategory"]=="true")
{
$xmlDocName=$_GET["xmldocName"];    
$query="Select * from cscart_xml_category WHERE 1=1 and xmlDocName='$xmlDocName' and status=0 ";
if(key_exists("query",$_POST) && strlen($_POST["query"])>0){
$searchInfo=$_POST["query"];
$query.=" and categoryName Like '%".$searchInfo."%'";
}
$result=mysql_query($query);
$response['result'] = mysql_fetch_all($result);
$response['query'] = $query;
$response['totalCount'] = mysql_num_rows($result);		
echo json_encode($response);
}else if(key_exists("eventcategory",$_GET) && $_GET["eventcategory"]=="true")
{
$query="Select d.category, d.category_id as id from cscart_categories c
INNER JOIN cscart_category_descriptions d ON (d.category_id=c.category_id)
WHERE 1=1";

$result=mysql_query($query);
$response['result'] = mysql_fetch_all($result);
$response['query'] = $query;
$response['totalCount'] = mysql_num_rows($result);
echo json_encode($response);
}else if(key_exists("event",$_GET) && $_GET["event"]=="true")
{

$xmlDocName=$_GET["xmlDocName"];

$query="Select m.xmlCategoryId as xmlCategoryID  ,	m.categoryId as DBCategoryID , m.id, m.xmlCategoryName, m.karOrani, c.category as dbCategoryName  from cscart_category_descriptions c
INNER JOIN cscart_xml_matchcategory m ON (m.categoryId=c.category_id)
WHERE m.xmlDocName='$xmlDocName'";

$result=mysql_query($query);
$response['result'] = mysql_fetch_all($result);
$response['query'] = $query;
$response['totalCount'] = mysql_num_rows($result);
echo json_encode($response);
}
?>