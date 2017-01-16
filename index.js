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

const fpath = 'transcription.txt'

var str = fs.readFileSync(fpath, 'utf8')
const stream = fs.createWriteStream(fpath, {flags: 'a'})


const socket = io.connect('https://openedcaptions.com:443')
socket.on('word', data => {
  const word = ' ' + data.data.body.toLowerCase()
  stream.write(word)
  str += word      
})

http.createServer((req, res) => {
  const query = url.parse(req.url, true).query
  const offset = query.offset || 0
  res.end(str.substring(offset))
}).listen(5000)