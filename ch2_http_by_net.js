const net = require('net');

const LINE_SEPARATOR = '\r\n'

const socket = net.connect({
	port: 80,
	host: "localhost"
});

// setting encoding
socket.setEncoding('utf8');

socket.on('connect', function () {
    // console.log('connect')
    // sample raw http request to smallest_server
	socket.write('GET /api/get HTTP/1.1\r\nAccept: */*\r\nConnection: close\r\n\r\n');
});

socket.on('data', function (res) {
    // simple http response parser
    let httpResponse = parseHttpResponse(res);
    console.log(httpResponse)
});

socket.on('close', function () {
	// console.log('close');
});

socket.on('error', function (err) {
	console.log('on error: ', err.code);
});

// simple get response parser for practice smaple (DO NOT use other uses)
let parseHttpResponse = res => {
    var i = 0
    let parsedLines = res.split(LINE_SEPARATOR)
    let protocol = parseHttpProtocol(parsedLines[i++])

    var headerLines = []
    for(i=1;i<parsedLines.length;i++) {
        if(parsedLines[i] == '') break
        headerLines.push(parsedLines[i])
    }
    let headers = parseHttpHeaders(headerLines)

    let bodyLines = []
    for(i++;i<parsedLines.length;i++) {
        if(parsedLines[i] == '0') break
        bodyLines.push(parsedLines[i])
    }
    let bodyChunks = parseHttpBodyChunks(bodyLines)
    return {protocol, headers, bodyChunks}
}

let parseHttpBodyChunks = bodyChunks => {
    let chunkSize = bodyChunks.length / 2
    let chunks = []
    for(var i=0;i<chunkSize;i++) {
        let chunk = parseHttpBodyChunk(bodyChunks[2 * i], bodyChunks[2* i + 1])
        chunks.push(chunk)
    }
    return chunks
}

let parseHttpBodyChunk = (size, value) => {
    return {size: size, value: value}
}

let parseHttpHeaders = headers => {
    return headers
        .map(it => parseHttpHeader(it))
        .reduce((a, b) => { return {...a,...b}})  
}

let parseHttpHeader = header => {
    var fields = header.split(': ')
    var result = {}
    result[fields[0]] = fields[1]
    return result
}

let parseHttpProtocol = protocol => {
    let fields = protocol.split(' ')
    return {
        version: fields[0],
        statusCode: fields[1],
        statusMessage: fields[2],   
    }
}

/*
0 : HTTP/1.1 200 OK
1 : X-Powered-By: Express
2 : Content-Type: text/plain; charset=utf-8
3 : Date: Sun, 15 Jan 2023 08:24:41 GMT
4 : Connection: close
5 : Transfer-Encoding: chunked
6 :
7 : 13
8 : Smallest Get Server
9 : 0
10 :
11 :
*/