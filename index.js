/*
*  www.openedcaptions.com routes captions from C-Span 1 channel to a socket end point. 
* This script serves as an itnermediate server to buffer text from socket and expose it as REST API end point. 
* * that also support char offset. see README for more info.
*  author: Dan Z @impronunciable
*/
const io = require('socket.io-client')
const fs = require('fs')
const http = require('http')
const url = require('url')

const ttl = 20 * 60 * 1000 // 20 mins -> microseconds
const cacheCheckInterval = 5 * 60 * 1000 // 5 mins -> microseconds
setInterval(cleanCache, cacheCheckInterval)

// Where we stash our stuff
var cache = []

var txt = false;
if ( process.env.TRANSCRIPT_FILE ) {
  if ( fs.existsSync(process.env.TRANSCRIPT_FILE) ) {
    cache.push({t: Date.now(), r: fs.readFileSync(transcriptFile)})
  }

  txt = fs.createWriteStream(transcriptFile)
}

const socket = io.connect('https://openedcaptions.com:443')
socket.on('content', data => {
  if ( txt ) { txt.write(data.data.body) }
  if ( data.data.body === "\r\n" ) { return }
  const dat = {t: Date.now(), r: data.data.body}
  console.log(dat.t, dat.r)
  cache.push(dat)
})

http.createServer((req, res) => {
  const now = Date.now()
  const query = url.parse(req.url, true).query
  const timestamp = parseInt(query.since || 0)
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    now: now,
    captions: formatText(getWordsSince(timestamp))
  }))
}).listen(process.env.PORT || 5000)

function formatText(str) {
  return str.toLowerCase()
    .replace("\r\n", ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+(!|\?|;|:|,|\.)/g, '$1')
    .replace(/ mrs\.? /gi, ' Mrs. ')
    .replace(/ ms\.? /gi, ' Ms. ')
    .replace(/ mr\.? /gi, ' Mr. ')
    .replace(/ dr\.? /gi, ' Dr. ')
    .replace(/ i /g, ' I ')
    .replace(/ senator (\w)/gi, (match, a) => { return ' Senator ' + a.toUpperCase() })
    .replace(/(!|\?|:|\.|>>)\s+(\w)/g, (match, a, b) => { return a + ' ' + b.toUpperCase() })
    .replace(/\s*>>\s*/g, "\n\n")
    .trim()
}

function getWordsSince(timestamp) {
  var ret = []
  cache.forEach((val, i) => {
    if ( val.t >= parseInt(timestamp) ) {
      ret.push(val.r)
    }
  })
  return ret.join(' ')
}

function cleanCache() {
  const ttl_check = Date.now() - ttl
  cache.forEach((val, i) => {
    if ( val.t < ttl_check ) {
      delete cache[i]
    }
  })
}
