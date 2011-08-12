<?php
require_once 'connection.php';

function mysql_fetch_all($search) {
$all = array();
while ($row = mysql_fetch_assoc($search)){ $all[] = $row; }
return $all;
}

if(key_exists("xmlInsertcategory",$_GET) && $_GET["xmlInsertcategory"]=="true")
{
$reader = new XMLReader();
$xmlDocName=$_GET["xmlDocName"];

if($xmlDocName=="and-outdoor.xml"){
$sonuc=false;
$filename = '../../xmlReader/and-outdoor/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT ){
    $name = $reader->name;
  }
    if (in_array($reader->nodeType, array(XMLReader::TEXT, XMLReader::CDATA, XMLReader::WHITESPACE, XMLReader::SIGNIFICANT_WHITESPACE)) && $name!=''){
        $value= $reader->value;
    }
        if($reader->value != ''){  
            if($name == 'CategoryID'){ $CategoryID =  $value;}
			if($name == 'CategoryName'){ $CategoryName = $value;} 
			if($name == 'ParentCategoryID'){ $ParentCategoryID =  $value;}
			if($name == 'ParentCategoryName'){ $ParentCategoryName = $value;}  				
        }
              

  if ($reader->nodeType == XMLReader::END_ELEMENT){
    $name = '';
    $value = '';
  }
    //when we reach the end of a node, we grab all the values and make a new bibtex entry
    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'Product'){
        $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        
        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }
        
		// alt kategorilerin eklenmesi icin yapildi begin
	
		if(strlen($ParentCategoryID)>0){
		$query="Select * from cscart_xml_category WHERE categoryName='$ParentCategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        
        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$ParentCategoryID','$ParentCategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }
		
		}
		// alt kategorilerin eklenmesi icin yapildi end
		
		
    }
}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="index-pazar.xml"){
$sonuc=false;
$filename = '../../xmlReader/index-pazar/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT) {
   if($reader->localName == 'KATEGORI') {
       $CategoryName=$reader->getAttribute('TANIM');
       $CategoryID=$reader->getAttribute('KOD');

       $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
       $result=mysql_query($query);
       $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

    }
}}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="spor-servisi.xml"){
$sonuc=false;
$filename = '../../xmlReader/spor-servisi-xml/kategoriler.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT ){
    $name = $reader->name;
  }
    if (in_array($reader->nodeType, array(XMLReader::TEXT, XMLReader::CDATA, XMLReader::WHITESPACE, XMLReader::SIGNIFICANT_WHITESPACE)) && $name!=''){
        $value= $reader->value;
    }
        if($reader->value != ''){
            if($name == 'kategoriid'){ $CategoryID = $value;}
            if($name == 'kategoriadi'){ $CategoryName =  $value;}
			if($name == 'parentid'){ $parentid = $value;}
        }


  if ($reader->nodeType == XMLReader::END_ELEMENT){
    $name = '';
    $value = '';
  }
    //when we reach the end of a node, we grab all the values and make a new bibtex entry
    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'kategori'){

       // if($parentid=="0"){
        $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

		//}

    }
}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="modaCar.xml"){
$sonuc=false;
$filename = '../../xmlReader/modacar/modacar.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT ){
    $name = $reader->name;
  }
    if (in_array($reader->nodeType, array(XMLReader::TEXT, XMLReader::CDATA, XMLReader::WHITESPACE, XMLReader::SIGNIFICANT_WHITESPACE)) && $name!=''){
        $value= $reader->value;
    }
        if($reader->value != ''){
            if($name == 'MainGroupCode'){ $CategoryID = $value;}
            if($name == 'MainGroup'){ $CategoryName =  $value;}
			if($name == 'EndGroupCode'){ $EndGroupCode = $value;}
            if($name == 'EndGroup'){ $EndGroup =  $value;}
			
			
        }


  if ($reader->nodeType == XMLReader::END_ELEMENT){
    $name = '';
    $value = '';
  }
    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'Product'){

        $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

		// alt kategorilerin eklenmesi icin yapildi begin
	
		if(strlen($EndGroupCode)>0){
		$query="Select * from cscart_xml_category WHERE categoryName='$EndGroup' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        
        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$EndGroupCode','$EndGroup','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }
		
		}
		// alt kategorilerin eklenmesi icin yapildi end
		
		

    }
}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="selayKimya.xml"){
$sonuc=false;
$filename = '../../xmlReader/selay-kimya/kategoriler.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT ){
    $name = $reader->name;
  }
    if (in_array($reader->nodeType, array(XMLReader::TEXT, XMLReader::CDATA, XMLReader::WHITESPACE, XMLReader::SIGNIFICANT_WHITESPACE)) && $name!=''){
        $value= $reader->value;
    }
        if($reader->value != ''){
            if($name == 'kategoriid'){ $CategoryID = $value;}
            if($name == 'kategoriadi'){ $CategoryName =  $value;}
	    if($name == 'parentid'){ $parentid = $value;}
        }


  if ($reader->nodeType == XMLReader::END_ELEMENT){
    $name = '';
    $value = '';
  }
    //when we reach the end of a node, we grab all the values and make a new bibtex entry
    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'kategori'){

        //if($parentid=="0"){
        $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

		//}

    }
}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="dogaEvinizde.xml"){
$sonuc=false;
$filename = '../../xmlReader/doga-evinizde/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT ){
    $name = $reader->name;
  }
    if (in_array($reader->nodeType, array(XMLReader::TEXT, XMLReader::CDATA, XMLReader::WHITESPACE, XMLReader::SIGNIFICANT_WHITESPACE)) && $name!=''){
        $value= $reader->value;
    }
        if($reader->value != ''){
            if($name == 'CategoryID'){ $CategoryID = $value;}
            if($name == 'CategoryName'){ $CategoryName =  $value;}
        }


  if ($reader->nodeType == XMLReader::END_ELEMENT){
    $name = '';
    $value = '';
  }
    //when we reach the end of a node, we grab all the values and make a new bibtex entry
    if ($reader->nodeType == XMLReader::END_ELEMENT && $reader->name == 'Product'){
        $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

		

    }
}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="despecPazar.xml"){
$sonuc=false;
$filename = '../../xmlReader/despecpazar/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT) {
   if($reader->localName == 'KATEGORI') {
       $CategoryName=$reader->getAttribute('TANIM');
       $CategoryID=$reader->getAttribute('KOD');

       $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
       $result=mysql_query($query);
       $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

    }
}}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="neoPazar.xml"){
$sonuc=false;
$filename = '../../xmlReader/neo-pazar/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT) {
   if($reader->localName == 'KATEGORI') {
       $CategoryName=$reader->getAttribute('TANIM');
       $CategoryID=$reader->getAttribute('KOD');

       $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
       $result=mysql_query($query);
       $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

    }
}}
$response['success'] = $sonuc;
echo json_encode($response);

}elseif($xmlDocName=="dgPazar.xml"){
$sonuc=false;
$filename = '../../xmlReader/dg-pazar/katalog.xml' ;  //Set the File Name
if(!$reader->open($filename)){ print "can't open file";}
while ($reader->read()) {
  if($reader->nodeType == XMLReader::ELEMENT) {
   if($reader->localName == 'KATEGORI') {
       $CategoryName=$reader->getAttribute('TANIM');
       $CategoryID=$reader->getAttribute('KOD');

       $query="Select * from cscart_xml_category WHERE categoryName='$CategoryName' and xmlDocName='$xmlDocName'";
       $result=mysql_query($query);
       $count=mysql_num_rows($result);

        if($count==0){
           $query="Insert Into cscart_xml_category (categoryId,categoryName,xmlDocName,status) VALUES('$CategoryID','$CategoryName','$xmlDocName','0')";
           $result=mysql_query($query);
           $sonuc=true;
        }

    }
}}
$response['success'] = $sonuc;
echo json_encode($response);

}



}else if(key_exists("saveDB",$_GET) && $_GET["saveDB"]=="true")
{
$sonuc=false;
$xmlDocName=$_GET["xmlDocName"];
if($xmlDocName=="and-outdoor.xml"){
$karOrani=$_POST["karOrani"];
$xmlCat=$_POST["xmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];

 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";
}else if($xmlDocName=="index-pazar.xml"){
$karOrani=$_POST["IndexPazarkarOrani"];
$xmlCat=$_POST["IndexPazarxmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}
else if($xmlDocName=="spor-servisi.xml"){
$karOrani=$_POST["sporServisikarOrani"];
$xmlCat=$_POST["sporServisixmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}else if($xmlDocName=="modaCar.xml"){
$karOrani=$_POST["modaCarkarOrani"];
$xmlCat=$_POST["modaCarxmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}else if($xmlDocName=="dogaEvinizde.xml"){
$karOrani=$_POST["dogaEvinizdekarOrani"];
$xmlCat=$_POST["dogaEvinizdexmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}else if($xmlDocName=="despecPazar.xml"){
$karOrani=$_POST["despecPazarkarOrani"];
$xmlCat=$_POST["despecPazarxmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}else if($xmlDocName=="neoPazar.xml"){
$karOrani=$_POST["neoPazarkarOrani"];
$xmlCat=$_POST["neoPazarxmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}else if($xmlDocName=="dgPazar.xml"){
$karOrani=$_POST["dgPazarkarOrani"];
$xmlCat=$_POST["dgPazarxmlCat"];
$xmlCategoryID=$_POST["xmlCategoryID"];
$DBCategoryID=$_POST["DBCategoryID"];


 $query="Select * from cscart_xml_matchcategory WHERE xmlCategoryId='$xmlCategoryID' and xmlDocName='$xmlDocName'";
        $result=mysql_query($query);
        $count=mysql_num_rows($result);
        if($count==0){
           $query="Insert Into cscart_xml_matchcategory (xmlCategoryId,categoryId,xmlDocName,xmlCategoryName,karOrani) VALUES('$xmlCategoryID','$DBCategoryID','$xmlDocName','$xmlCat','$karOrani')";
           $result=mysql_query($query);
           $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
           $result=mysql_query($query);
           $sonuc=true;
        }else
        {
          $query="UPDATE cscart_xml_matchcategory SET karOrani='$karOrani', categoryId='$DBCategoryID'  WHERE xmlCategoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $query="UPDATE cscart_xml_category SET status='1' WHERE categoryName='$xmlCat' and xmlDocName='$xmlDocName' ";
          $result=mysql_query($query);
          $sonuc=true;
        }
$result=1;
echo "{success:$result}";

}




}


?>