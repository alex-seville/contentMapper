var contentMapper = require("../lib/contentMapper.js");

contentMapper({ inputfile:"http://www.reddit.com",
		mappingFn:function($){
			return {headline: $('.content .spacer:last .entry:first a:first').text()};
		},
		template: function(){
			return "Top headline: <%= headline %>.";
		}
	},function(err,res){
		if (err){
			console.log("something went wrong: "+err);
		}else{
			console.log(res);
		}
	}
);

