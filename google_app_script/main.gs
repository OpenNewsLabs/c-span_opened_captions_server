/*
* A script to add captions from C-Span channel to a google doc every 1 minute.
* More details on overall project on github https://github.com/OpenNewsLabs/c-span_opened_captions_server 
* www.openedcaptions.com routes captions from C-Span 1 channel to socket end point. 
* an itnermediate server is needed to buffer text from socket and expose a REST API end point. 
* This script reads from the intermedia server and adds the content to a google doc.
* Because the intermediate server used for buffering supports reading from a charachter offest from the start of the stream.
* we use a using Global variables in google app script to keep track of the offset. 
* This way each new request, every minute, gets only the latest text added from previous request.
* https://deveopers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
* to reset the project property for offset global variable before running the script go in FILE -> PROJECT PROPERTIES -> SCRIPT PROPERTIES and modify offset value to Zero.
* to start and keep running at regular one minute intervalls. go under RESOURCES -> ALL YOUR TRIGGERS and add myFunction to a time driven event for a 1 minute intervall.
* see readme for more comprehesive instructions on how to set up the project.
* author: Pietro Passarelli - @pietropassarell. pietro.passarelli@gmail.com, pietropassarelli@voxmedia.com 
*/



//https://stackoverflow.com/questions/24721226/how-to-define-global-variable-in-google-apps-script
var offset = PropertiesService.getScriptProperties().getProperty('offset') || 0 ;

// explained in the github repo for the project, currently using ngrok to prototype.
// before getting started replace this with the URL of the REST end point of the intermediate server that does the buffering
var openedCaptionsIntermediateEndPointEndServer = 'http://c3d6d9e8.ngrok.io'; 

// main function of google app script 
function myFunction() {
  // Fetch plain text data from intermediate buffer server with char offset.
  var response = fetchData(openedCaptionsIntermediateEndPointEndServer+"?offset="+offset); 
  
  // updating global var for char offset at document level. 
  // global var properties stored as string, converting to int to add response carachter length 
  PropertiesService.getScriptProperties().setProperty('offset', parseInt(offset) + parseInt(response.length));
  
  //append to google doc
  appendToDocument(response);
}

/*
* Append to the google document
*/
function appendToDocument(textToAdd){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  // Insert paragraph of text at the end of the document.
  body.appendParagraph(formatText(textToAdd));
}


/*
* read rest API endpoint and returns content
*/
function fetchData(url){
  var response = UrlFetchApp.fetch(url);
  return response.getContentText("UTF-8");
}

/*
* format text for google doc.
* This could maybe moved to the intermediate server?
*/
function formatText(text){
  //add line breaks for occurences of`>>`
  var res = text.replace(/>>/g, "\n\n")
  //capitalize any line after `.`
  
  //put [applause] on it's own line with spaces before and after
  //res = res.replace(/[applause]/g, "\n[applause]\n")
  
  return res;
}
