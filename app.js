
var cluster = require('cluster');
var os = require('os');
if(cluster.isMaster) {
 var cpus = 4//os.cpus().length
 let worker;
 //start as many children as the number of CPUs
 for (var i = 0; i < cpus; i++) { 
    worker = cluster.fork();
    worker.on("message" ,(msg)=>{
       Object.keys(cluster.workers).forEach(function(id) {
          cluster.workers[id].send(msg);
       })
    })
 }

cluster.on('exit', function(worker, code) {
    if(code != 0 && !worker.suicide) {
        console.log('Worker crashed. Starting a new worker');
        cluster.fork();
    }
});

} else {
 require('./index'); 
}
