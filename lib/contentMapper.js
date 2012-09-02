
module.exports = contentMapper;

var request = require('request'),
    _ = require('underscore'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    jquery = 'http://code.jquery.com/jquery-1.5.min.js';


function contentMapper (config, cb) {
  if (!config || typeof config !== 'object' || config.length === 0){
    throw new Error("Invalid config argument.");
  }
  if (typeof config.inputfile !== 'function' && (typeof config.inputfile !== 'string' || config.inputfile.length === 0)){
    throw new Error("must provide a valid input filepath,url, or function");
  }
  if (typeof config.mappingFn !== 'function'){
    throw new Error("must provide a valid mapping function");
  }
  if (typeof config.template !== 'function' && (typeof config.template !== 'string' || config.template.length === 0)){
    throw new Error("must provide a valid template filepath,url, or function");
  }

  var inputfile = config.inputfile,
      mappingFn = config.mappingFn,
      templatefile = config.template;
  //read
  function read(inpath,next){
    var loader;
    //if it starts with http:// we use request to load the web content
    loader = inpath.match(/^http:\/{2}/) ? networkloader : fileloader;
    loader(inpath,function(err,data){
      if (err){
        cb(err);
        return;
      }
      next(data);
    });
  }

  //parse
  function parse(data){
    var unDOMed = data;
    //parse
    jsdom.env(data, [jquery],
      function(errors, window) {
        if (errors){
          cb(errors);
          return;
        }
        var newData =mappingFn(window.$,unDOMed);
        //do the parsing
        map(newData);
    });
  }

  //map
  function map(data){
    //read template and write new data to callback
    if (templatefile.call){
      cb(null,_.template(templatefile(),data));
    }else{
      read(templatefile,function(template){
        cb(null,_.template(template,data));
      });
    }
  }
  //let's do it
  if (inputfile.call){
    parse(inputfile());
  }else{
    read(inputfile,parse);
  }
}

//file or network loader
var networkloader = function(url,callback){
  request(url,function(error,response,body){
    callback(!response ? error : response.statusCode == 200 ?
      error : new Error("bad network response:"+response.statusCode),
      body
    );
  });
};

var fileloader = function(fpath,callback){
  fs.readFile(__dirname+fpath,'utf8',callback);
};
