<?PHP
// These following functions and processing are similar for all pages
//========================================================================================
//========================================================================================

//set table id
$tableid=7;

function getRecords($id){
//========================================================================================
	global $dblink;
	
	$querystatement="SELECT id, name, description, webenabled, webdisplayname,

				createdby, date_Format(creationdate,\"%c/%e/%Y %T\") as creationdate, 
				modifiedby, date_Format(modifieddate,\"%c/%e/%Y %T\") as modifieddate
				FROM productcategories
				WHERE id=".$id;		
	$thequery = mysql_query($querystatement,$dblink);
	$therecord = mysql_fetch_array($thequery);
	return $therecord;
}//end function


function setRecordDefaults(){
//========================================================================================
	$therecord["id"]=NULL;

	$therecord["name"]="";
	$therecord["webenabled"]=0;
	$therecord["description"]="";
	$therecord["webdisplayname"]="";

	$therecord["createdby"]=$_SESSION["userinfo"]["id"];
	$therecord["modifiedby"]=NULL;

	$therecord["creationdate"]=NULL;
	$therecord["modifieddate"]=NULL;

	return $therecord;	
}//end function


function updateRecord($variables,$userid){
//========================================================================================
	global $dblink;
	
	$querystatement="UPDATE productcategories SET ";
	
			$querystatement.="name=\"".$variables["name"]."\", "; 
			$querystatement.="description=\"".$variables["description"]."\", "; 
			
			if (!isset($variables["webenabled"])) $variables["webenabled"]=0;
			$querystatement.="webenabled=".$variables["webenabled"].", "; 
			$querystatement.="webdisplayname=\"".$variables["webdisplayname"]."\", "; 

	//==== Almost all records should have this =========
	$querystatement.="modifiedby=\"".$userid."\" "; 
	$querystatement.="WHERE id=".$variables["id"];
		
	$queryresult = mysql_query($querystatement,$dblink);
	if(!$queryresult) reportError(300,"Update Failed: ".mysql_error($dblink)." -- ".$querystatement);
}// end function


function insertRecord($variables,$userid){
//========================================================================================
	global $dblink;

	$querystatement="INSERT INTO productcategories ";
	
	$querystatement.="(name,description, webenabled, webdisplayname,
						createdby,creationdate,modifiedby) VALUES (";
	
			$querystatement.="\"".$variables["name"]."\", "; 
			$querystatement.="\"".$variables["description"]."\", "; 

			if (!isset($variables["webenabled"])) $variables["webenabled"]=0;
			$querystatement.=$variables["webenabled"].", "; 
			$querystatement.="\"".$variables["webdisplayname"]."\", "; 
				
	//==== Almost all records should have this =========
	$querystatement.=$userid.", "; 
	$querystatement.="Now(), ";
	$querystatement.=$userid.")"; 
	
	$queryresult = mysql_query($querystatement,$dblink);
	if(!$queryresult) reportError(300,"Insert Failed: ".mysql_error($dblink)." -- ".$querystatement);
	return mysql_insert_id($dblink);
}



//==================================================================
// Process adding, editing, creating new, canceling or updating
//==================================================================
if(!isset($_POST["command"])){
	if(isset($_GET["id"]))
		$therecord=getRecords($_GET["id"]);
	else
		$therecord=setRecordDefaults();
	$createdby=getUserName($therecord["createdby"]);
	$modifiedby=getUserName($therecord["modifiedby"]);
}
else
{
	switch($_POST["command"]){
		case "cancel":
			// if we needed to do any clean up (deleteing temp line items)
			if(!isset($_POST["id"])) $_POST["id"]=0;
			$theid=$_POST["id"];
			header("Location: ../../search.php?id=".$tableid."#".$theid);
		break;
		case "save":
			if($_POST["id"]) {
				updateRecord(addSlashesToArray($_POST),$_SESSION["userinfo"]["id"]);
				$theid=$_POST["id"];
				//get record
				$therecord=getRecords($theid);
				$createdby=getUserName($therecord["createdby"]);
				$modifiedby=getUserName($therecord["modifiedby"]);
				$statusmessage="Record Updated";
			}
			else {
				$theid=insertRecord(addSlashesToArray($_POST),$_SESSION["userinfo"]["id"]);
				//get record
				$therecord=getRecords($theid);
				$createdby=getUserName($therecord["createdby"]);
				$modifiedby=getUserName($therecord["modifiedby"]);
				$statusmessage="Record Created";
			}
		break;
	}
	
}
?>