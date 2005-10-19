function openWindow(theURL,winName,features) {
	  window.open(theURL,winName,features);
}


//click on row
function clickIt(theTR,theevent,disablectrl){
	var ctrlkeydown=false;
	var shiftkeydown=false;
	// stupid browser incompatibilities...//
	if(!disablectrl) {
		if (navigator.userAgent.toLowerCase().indexOf("msie")!=-1)
			theevent=window.event
		ctrlkeydown=theevent.ctrlKey;
		shiftkeydown=theevent.shiftKey;
	}

	if(!ctrlkeydown && !shiftkeydown) {
		selIDs= new Array();
		var theTable=theTR.parentNode;
		for(i=0;i<theTable.childNodes.length;i++){
			if (theTable.childNodes[i]!=theTR && theTable.childNodes[i].className){
				theTable.childNodes[i].className="qr"+theTable.childNodes[i].className.charAt(theTable.childNodes[i].className.length-1);
			}
		}
	}
	
	var theID=theTR.id.substr(2,theTR.id.length-1);

	if(!ctrlkeydown && shiftkeydown){
		//Need to program shift click in here!
		var curID=null;
		var theTable=theTR.parentNode;
		var searchArray="+"+selIDs.join("+")+"+";
		var point1=null;
		var point2=null;
		
		for(i=0;i<theTable.childNodes.length;i++){
			if (theTable.childNodes[i].className){
				theTable.childNodes[i].className="qr"+theTable.childNodes[i].className.charAt(theTable.childNodes[i].className.length-1);
				curID=theTable.childNodes[i].id.substr(2);
				if(curID==theID)
					point1=i;
				if(searchArray.indexOf("+"+curID+"+")!=-1 && point2==null) {
					point2=i;
				}
			}
		}
		var theStart;
		var theStop;
		if (point1>point2){
			theStart=point2;
			theStop=point1
		} else {
			theStart=point1;
			theStop=point2
		}
		selIDs= new Array();
		for(i=theStart;i<=theStop;i++){
			if (theTable.childNodes[i].className){
				theTable.childNodes[i].className="qh"+theTable.childNodes[i].className.charAt(theTable.childNodes[i].className.length-1);
				selIDs[selIDs.length]=theTable.childNodes[i].id.substring(2);
			}
		}
		
	} else {
	
		// need to find the checkbox that the TR contains
		var newClass="";
		var i;
		if (theTR.className.charAt(1)=="h"){
			//highlighted... unhighlight it
			newClass="qr"+theTR.className.charAt(theTR.className.length-1);
			for(i=0;i<selIDs.length;i++)
				if(selIDs[i]==theTR.id.substring(2)) selIDs.slice(i,1);
		} else {
			//highlight it
			newClass="qh"+theTR.className.charAt(theTR.className.length-1);
			selIDs[selIDs.length]=theTR.id.substring(2);
		}
		theTR.className=newClass;
	
		var disabledstatus=(selIDs.length==0);
		setButtonStatus(disabledstatus);
	}
}

function setSelIDs(theform){
	if(selIDs.length)
		theform["theids"].value=selIDs.join(",");
}

function chooseOtherCommand(theselect){
	if (theselect.value!="delete_record") {
		setSelIDs(theselect.form);
		theselect.form.submit();
	} else {
		var confirmcommand=theselect.options[theselect.selectedIndex].text
		theselect.selectedIndex=0;
		confirmDelete(confirmcommand);		
	}
}

function confirmDelete(deletename){
	var howmany=selIDs.length+" selected record";
	if(selIDs.length!=1)
		howmany+="s"
	var content="<div>Are you sure you want to "+deletename+" the "+howmany+"?</div>";
		content+="<div align=\"right\"><input type=\"button\" class=\"\Buttons\" style=\"width:75px;margin-right:2px;\" value=\"yes\" onClick=\"doDelete()\" /><input type=\"button\" class=\"\Buttons\" style=\"width:75px;\" value=\"no\" onClick=\"closeModal()\" /></div>"	
	showModal(content,"Confirm",300) ;
}

function doDelete(){
	var thedelete=getObjectFromID("deleteCommand");
	thedelete.value="delete";
	setSelIDs(thedelete.form);
	thedelete.form.submit();	
}

function setButtonStatus(disabledstatus){
	var editButton=getObjectFromID("edit");
	var printButton=getObjectFromID("print");
	var deleteButton=getObjectFromID("delete");
	var otherCommands=getObjectFromID("othercommands");
	var relationship=getObjectFromID("relationship");
		
	if(editButton){
		editButton.disabled=disabledstatus;
		editButton.firstChild.src=(disabledstatus)?editButtonImgDisabled.src:editButtonImg.src;
	}
	if(printButton){
		printButton.disabled=disabledstatus;
		printButton.firstChild.src=(disabledstatus)?printButtonImgDisabled.src:printButtonImg.src;
	}
	if(deleteButton){
		deleteButton.disabled=disabledstatus;
		deleteButton.firstChild.src=(disabledstatus)?deleteButtonImgDisabled.src:deleteButtonImg.src;
	}
	if(otherCommands) otherCommands.disabled=disabledstatus;
	if(relationship) relationship.disabled=disabledstatus;
}


//double click on row
function editThis(therow){
	if(therow){
		// the row is used for doubleclicking
		var therownum=therow.id.substr(2);
		selIDs=new Array();
		selIDs[0]=therownum;
	}
	if (editFile.indexOf("?")>=0)
		editFile+="&";
	else
		editFile+="?";
	editFile+="id="+selIDs[0];
	document.location=editFile;
}


// Select All/None Button
function selectRecords(allornone){
	if(allornone=="All") allornone=false; else allornone=true;
	var newClass="qr";
	if(!allornone) newClass="qh";
	selIDs= new Array();
	
	theTable=getObjectFromID("queryresults").firstChild;
	for(var i=0;i<theTable.childNodes.length;i++){
		if(theTable.childNodes[i].className){
			theTable.childNodes[i].className=newClass+theTable.childNodes[i].className.charAt(theTable.childNodes[i].className.length-1);
			if(!allornone)
				selIDs[selIDs.length]=theTable.childNodes[i].id.substring(2);
		}
	}
	setButtonStatus(allornone);
}

// Pass the Sort Parameters and subit the form
function doSort(i){
	var theform=document.forms["search"];
	theform["newsort"].value=theform["sortit"+i].value;
	theform.submit();
	return false;
}

// Pass the Sort Parameters and subit the form
function doDescSort(){
	theform=document.forms["search"];
	theform["desc"].value="desc";
	theform.submit();
	return false;
}

function setMainFocus(){
	var startswithfield=getObjectFromID("startswith");
	startswithfield.focus();
}

function perfromToSelection(theselect){		
	var thereset=getObjectFromID("reset");
	switch(theselect.value){
		case"":
			theselect.selectedIndex=0;
		break;
		case "selectall":
			selectRecords("All");
			theselect.selectedIndex=0;
		break;
		case "selectnone":
			selectRecords("None");
			theselect.selectedIndex=0;
		break;
		case "keepselected":
			if(selIDs.length>0){
				thereset.value="keep"
				thereset.click();
			} else {
			alert("You must select records first.");
			theselect.selectedIndex=0;			
			}
		break;
		case "omitselected":
			if(selIDs.length>0){
				thereset.value="omit"
				thereset.click();
			} else {
			alert("You must select records first.");
			theselect.selectedIndex=0;			
			}
		break;
	}
}

function changeSelection(optionValue){
	var theselect=getObjectFromID("searchSelection");
	var i;	
	for(i=0;i<theselect.options.length;i++){
		if(theselect.options[i].value==optionValue)
			theselect.selectedIndex=i
	}
	perfromToSelection(theselect);
}

function switchSearchTabs(taba,base){
	if(taba.parentNode.className=="searchtabsSel")
		return false;
		
	var basicTab=getObjectFromID("basicSearchT");
	var advancedTab=getObjectFromID("advancedSearchT");
	var loadTab=getObjectFromID("loadSearchT");
	var saveTab=getObjectFromID("saveSearchT");
	var sortTab=getObjectFromID("advancedSortT");
	
	basicTab.className="";
	if(advancedTab) advancedTab.className="";
	loadTab.className="";
	saveTab.className="";
	sortTab.className="";
	
	taba.parentNode.className="searchtabsSel";

	basicTab=getObjectFromID("basicSearchTab");
	advancedTab=getObjectFromID("advancedSearchTab");
	loadTab=getObjectFromID("loadSearchTab");
	saveTab=getObjectFromID("saveSearchTab");
	sortTab=getObjectFromID("advancedSortTab");

	basicTab.style.display="none";
	if(advancedTab) advancedTab.style.display="none";
	loadTab.style.display="none";
	saveTab.style.display="none";
	sortTab.style.display="none";

	var theURL;
	switch(taba.parentNode.id){
		case "basicSearchT":
			basicTab.style.display="block";			
		break;
		case "advancedSearchT":
			if(advancedTab.innerHTML==""){
				var tabledefid=getObjectFromID("tabledefid");
				advancedTab.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
				advancedTab.style.display="block";			
				theURL=base+"advancedsearch.php?cmd=show&base="+encodeURI(base)+"&tid="+tabledefid.value;
				loadXMLDoc(theURL,null,false);
				advancedTab.innerHTML=req.responseText;						
				ASParams= [1];
			} else
			advancedTab.style.display="block";
		break;
		case "loadSearchT":
			if(loadTab.innerHTML==""){
				var tabledefid=getObjectFromID("tabledefid");
				loadTab.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
				loadTab.style.display="block";			
				theURL=base+"loadsearch.php?cmd=show&base="+encodeURI(base)+"&tid="+tabledefid.value;
				loadXMLDoc(theURL,null,false);
				loadTab.innerHTML=req.responseText;
			} else
			loadTab.style.display="block";
		break;
		case "saveSearchT":
			var searchbutton=getObjectFromID("saveSearch");
			var searchtext=getObjectFromID("saveSearchName");
			var searchstatus=getObjectFromID("saveSearchReults");	
			if(searchstatus.innerHTML!=""){
				searchbutton.disabled=true;
				searchtext.value="";
				searchstatus.className="";
				searchstatus.innerHTML="";
			}
			saveTab.style.display="block";			
		break;
		case "advancedSortT":
			if(sortTab.innerHTML==""){
				var tabledefid=getObjectFromID("tabledefid");
				sortTab.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
				sortTab.style.display="block";			
				theURL=base+"advancedsort.php?cmd=show&base="+encodeURI(base)+"&tid="+tabledefid.value;
				loadXMLDoc(theURL,null,false);
				sortTab.innerHTML=req.responseText;						
				SortParams= [1];
				updateSort();
			} else
			sortTab.style.display="block";			
		break;
	}
}

function showSQL(thebutton){
		var sqlSpan=getObjectFromID("sqlstatement");
		if (sqlSpan.style.display=="block"){
			sqlSpan.style.display="none";
			thebutton.firstChild.src=sqlButtonUp.src
		} else{
			sqlSpan.style.display="block";
			thebutton.firstChild.src=sqlButtonDn.src
		}
}

// Advanced Search Functions ==========================================
function updateAS(){
	var tempMinus;	
	if(ASParams.length>1){
		tempMinus=getObjectFromID("ASC"+ASParams[0]+"minus")
		tempMinus.firstChild.src=buttonMinusEnabled.src;
	}
	var tempText;
	var tempField;
	var tempOperator;
	var sqlText="";
	var andor=getObjectFromID("ASanyall");
	for(var i=0;i<ASParams.length;i++){
		tempField=getObjectFromID("ASC"+ASParams[i]+"field");
		tempOperator=getObjectFromID("ASC"+ASParams[i]+"operator");
		tempText=getObjectFromID("ASC"+ASParams[i]+"text");
		var myText=tempText.value.replace("\"","\\\"");
		if(myText!="")
			sqlText+=" "+andor.value+" "+tempField.value+" "+tempOperator.value+" \""+myText+"\"";
	}
	sqlText=sqlText.substring(andor.value.length+1);
	var searchButton=getObjectFromID("ASsearchbutton");
	if(sqlText!="")
		searchButton.disabled=false;
	else
		searchButton.disabled=true;	
	var sqlBox=getObjectFromID("ASSQL");
	sqlBox.value=sqlText;
}

function ASEnableSave(thetextarea){
	var searchButton=getObjectFromID("ASsearchbutton");
	if (thetextarea.value!="")
		searchButton.disabled=false;
	else
		searchButton.disabled=true;	
}

function addlineAS(){
	var tempMinus=getObjectFromID("ASC"+ASParams[0]+"minus");
	if(tempMinus.firstChild.src==buttonMinusDisabled.src)
		tempMinus.firstChild.src=buttonMinusEnabled.src;
	var tempDiv=getObjectFromID("ASC"+ASParams[0]);
	var tempContent=tempDiv.innerHTML;
	var REcriteria = new RegExp("ASC"+ASParams[0],"g")
	tempContent=tempContent.replace(REcriteria,"ASC"+(ASParams[ASParams.length-1]+1))
		
	var newDiv=document.createElement("div");
	newDiv.id="ASC"+(ASParams[ASParams.length-1]+1);
	newDiv.innerHTML=tempContent;	
	
	var containerDiv=getObjectFromID("theASCs");
	containerDiv.appendChild(newDiv);
	var tempText=getObjectFromID("ASC"+(ASParams[ASParams.length-1]+1)+"text");
	tempText.value="";
	
	ASParams[ASParams.length]=ASParams[ASParams.length-1]+1;
}

function removeLineAS(thebutton){
	if(thebutton.firstChild.src==buttonMinusDisabled.src)
		return false;
	
	var theDiv=thebutton.parentNode;
		
	var containerDiv=getObjectFromID("theASCs");
	containerDiv.removeChild(theDiv);
	var theid=theDiv.id.replace(/ASC/g,"");
	theDiv=null;
	for(var i=0;i<ASParams.length;i++){
		if(ASParams[i]==theid){
			ASParams.splice(i,1);
			break;
		}
	}
	if(ASParams.length==1){
		var tempButton=getObjectFromID("ASC"+ASParams[0]+"minus");
		tempButton.firstChild.src=buttonMinusDisabled.src
	}
	updateAS();
}

function performAdvancedSearch(thebutton){
	var tempsqlBox=getObjectFromID("ASSQL");
	var realSQL=getObjectFromID("advancedsearch");
	realSQL.value=tempsqlBox.value;
	thebutton.form.submit();	
}

// Load Search Functions ==========================================
function LSsearchSelect(theselect,base){
	var loadbutton= getObjectFromID("LSLoad");
	var deletebutton= getObjectFromID("LSDelete");
	var searchname=getObjectFromID("LSSelectedSearch");
	var sqlbox=getObjectFromID("LSSQL");
	var reultbox=getObjectFromID("LSResults");
	if (theselect.value=="NA"){
		loadbutton.disabled=true;
		deletebutton.disabled=true;
		searchname.value="";
		sqlbox.value="";
	} else {
		reultbox.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
		var theURL=base+"loadsearch.php?cmd=getsearch&id="+theselect.value;
		loadXMLDoc(theURL,null,false);
		sqlbox.value=req.responseText;
		searchname.value=theselect.options[theselect.selectedIndex].text;
		loadbutton.disabled=false;
		var userPosStart=5000000;
		for(var i=0;i<theselect.options.length;i++)
			if(theselect.options[i].text.indexOf("user searches")!=-1)
				userPosStart=i;
		if(theselect.selectedIndex>userPosStart)
			deletebutton.disabled=false;
		else
			deletebutton.disabled=true;
		reultbox.innerHTML="";
	}	
}

function LSRunSearch(){
	var sqlbox=getObjectFromID("LSSQL");	
	var advancedsearch=getObjectFromID("advancedsearch");
	advancedsearch.value=sqlbox.value
	advancedsearch.form.submit();
}
function LSDeleteSearch(base){
	var theselect=getObjectFromID("LSList");
	var reultbox=getObjectFromID("LSResults");

	reultbox.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
	var theURL=base+"loadsearch.php?cmd=deletesearch&id="+theselect.value;
	loadXMLDoc(theURL,null,false);
	if(req.responseText=="success"){
		reultbox.innerHTML="";
		theselect.options[theselect.selectedIndex]=null;
		if(theselect.options.length==1){
			theselect.options[0].text="No Saved Searches";			
			theselect.disabled=true;
		}
		theselect.selectedIndex=0;
		LSsearchSelect(theselect,base);
	
	}
}

// Save Search Functions ==========================================

function enableSave(thetext){
	var searchbutton=getObjectFromID("saveSearch");
	if(thetext.value=="")
		searchbutton.disabled=true;
	else
		searchbutton.disabled=false;
} 

function saveMySearch(base){
	var searchtext=getObjectFromID("saveSearchName");
	var searchstatus=getObjectFromID("saveSearchReults");	
	var tabledefid=getObjectFromID("tabledefid");
	
	searchstatus.style.display="block";
	searchstatus.className="";
	searchstatus.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
	var theURL=base+"loadsearch.php?cmd=savesearch&name="+encodeURI(searchtext.value)+"&tid="+tabledefid.value;
	loadXMLDoc(theURL,null,false);
	searchstatus.innerHTML=req.responseText;
	searchstatus.className="standout";	
	
	loadTab=getObjectFromID("loadSearchTab");
	loadTab.innerHTML="";	
}

// Advanced Sort Functions ==========================================
function sortEnableButtons(thetextarea){
	
	var buttonRunSort=getObjectFromID("sortRunSort");
	var buttonSaveSort=getObjectFromID("sortSaveSort");
	var buttonClearSort=getObjectFromID("sortClearSort");
	if (thetextarea.value!="") {
		buttonRunSort.disabled=false;
		buttonSaveSort.disabled=false;
		buttonClearSort.disabled=false;
	}
	else{
		buttonRunSort.disabled=true;		
		buttonSaveSort.disabled=true;
		buttonClearSort.disabled=true;
	}
}

function clearSort(){
	var sqlBox=getObjectFromID("sortSQL");	
	sqlBox.value="";
	var containerDiv=getObjectFromID("theSorts");
	containerDiv.style.display="none";
	var tempbutton;
	for(var i=SortParams.length-1;i>0;i--){
		tempbutton=getObjectFromID("Sort"+SortParams[i]+"Minus");
		sortRemoveLine(tempbutton);
	}	
	containerDiv.style.display="block";
}

function updateSort(){
	var tempMinus;	
	if(SortParams.length>1){
		tempMinus=getObjectFromID("Sort"+SortParams[0]+"Minus")
		tempMinus.firstChild.src=buttonMinusEnabled.src;
		tempMinus=getObjectFromID("Sort"+SortParams[0]+"Down")
		tempMinus.firstChild.src=buttonDownEnabled.src;
	}
	var tempField;
	var tempOrder;
	var sqlText="";
	for(var i=0;i<SortParams.length;i++){
		tempField=getObjectFromID("Sort"+SortParams[i]+"Field");
		tempOrder=getObjectFromID("Sort"+SortParams[i]+"Order");
		sqlText+=", "+tempField.value+" "+tempOrder.value;
	}
	sqlText=sqlText.substring(2);

	var sqlBox=getObjectFromID("sortSQL");
	sqlBox.value=sqlText;
	sortEnableButtons(sqlBox);
}

function sortAddLine(){
	var tempMinus=getObjectFromID("Sort"+SortParams[0]+"Minus");
	if(tempMinus.firstChild.src==buttonMinusDisabled.src)
		tempMinus.firstChild.src=buttonMinusEnabled.src;

	var tempUp=getObjectFromID("Sort"+SortParams[0]+"Up");
	var tempDown=getObjectFromID("Sort"+SortParams[0]+"Down");
	tempDown.firstChild.src=buttonDownDisabled.src;
	tempUp.firstChild.src=buttonUpEnabled.src;

	var tempDiv=getObjectFromID("Sort"+SortParams[0]);
	var tempContent=tempDiv.innerHTML;
	var REcriteria = new RegExp("Sort"+SortParams[0],"g")
	tempContent=tempContent.replace(REcriteria,"Sort"+(SortParams[SortParams.length-1]+1))

	tempDown.firstChild.src=buttonDownEnabled.src;
	tempUp.firstChild.src=buttonUpDisabled.src;
		
	var newDiv=document.createElement("div");
	newDiv.id="Sort"+(SortParams[SortParams.length-1]+1);
	newDiv.innerHTML=tempContent;	
	
	var containerDiv=getObjectFromID("theSorts");
	containerDiv.appendChild(newDiv);
	
	SortParams[SortParams.length]=SortParams[SortParams.length-1]+1;
	for(var i=1;i<SortParams.length-1;i++){
		tempDown=getObjectFromID("Sort"+SortParams[i]+"Down");
		tempDown.firstChild.src=buttonDownEnabled.src;		
	}
	updateSort();
}

function sortRemoveLine(thebutton){
	if(thebutton.firstChild.src==buttonMinusDisabled.src)
		return false;
	
	var theDiv=thebutton.parentNode;
		
	var containerDiv=getObjectFromID("theSorts");
	containerDiv.removeChild(theDiv);
	var theid=theDiv.id.replace(/Sort/g,"");
	theDiv=null;
	for(var i=0;i<SortParams.length;i++){
		if(SortParams[i]==theid){
			SortParams.splice(i,1);
			break;
		}
	}
	if(SortParams.length==1){
		var tempButton=getObjectFromID("Sort"+SortParams[0]+"Minus");
		tempButton.firstChild.src=buttonMinusDisabled.src
		tempButton=getObjectFromID("Sort"+SortParams[0]+"Up");
		tempButton.firstChild.src=buttonUpDisabled.src
	}
	var tempDown=getObjectFromID("Sort"+SortParams[SortParams.length-1]+"Down");
	tempDown.firstChild.src=buttonDownDisabled.src;		

	updateSort();
}

function sortMove(thebutton,direction){
	if(thebutton.firstChild.src==buttonUpDisabled.src || thebutton.firstChild.src==buttonDownDisabled.src)
		return false;
	if(direction=="up")
		direction=-1;
	else
		direction=1;
	
	var theDiv=thebutton.parentNode;
	var theid=theDiv.id.replace(/Sort/g,"");
	
	var containerDiv=getObjectFromID("theSorts");
	containerDiv.removeChild(theDiv);
	
	for(var i=0;i<SortParams.length;i++)
		if(SortParams[i]==theid){
			var mypos=i;
			var movetopos=i+direction;
		}
	var moveto;
	if (direction==1)
		moveto=movetopos+1;
	else
		moveto=movetopos;
		
	var movetodiv=getObjectFromID("Sort"+SortParams[moveto]);
	containerDiv.insertBefore(theDiv,movetodiv);
	SortParams[mypos]=SortParams[movetopos];
	SortParams[movetopos]=theid;
	updateSort();
	
	var tempUp=getObjectFromID("Sort"+SortParams[0]+"Up");
	var tempDown=getObjectFromID("Sort"+SortParams[0]+"Down");
	tempUp.firstChild.src=buttonUpDisabled.src;
	tempDown.firstChild.src=buttonDownEnabled.src;
	
	for(var i=1;i<SortParams.length-1;i++){
		tempUp=getObjectFromID("Sort"+SortParams[i]+"Up");
		tempDown=getObjectFromID("Sort"+SortParams[i]+"Down");
		tempUp.firstChild.src=buttonUpEnabled.src;
		tempDown.firstChild.src=buttonDownEnabled.src;
	}
	
	tempUp=getObjectFromID("Sort"+SortParams[SortParams.length-1]+"Up");
	tempDown=getObjectFromID("Sort"+SortParams[SortParams.length-1]+"Down");
	tempUp.firstChild.src=buttonUpEnabled.src;
	tempDown.firstChild.src=buttonDownDisabled.src;
	
}

function performAdvancedSort(thebutton){
	var advancedsort=getObjectFromID("advancedsort");
	var sortSQL=getObjectFromID("sortSQL");
	advancedsort.value=sortSQL.value;
	thebutton.form.submit();
}

function sortEnableSave(thetext){
	var savebutton=getObjectFromID("sortDoSave");
	if(thetext.value=="")
		savebutton.disabled=true;
	else
		savebutton.disabled=false;
}
function sortAskSaveName(base){
	var text="<div>name<br /><input id=\"sortSaveName\" type=\"text\" maxlength=\"128\" length=\"40\" onKeyUp=\"sortEnableSave(this)\" style=\"width:98%\" /></div>";
	text+="<div align=\"right\"><input type=\"button\" class=\"Buttons\" id=\"sortDoSave\" onClick=\"sortSave('"+base+"')\" value=\"save\" style=\"width:75px\" disabled=\"true\"/>";
	text+="<input type=\"button\" class=\"Buttons\" onClick=\"closeModal()\" value=\"cancel\" style=\"margin-left:5px;width:75px\"/></div>"
	showModal(text,"Save Sort As...",250);
}

function sortSave(base){
	var sortName=getObjectFromID("sortSaveName");
	var sql=getObjectFromID("sortSQL");
	var tabledefid=getObjectFromID("tabledefid");
	var theURL=base+"advancedsort.php?cmd=save&name="+encodeURI(sortName.value)+"&clause="+sql.value+"&tid="+tabledefid.value;
	loadXMLDoc(theURL,null,false);
	closeModal();
	if(req.responseText!="success")
	alert("Error:<br />"+req.responseText);
}

function sortAskLoad(base){
	var tabledefid=getObjectFromID("tabledefid");
	var theURL=base+"advancedsort.php?cmd=showSaved&tid="+tabledefid.value+"&base="+encodeURI(base);
	var text="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
	showModal(text,"Saved Sorts",350);
	loadXMLDoc(theURL,null,false);
	var modalContent=getObjectFromID("modalContent");
	modalContent.innerHTML=req.responseText;
}

function sortSavedSelect(theselect){
	var deletebutton=getObjectFromID("sortSavedDeleteButton");
	var loadbutton=getObjectFromID("sortSavedLoadButton");
	if(theselect.value!="NA"){
		var userPosStart=5000000;
		for(var i=0;i<theselect.options.length;i++)
			if(theselect.options[i].text.indexOf("user sorts")!=-1)
				userPosStart=i;
		if(theselect.selectedIndex>userPosStart)
			deletebutton.disabled=false;
		else
			deletebutton.disabled=true;
		loadbutton.disabled=false;
	} else{
		deletebutton.disabled=true;
		loadbutton.disabled=true;
	}
}

function sortSavedDelete(base){
	var theselect=getObjectFromID("sortSavedList");
	var modalContent=getObjectFromID("modalContent");
	var theURL=base+"advancedsort.php?cmd=deleteSaved&id="+theselect.value;
	modalContent.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";
	loadXMLDoc(theURL,null,false);

	if (req.responseText=="success"){
		var tabledefid=getObjectFromID("tabledefid");
		theURL=base+"advancedsort.php?cmd=showSaved&tid="+tabledefid.value+"&base="+encodeURI(base);
		loadXMLDoc(theURL,null,false);
		modalContent.innerHTML=req.responseText;
	} else 
		modalContent.innerHTML=req.responseText;
}

function sortSavedLoad(base){
	var theselect=getObjectFromID("sortSavedList");	
	var modalContent=getObjectFromID("modalContent");
	var theURL=base+"advancedsort.php?cmd=loadSaved&id="+theselect.value;
	modalContent.innerHTML="<img src=\""+base+"common/image/spinner.gif\" alt=\"0\" width=\"16\" height=\"16\" align=\"absmiddle\"> <strong>Loading...</strong>";

	loadXMLDoc(theURL,null,false);
	var sortSQL=getObjectFromID("sortSQL");
	sortSQL.value=req.responseText;	
	var containerDiv=getObjectFromID("theSorts");
	containerDiv.style.display="none";

	closeModal();
}