Module Fu
=========

A small library providing utility methods to manage modules, particularly loading and uncaching (removing from cache). Handy for unit testing where having freshly loaded modules is wanted.

## Installation

  npm install module-fu --save-dev

## Example

```javascript
  var mf = require('module-fu');
  mf.resolverFn = function(moduleName) { return require.resolve(moduleName); }
  var expect = require('chai').expect;

  describe('my-cool-module', function() {	
    it('rocks because I reload the core module.', function() {
    	var info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(0);

    	var mcm = mf.load('./my-cool-module.js');
    	info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(1);
    	expect(d1.hello()).to.equal('hello world');

    	mf.uncache('./my-cool-module.js');
    	info = mf.searchCache('./my-cool-module.js');
    	expect(info.length).to.equal(0);
	});
  });
```

## Tests

  npm test

## API

### `setResolver(resolverFn)`
#### Description
Sets the function used to resolve module references.
Usually needs setting from where this module is loaded.
#### Parameters
* resolverFn - A function that performs the equivalent of require.resolve()
## Example

```javascript
  var mf = require('module-fu');
  mf.setResolver(function(moduleName) { return require.resolve(moduleName); });
  var mcm = mf.load('./my-cool-module.js');
```

### `uncache(moduleName)`
#### Description
Removes a module from the cache
#### Parameters
* moduleName - the name of the module to remove from the cache.


### `searchCache(moduleName[, callback])`
#### Description
Searches the cache for references to a module.
#### Parameters
* moduleName - the name of the module to search for.
* callback - optional callback. If specified it will be called for each occurrence found.
#### Returns
If no callback is specified => an array of results found.
If a callback is specified => undefined.

### `load(moduleName[, importName])`
#### Description
Loads a module and optionally retrieves an import.
Designed to give nice messages when the module or import is not found so mistakes in
writing tests are picked up quickly.
#### Parameters
* moduleName - the name of the module to load.
* importName - Optional name of the import to get and return for the module.
#### Returns
If an importName is specified => The module exported property with the same name.
If no importName is specified => The module is returned.

### `reload(moduleName[, importName])`
#### Description
Reloads a module and optionally retrieves an import.
Similar to load but first removes the module from the cache.
#### Parameters
* moduleName - the name of the module to reload.
* importName - Optional name of the import to get and return for the module.
#### Returns
If an importName is specified => The module exported property with the same name.
If no importName is specified => The module is returned.

## Credits

Adapted from [this answer](http://stackoverflow.com/a/14801711) to a StackOverflow question.

## Release History

* 0.1.0 Initial release
