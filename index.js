var http = require('http');
var DataStream = require("./DataStream")
var fs = require("fs")
var servers = fs.readFileSync("./servers.file").toString().split("\n")
servers.pop()
console.log(servers)
var index = 0
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
require('http').createServer(function(req, res) {
if(req.url == "/favicon.ico"){
   res.end()
}else if(req.url.indexOf("/Check") == 0){
     res.end(JSON.stringify(servers))

}else if(req.url.indexOf("/Update") != 0){
 if(!servers.length) {
 res.writeHead(502);
 return res.end('Bad gateway');
 }
 index = (index + 1) % servers.length;
 console.log(servers[index])//[4]
req.headers.host = "mongodbservice1.herokuapp.com"
 proxy.web(req, res, {target:"mongodbservice1.herokuapp.com"},(err)=>{
   res.end("err")
 });
 }else{
   var { url } = req
   var query = url.slice(url.indexOf("?")+1)
   var list = query.split("=")
  if(list.length > 2) res.send("wrong params")
   servers.push(list[1])
   process.send(list[1]+"&&"+process.pid)
     var text = servers.join("\n")
     fs.writeFile("servers.file",text, (err) => { 

       if (err) {

           res.end("error")

       }else { 
           res.end(text)

        // console.log("File written successfully\n"); 

         //console.log("The written has the following contents:"); 

         //console.log(fs.readFileSync("books.txt", "utf8")); 

        } 
     }); 
 }
}).listen(process.env.PORT || 8080, function() {console.log('Started');});
process.on("message",msg=>{
     if(msg.split("&&")[1] != process.pid){
       servers.push(msg.split("&&")[0])
     }
   })
//lets see
