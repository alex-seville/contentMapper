#Content Mapper
===============

Take content from one file, or url, and map it to another via a template.

##Usage

*Simple example:*  

Grab the top headline from Reddit and put it into a message.

`var contentUrl = "http://www.reddit.com";  
var mappingFcn = function($){  
  return { headline: $('.content .spacer:last .entry:first a:first').text() };  
};  
var templateFcn = function(){  
  return "Top Reddit headline: <%= headline %>!";  
};  

contentMapper(contentUrl, {  
  mappingFn: mappingFcn,  
  template: templateFcn  
},function(err,res){ console.log(res); });  
`
  

##Install

I need to clean things up before I put it in npm.


