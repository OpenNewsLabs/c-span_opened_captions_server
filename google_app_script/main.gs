/*
* A script to add captions from C-Span channel to a google doc every 1 minute.
* More details on overall project on github https://github.com/OpenNewsLabs/c-span_opened_captions_server 
* [CSPan live stream](http://www.stream2watch.cc/live-television/united-states/c-span-live-stream) to check against captions.
*
* www.openedcaptions.com routes captions from C-Span 1 channel to socket end point.
* an itnermediate server is needed to buffer text from socket and expose a REST API end point.
* This script reads from the intermedia server and adds the content to a google doc.
* The intermediate server used for buffering supports reading from a charachter offest from the start of the stream.
* we use a Global variable in google app script to keep track of the offset.
* This way each new request, every minute, gets only the latest text added from previous request.
* https://deveopers.google.com/apps-script/guides/triggers/installable#time-driven_triggers
*
* Reset offset global variable
* to reset the project property for offset global variable before running the script go in FILE -> PROJECT PROPERTIES -> SCRIPT PROPERTIES and modify offset value to Zero.
*
* start 1 minute trigger
* to start and keep running at regular one minute intervalls. go under RESOURCES -> ALL YOUR TRIGGERS and add updateCaptions to a time driven event for a 1 minute interval.
*
* see readme for more comprehesive instructions on how to set up the project.
*
* author: Pietro Passarelli - @pietropassarell. pietro.passarelli@gmail.com, pietropassarelli@voxmedia.com 
*/

// explained in the github repo for the project, currently using ngrok to prototype.
// before getting started replace this with the URL of the REST end point of the intermediate server that does the buffering
var capServer = 'https://vox-cspan-captions.herokuapp.com/';

/*
* main function of google app script
* gets data from intermediate buffer server from latest offset.
* updates offset
* appends text to document
*/
function updateCaptions() {
  // Fetch plain text data from intermediate buffer server with char offset.
  var response = fetchData(capServer + "?since=" + getSavedPlace());

  // updating global var for char offset at document level.
  // global var properties stored as string, converting to int to add response carachter length 
  savePlace(response.now);

  //append to google doc
  appendToDocument(response.captions);
}

/*
* Append to the google document
*/
function appendToDocument(textToAdd){
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  // Insert paragraph of text at the end of the document.
  body.appendParagraph(textToAdd);
}

/*
* read rest API endpoint and returns content
*/
function fetchData(url){
  var response = UrlFetchApp.fetch(url);
  return JSON.parse(response.getContentText("UTF-8"));
}

function resetPlace() {
  savePlace(0);
}

function savePlace(timestamp) {
  PropertiesService.getScriptProperties().setProperty('last_check', timestamp.toString());
}

function getSavedPlace() {
  // https://stackoverflow.com/questions/24721226/how-to-define-global-variable-in-google-apps-script
  return PropertiesService.getScriptProperties().getProperty('last_check') || '0';
}
