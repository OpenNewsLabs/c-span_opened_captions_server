# Opened captions server for google docs apps script

Work in progress. 

The aim is to make google script or a system that takes in captions coming from openedcaptions.com(https://openedcaptions.com) by Dan Schultz and adds them to a google docs untill you stop the script.

Issue: Google script can refresh like a cron job stile only every minute, so it might make it challenging to pull from the openedcaptions server. There is the need for an intermediate server to buffer the text (which is what this repo is doing). 

For the Google app script it be similar to the [NPR on github](https://github.com/nprapps/debates) from [their live fact checking debate](https://source.opennews.org/en-US/articles/how-npr-transcribes-and-fact-checks-debates-live/ )

## Opened Captions
Some more details on 

>Opened Captions: Turning the spoken words on TV screens into streams of hackable data

- [source piece](https://source.opennews.org/en-US/articles/introducing-opened-captions)

- [niemanlab](http://www.niemanlab.org/2012/12/opened-captions-turning-the-spoken-words-on-tv-screens-into-streams-of-hackable-data/)

>The result: Opened Captions. It provides a real-time API for closed captions pulled from C-SPAN. The system makes it possible to code against what’s being said on TV right now, and by solving this one really tricky problem, it makes a broad range of applications possible.
https://openedcaptions.com/ 

- [opened-captions-example](https://github.com/slifty/opened-captions-example) 
- [opened-captions](https://github.com/slifty/opened-captions)
- [CSPan live stream](http://www.stream2watch.cc/live-television/united-states/c-span-live-stream)



## Setup 
`npm install`

## run 
`npm start` it gets the stream from opencaptions and store into `transcription.txt`. It also opens a server on port `5000`


If you pass the querystring offset it offsets the string
enter with the browser to `localhost:5000` you get everything
`localhost:5000?offset=100` you get starting from the 101 character

## Connnect to google docs / Apps script
How would I connect this to the google doc?

So you can create your google apps script that just query this server every minute and append the data.

[as npr did](https://github.com/nprapps/debates/blob/master/google_apps_scripts/main.js) you run that time trigger which is like a cron
that pulls this server we just created.

(This part, the google app script to connect to the google doc, is still a work in progress)

### intermedia server
for buffering the text. 
run this server on a heroku instance or something similar. 

This is because opencaptions uses websockets and google apps script don't. otherwise it could be just an app script


## Contributors

[Dan Z](https://github.com/impronunciable)

[Pietro](https://github.com/pietrop)