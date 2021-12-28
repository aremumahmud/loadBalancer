var http = require('http');
var DataStream = require("./DataStream")
var fs = require("fs")
var servers = fs.readFileSync("./servers.file").toString().split("\n")
console.log(servers)
var index = 0
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
require('http').createServer(function(req, res) {
 if(req.url.indexOf("/Update") != 0){
 if(!servers.length) {
 res.writeHead(502);
 return res.end('Bad gateway');
 }
 index = (index + 1) % servers.length;
 console.log(index)//[4]
 proxy.web(req, res, {target:servers[index]},(err)=>{
   res.end("err")
 });
 }else{
   var { url } = req
   var query = url.slice(url.indexOf("?")+1)
   var list = query.split("=")
   servers.push(list[1])
     var text = servers.join("\n")
     var dataStream = new DataStream(text)
     res.end("sucess" +text)
var writer = fs.createWriteStream("servers.file")
     dataStream
        .pipe(writer)
        .on("end" ,()=>{
          res.end("sucess" +text)
        })
 }
}).listen(process.env.PORT || 8080, function() {console.log('Started');});
