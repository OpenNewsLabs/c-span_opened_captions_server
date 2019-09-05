# Opened captions -> Google Doc

## Intermediate node buffer server + google docs apps script

The aim is to make a system that takes in captions coming from [openedcaptions.com](https://openedcaptions.com) (also on [github](https://github.com/slifty/opened-captions)) by Dan Schultz and adds them to a google doc in real time (or close enough) until you stop it.

Opened Captions provides a simple web socket/socket.io interface but a Google Apps script cannot consume a web socket. So provided here is a simple Node.js HTTP server that caches the stream and returns captions via a GET request.

This repo is already configured to be deployed to a Heroku instance. The app uses local memory to cache the captions, so it doesn't require a DBMS or cache daemon. However this also means that stopping, restarting or redeploying the server clears the caption cache.

Run this server on a heroku or EC2 instance or something similar. See below for details on running it locally and using [`ngrok`](#testing-app-script-using-ngrok) to access the local host end point from google docs app script.

## Opened Captions

Some more details on opened captions project for context.

>Opened Captions: Turning the spoken words on TV screens into streams of hackable data

- [source piece](https://source.opennews.org/en-US/articles/introducing-opened-captions)
- [niemanlab](http://www.niemanlab.org/2012/12/opened-captions-turning-the-spoken-words-on-tv-screens-into-streams-of-hackable-data/)

>The result: Opened Captions. It provides a real-time API for closed captions pulled from C-SPAN. The system makes it possible to code against what’s being said on TV right now, and by solving this one really tricky problem, it makes a broad range of applications possible.
https://openedcaptions.com/ 

- [github opened-captions-example](https://github.com/slifty/opened-captions-example) 
- [githib opened-captions](https://github.com/slifty/opened-captions)
- [CSPan live stream](http://www.stream2watch.cc/live-television/united-states/c-span-live-stream) to check against captions.

## Setup and run the server

Install dependencies:

```
npm install
```

To start the server:

```
npm start
```

The server starts on port 5000 and begins caching captions. You can set the port with the `PORT` environment variable. You can also have the server write the streamed captions to a file by providing the file name or path in the `TRANSCRIPT_FILE` environment variable. The server will also read this file into the cache on startup if the file exists.

The single API end point takes a `since` parameter which is a timestamp. The API response will include a `now` property which you should use for the next API request. The timestamp holds your place in the captions so subsequent requests will provide captions that can be appended to the captions recieved in previous requests.

First request:

```
GET /
```

or

```
GET /?since=0
```

which will return something like

```json
{
  "now": 123456789,
  "captions": "blah blah blah ..."
}
```

on the next request, include the last `now` value:

```
GET /?since=123456789
```

and you'll get a new timestamp and more captions to add to the last ones.

## Setup the google doc app script

How would I connect this to a google doc?

1. Create a google doc, and add a script to it. **tools** -> **script editor**
2. Copy and paste [./google_app_script/main.gs](./google_app_script/main.gs) into the google app script. 
3. Set the server url in the Google script to correspond to an instance of this Node app.

## Run the server locally and connect to Google Apps using ngrok

[ngrok](https://ngrok.com/) description:

>Don’t constantly redeploy your in-progress work to get feedback from clients. ngrok creates a secure public URL (https://yourapp.ngrok.io) to a local webserver on your machine. Iterate quickly with immediate feedback without interrupting flow.

1. To install `npm install -g ngrok`

2. To run, start ngrok forwarding  `ngrok http 5000`

3. This will give you a url like this [http://c8b8351d.ngrok.io/](http://c8b8351d.ngrok.io/) which you can add to the google app script, as described in next section. 

Alternatively you can deploy on an other server instance on heroku, EC2 etc.. and get that end point.

## Set google doc update every minute

Then to get things going setup a 1 minute triggered event in google app script  for `updateCaptions` under **Resources** -> **All your triggers**. More info on running a google app script every minute can be found in their [documentation](https://deveopers.google.com/apps-script/guides/triggers/installable#time-driven_triggers)

For troubleshooting, you can check against [C-SPAN live stream](https://www.c-span.org/networks/) or [opened captions](http:/www.openedcaptions.com).

## Contributors

The project is currently in active development, feel free to get in touch with any questions.

[Dan Z](https://github.com/impronunciable)

[Pietro](https://github.com/pietrop)

[Ryan](https://github.com/ryanmark)
