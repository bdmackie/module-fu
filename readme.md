Module Fu
=========

A small library providing utility methods to manage modules, particularly loading and uncaching (removing from cache). Handy for unit testing where having freshly loaded modules is wanted.

## Installation

  npm install module-fu --save-dev

## Usage

  var mf = require('module-fu');
  mf.resolverFn = function(moduleName) { return require.resolve(moduleName); }
  var expect = require('chai').expect;

  describe('my-cool-module', function() {	
    it('rocks because I reload the core module.', function() {
    	var info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(0);

    	var mcm = mf.load('./my-cool-module.js')
    	info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');

    	mf.uncache('./my-cool-module.js');
    	info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(0);
	});
  });

## Tests

  npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Test your code.

## Release History

* 0.1.0 Initial release