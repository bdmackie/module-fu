var mf = require('../index.js');
mf.setResolver(function(moduleName) { return require.resolve(moduleName); });
var expect = require('chai').expect;

describe('module-fu', function() {	
    it('only finds a module in the cache when it is loaded.', function() {
    	var info;

    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);

    	var d1 = require('./dummy1');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');

    	mf.uncache('./dummy1.js');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);
	});

	 it('loads an import from a module.', function() {
    	var info;

    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);

    	var hello = mf.load('./dummy1', 'hello');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(hello()).to.equal('hello world');

    	mf.uncache('./dummy1.js');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);
	});

	it('reloads a module, resetting its state.', function() {
    	var info;

    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);

    	var d1 = mf.load('./dummy1');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');
    	d1.message = 'bonjour!';
    	expect(d1.hello()).to.equal('bonjour!');

    	d1 = mf.reload('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');

    	mf.uncache('./dummy1.js');
    	info = mf.searchCache('./dummy1.js');
    	expect(info.length).to.equal(0);
	});
});