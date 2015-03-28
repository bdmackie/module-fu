/**
 * Removes a module from the cache
 */
 function uncache(moduleName) {
	// Run over the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
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
 * Runs over the cache to search for all the cached
 * files
 */
function searchCacheSync(moduleName) {
    var results = [];

    searchCache(
        moduleName,
        function(mod) {
            results.push(mod);
        }
    );

    return results;
};

function searchCache(moduleName, callback) {
    var results = undefined;
    if (!callback) {
        results = [];
        callback = function(mod) {
            results.push(mod);
        }
    }

    // Resolve the module identified by the specified name
    var mod = module.exports.resolverFn(moduleName);

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

function load(moduleName, importName) {
    var resolvedModuleName = module.exports.resolverFn(moduleName);
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

function reload(moduleName, importName) {
	uncache(moduleName);
	return load(moduleName, importName);
}

function defaultResolver(moduleName) {
    return require.resolve(moduleName);
}

module.exports = {
	uncache : uncache,
    searchCache : searchCache,
	load : load,
	reload : reload,
    resolverFn : defaultResolver
};