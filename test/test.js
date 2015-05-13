var mf = require('../index.js');
mf.setResolver(function(moduleName) { return require.resolve(moduleName); });
var expect = require('chai').expect;

describe('module-fu', function() {	
    it('only finds a module in the cache when it is loaded.', function() {
    	var info;

    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
        expect(mf.has('./dummy1.js')).to.be.false;

    	var d1 = require('./dummy1');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');
        expect(mf.has('./dummy1.js')).to.be.true;

    	mf.remove('./dummy1.js');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
	});

	 it('loads an import from a module.', function() {
    	var info;

    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
        expect(mf.has('./dummy1.js')).to.be.false;

    	var hello = mf.load('./dummy1', 'hello');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(1);
    	expect(hello()).to.equal('hello world');
       expect(mf.has('./dummy1.js')).to.be.true;

    	mf.remove('./dummy1.js');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
	});

	it('reloads a module, resetting its state.', function() {
    	var info;

    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
        expect(mf.has('./dummy1.js')).to.be.false;

    	var d1 = mf.load('./dummy1');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(1);
        expect(mf.has('./dummy1.js')).to.be.TRUE;
    	expect(d1.hello()).to.equal('hello world');
    	d1.message = 'bonjour!';
    	expect(d1.hello()).to.equal('bonjour!');

    	d1 = mf.reload('./dummy1.js');
    	expect(info.length).to.equal(1);
        expect(mf.has('./dummy1.js')).to.be.true;
    	expect(d1.hello()).to.equal('hello world');

    	mf.remove('./dummy1.js');
    	info = mf.find('./dummy1.js');
    	expect(info.length).to.equal(0);
        expect(mf.has('./dummy1.js')).to.be.false;
	});
});