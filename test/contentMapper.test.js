var vows = require('vows'),
	assert = require('assert'),
	contentMapper = require('../lib/contentMapper.js'),
	events = require('events');

// Create a Test Suite
vows.describe('remap, arguments').addBatch({
    'when calling remap with null inputfile': {
        topic: function () {
			contentMapper(null, this.callback);
        },

        'we get an error': function (err) {
            assert.isNotNull(err);
        }
    },
    'when calling remap with an non-string inputfile': {
        topic: function () {
			contentMapper({}, this.callback);
        },

        'we get an error': function (err) {
            assert.isNotNull(err);
        }
    },
    'when calling remap with an empty string inputfile': {
        topic: function () {
			contentMapper("", this.callback);
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
			contentMapper({
                inputfile: "http://www.google.ca",
				mappingFn:mapper,
				template: "/../test/fixtures/template.htm"
			},this.callback);
        },
        'we get no error and the title back':  function (err,stat) {
			assert.isNull(err);
            assert.isNotNull(stat);
            assert.equal(stat,"Welcome to Google");
        }
    },
    'when we provide another good url path': {
        topic: function () {
            function mapper($){
                return {title: $('title').text()};
            }
            contentMapper({
                inputfile: "http://www.linkedin.com/in/alexanderseville",
                mappingFn:mapper,
                template: "/../test/fixtures/template.htm"
            },this.callback);
        },
        'we get no error and the title back':  function (err,stat) {
            assert.isNull(err);
            assert.isNotNull(stat);
            assert.equal(stat,"Welcome to Alexander Seville | LinkedIn");
        }
    },
    'when we provide a bad url path': {
        topic: function () {
			contentMapper("http://does.not.compute",this.callback);
        },
        'we get an error':  function (err) {
            assert.isNotNull(err);
        }
    }
}).export(module);