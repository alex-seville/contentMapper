var vows = require('vows'),
	assert = require('assert'),
	remapContent = require('../lib/remapContent.js'),
	events = require('events');

// Create a Test Suite
vows.describe('remap, arguments').addBatch({
    'when calling remap with null inputfile': {
        topic: function () {
			remapContent(null, this.callback);
        },

        'we get an error': function (err) {
            assert.isNotNull(err);
        }
    },
    'when calling remap with an non-string inputfile': {
        topic: function () {
			remapContent({}, this.callback);
        },

        'we get an error': function (err) {
            assert.isNotNull(err);
        }
    },
    'when calling remap with an empty string inputfile': {
        topic: function () {
			remapContent("", this.callback);
        },

        'we get an error': function (err) {
            assert.isNotNull(err);
        }
    },
    'when we provide a good url path': {
        topic: function () {
			function mapper($){
				return {title: $('title').text()};
			}
			remapContent("http://www.google.ca",{
				mappingFn:mapper,
				template: "/../test/fixtures/template.htm"
			},this.callback);
        },
        'we get no error and the title back':  function (stat) {
			assert.isNotNull(stat);
            assert.equal(stat,"Welcome to Google");
        }
    },
    'when we provide a bad url path': {
        topic: function () {
			remapContent("http://does.not.compute",this.callback);
        },
        'we get an error':  function (err) {
            assert.isNotNull(err);
        }
    }
}).export(module);