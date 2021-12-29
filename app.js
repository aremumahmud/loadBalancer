
var cluster = require('cluster');
var os = require('os');
if(cluster.isMaster) {
 var cpus = 4//os.cpus().length
 
 //start as many children as the number of CPUs
 for (var i = 0; i < cpus; i++) { 
 cluster.fork();
 }

cluster.on('exit', function(worker, code) {
    if(code != 0 && !worker.suicide) {
        console.log('Worker crashed. Starting a new worker');
        cluster.fork();
    }
});
var http = require("http")
http.createServer((req,res)=>{
   var { url } = req
   var query = url.slice(url.indexOf("?")+1)
   var list = query.split("=")
   if (list.length <= 2){
       Object.keys(cluster.workers).forEach(function(id) {
            cluster.workers[id].send(list[1]);
       });
       res.end("sent")
   }else{
       res.end("wrong params")
   }

  }).listen(process.env.PORT || 8080)

} else {
 require('./index'); 
}
