# Opened captions server for google apps script

## Setup 
`npm install`

## run 
`node index.js` it gets the stream from opencaptions and store into transcription.txt
it also opens a server on port `5000`


if you pass the querystring offset it offsets the string
 
like
enter with the browser to `localhost:5000`
you get everything
`localhost:5000?offset=100` you get starting from the 101 character

## Connnect to google docs / Apps script
how would I connect this to the google doc?

so you can create your google apps script that just query this server every minute and append the data

as npr did you run that time trigger which is like a cron
that pulls this server we just created.

### intermedia server
for buffering the text. 
run this server on a heroku instance or something similar. 

This is because opencaptions uses websockets and google apps script don't. otherwise it could be just an app script
