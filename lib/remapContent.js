
module.exports = remapContent;

var request = require('request'),
    _ = require('underscore'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    jquery = 'http://code.jquery.com/jquery-1.5.min.js';


function remapContent (inputfile,options, cb) {
  if (!inputfile || typeof inputfile !== 'string' || inputfile.length === 0){
    throw new Error("must provide a valid input filepath or url");
  }
  //declarations
  if (typeof options === 'function'){
    cb = options;
    options = null;
  }
  var mappingFn = options.mappingFn;
  //this can be a url,filepath,or function
  var templatefile = options.template;
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
    //parse
    jsdom.env(data, [jquery],
      function(errors, window) {
        if (errors){
          cb(errors);
          return;
        }
        var newData =mappingFn(window.$);
        //do the parsing
        write(newData);
    });
  }

  //write
  function write(data){
    //read template and write new data to callback
    if (templatefile.call){
      cb(null,_.template(templatefile(),data));
    }else{
      read(templatefile,function(template){
        cb(null,_.template(template,data));
      });
    }
  }
  read(inputfile,parse);
}

//file or network loader
var networkloader = function(url,callback){
  request(url,function(error,response,body){
    callback(!response ? error : response.statusCode == 200 ?
      error : new Error("bad response."),
      body
    );
  });
};

var fileloader = function(fpath,callback){
  fs.readFile(__dirname+fpath,'utf8',callback);
};
