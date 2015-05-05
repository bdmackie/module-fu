/**
 * @file Module helpers.
 * @copyright Ben Mackie 2015
 * @license MIT
 */
 var resolverFn = function(moduleName) {
    return require.resolve(moduleName);
}

/**
 * Sets the function used for resolving modules.
 */
function setResolver(resolver) {
    resolverFn = resolver;
}

/**
 * Removes a module from the cache
 */
 function remove(moduleName) {
	// Run over the cache looking for the files
    // loaded by the specified module name
    find(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
}

/**
 * Searches the cache for references to a module.
 */
function find(moduleName, callback) {
    var results = undefined;
    if (!callback) {
        results = [];
        callback = function(mod) {
            results.push(mod);
        }
    }

    // Resolve the module identified by the specified name
    var mod = resolverFn(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function run(mod) {
            // Go over each of the module's children and
            // run over it
            mod.children.forEach(function (child) {
                run(child);
            });

            // Call the specified callback providing the
            // found module
            callback(mod);
        })(mod);
    }

    return results;
};

/**
 * Loads a module and optionally retrieves an import.
 */
function load(moduleName, importName) {
    var resolvedModuleName = resolverFn(moduleName);
	var mod = require(resolvedModuleName);
	if (!mod)
		throw new Error('Unable to load module [' + moduleName + ']');
	if (!importName)
		return mod;
	var importObj = mod[importName];
	if (!importObj)
		throw new Error('Import [' + importName + 
			'] not defined in loaded module [' + moduleName + ']');
	return importObj;
}

/**
 * Reloads a module and optionally retrieves an import.
 */
function reload(moduleName, importName) {
	remove(moduleName);
	return load(moduleName, importName);
}


module.exports = {
    setResolver : setResolver,
    remove : remove,
    find : find,
    load : load,
    reload : reload
};