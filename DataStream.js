var stream=require('stream')
var util=require("util")
function DataStream(text,options) {
  this.text=text
 stream.Readable.call(this, options);
}
util.inherits(DataStream, stream.Readable);
DataStream.prototype._read=function(){
  this.push(this.text,"utf8")
  this.push(null)
}
module.exports=DataStream