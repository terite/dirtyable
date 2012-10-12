module.exports = {
    extend: function(object, keys) {
        if (typeof arguments[0] !== 'object')
            throw new Error('First argument to extend needs to be an object.');

        if (!Array.isArray(arguments[1]))
            throw new Error('Second argument to extend needs to be an array.');

        var data = {},
            changed_originals = {};

        var getter = function(key) {
            return data[key];
        };
        var setter = function(key, val) {
            if (data[key] == val)
                return;

            // Setting a value back to its original value undirties it.
            if (changed_originals[key] == val) {
                delete changed_originals[key];
            } else {
                changed_originals[key] = data[key];
            }

            data[key] = val;
        };

        // 
        // This is the magic part. It wraps all properties on the object
        // with getters and setters that keep track of changes.
        //
        // This loop also adds all the magic property suffixes like _was and _isChanged
        //
        keys.forEach(function(property) {
            //
            // Replace the property with getters and setters.
            //
            data[property] = object[property];
            Object.defineProperty(object, property, {
                get: getter.bind(null, property),
                set: setter.bind(null, property)
            });

            //
            // Object#property_isChanged
            //
            Object.defineProperty(object, property + '_isChanged', {
                enumerable: false,
                get: function() {
                    return typeof changed_originals[property] !== 'undefined';
                }
            });

            //
            // Object#property_was
            //
            Object.defineProperty(object, property + '_was', {
                enumerable: false,
                get: function() {
                    return object[property + '_isChanged']
                        ? changed_originals[property]
                        : void(0); // TODO: What does rails do here?
                }
            });

            //
            // Object#property_change
            //
            Object.defineProperty(object, property + '_change', {
                enumerable: false,
                get: function() {
                    return object[property + '_isChanged']
                        ? [changed_originals[property], data[property]]
                        : void(0); // TODO: WHat does rails do here?
                }
            });

        });

        //
        // Object#isChanged
        //
        Object.defineProperty(object, 'isChanged', {
            enumerable: false,
            get: function() {
                return Object.keys(changed_originals).length > 0;
            }
        });

        //
        // Object#changed
        //
        Object.defineProperty(object, 'changed', {
            enumerable: false,
            get: function() {
                return Object.keys(changed_originals);
            }
        })

        //
        // Object#changes
        //
        Object.defineProperty(object, 'changes', {
            enumerable: false,
            get: function() {
                var out = {};
                for (var i in changed_originals)
                    out[i] = [changed_originals[i], data[i]];

                return out;
            }
        });
    }
};