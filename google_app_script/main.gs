/*
* OpenedCaption intermedia server, reads from openedcaptions.com socket connection, buffers/saves text locally and makes it available as a REST API end point
* Project on github https://github.com/OpenNewsLabs/c-span_opened_captions_server 
*/

//this supports reading from characte offest from start of the stream.
//see using Global variables in google app script 
//https://stackoverflow.com/questions/24721226/how-to-define-global-variable-in-google-apps-script
var offset = PropertiesService.getScriptProperties().getProperty('offset') || 0 ;

//replace this with the URL of the REST end point of the intermediate script.
//see readme for how to set it up 
var openedCaptionsIntermediateEndPointEndServer = 'http://c3d6d9e8.ngrok.io'; //'http://openedcaptions.com';

//for time trigger every minute using
//https://deveopers.google.com/apps-script/guides/triggers/installable#time-driven_triggers

function myFunction() {
  // The code below logs the HTML code of the Google home page.
  var response = fetchData(openedCaptionsIntermediateEndPointEndServer+"?offset="+offset); 
  //offset += response.length;
  
  //global var properties stored as string, converting to int to add response carachter length 
  PropertiesService.getScriptProperties().setProperty('offset', parseInt(offset) + parseInt(response.length));
  Logger.log("offset");
  Logger.log(offset)
  Logger.log(response);;
 
  //append to google doc
  appendTextToDocument(response+"\n CALLED"+offset+"\n\n");
}

/*
* Append plain text to the google document
*/
function appendTextToDocument(textToAdd){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  // Use editAsText to obtain a single text element containing
  // all the characters in the document.
  //var text = body.editAsText();
  // Insert text at the end of the document.
  //text.appendText(textToAdd);
  body.appendParagraph(textToAdd);
}


/*
* read rest API endpoint
* saves char offest in glogbal var to know where to start of on next call. 
*/
function fetchData(url){
  var response = UrlFetchApp.fetch(url);
  //Logger.log(response);
  return response.getContentText("UTF-8");
}

function formatText(text){
  //add line breaks for occurences of`>>`
  
  //capitalize any line after `.`
  
  //put [applause] on it's own line with spaces before and after
}
