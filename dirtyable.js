// dirtyable may be freely distributed under the MIT license.

var extend = function(object, keys) {
    //
    // ## Initial Setup ##
    // Initial type checking. Provide decent error messages here instead of
    // confisuing ones later down the line.
    //
    if (typeof arguments[0] !== 'object')
        throw new Error('First argument to dirtyable.extend needs to be an object.');

    if (!Array.isArray(arguments[1]))
        throw new Error('Second argument to dirtyable.extend needs to be an array.');

    //
    // `data` is used as a hash of replaced properties to their values. It is
    // populated with the original data right before it's replaced.
    //
    var data = {},

    //
    // When properties are changed, their original values are stored here
    // in the format of `{ property: original }`
    //
        changed_originals = {};

    // ## Object-level property getters ##

    //
    // Handler for `object.isChanged`
    //
    // This returns true if any tracked values on the object have been changed.
    //
    var object_isChanged = function() {
        return Object.keys(changed_originals).length > 0;
    };

    //
    // Handler for `object.changed`
    //
    // This returns an array of all changed properties.
    // For example:
    //
    //     object.foo = 'made dirty'
    //     object.changed # => ['foo']
    //
    var object_changed = function() {
        return Object.keys(changed_originals);
    };

    //
    // Handler for `object.changes`
    //
    // This returns an object that shows the changes for all properties.
    // For example:
    //
    //     object.bar # => 'clean'
    //     object.bar = 'dirty'
    //     object.changes # => { 'bar': ['clean', 'dirty'] }
    //
    var object_changes = function() {
        var out = {};
        for (var i in changed_originals)
            out[i] = [changed_originals[i], data[i]];

        return out;
    }

    // ## Property-level property getters (and setter) ##

    //
    // Handler for `object.property`
    //
    var property_get = function(property) {
        return data[property];
    };

    //
    // #### Helper method for `object.property = value`
    //
    var property_set = function(property, value) {
        if (data[property] == value)
            return;

        // Setting a value back to its original value "cleans" it.
        if (changed_originals[property] == value) {
            delete changed_originals[property];
        } else {
            changed_originals[property] = data[property];
        }

        data[property] = value;
    };

    //
    // #### Helper method for `object.property_isChanged
    // like `object.isChanged`, but for one property.
    //
    var property_isChanged = function(property) {
        return typeof changed_originals[property] !== 'undefined';
    };

    //
    // #### Helper method for `object.property_was`
    // Returns the value of the property before it was changed.
    //
    var property_was = function(property) {
        return property_isChanged(property)
            ? changed_originals[property]
            : void(0); // TODO: What does rails do here?
    }

    //
    // #### Helper method for object.property_change
    // Like `object.changes`, but for a single property.
    // For example:
    //
    //     object.foo # => 'bar'
    //     object.foo = baz;
    //     object.foo_change # => ['bar', 'baz']
    //
    var property_change = function(property) {
        return property_isChanged(property)
            ? [changed_originals[property], data[property]]
            : void(0); // TODO: What does rails do here?
    }

    // ## Object modification starts here##

    // ### Define object-level properties.
    Object.defineProperty(object, 'isChanged', {
        enumerable: false,
        get: object_isChanged
    });

    Object.defineProperty(object, 'changed', {
        enumerable: false,
        get: object_changed
    })

    Object.defineProperty(object, 'changes', {
        enumerable: false,
        get: object_changes
    });

    //
    // ### Define property-level properties.
    //
    // This is the magic part. It wraps all properties on the object
    // with getters and setters that keep track of changes.
    //
    keys.forEach(function(property) {
        // Replace the property with getters and setters.
        data[property] = object[property];

        // Override property with our magic getters and setters.
        Object.defineProperty(object, property, {
            enumerable: true,
            get: property_get.bind(null, property),
            set: property_set.bind(null, property)
        });

        //
        // ### Define the prefixed and suffixed properties.
        //

        // Define `object.property_isChanged`
        Object.defineProperty(object, property + '_isChanged', {
            enumerable: false,
            get: property_isChanged.bind(null, property)
        });

        // Define `object.property_was`
        Object.defineProperty(object, property + '_was', {
            enumerable: false,
            get: property_was.bind(null, property)
        });

        // Define `object.property_change`
        Object.defineProperty(object, property + '_change', {
            enumerable: false,
            get: property_change.bind(null, property)
        });

    });
}

// Expose the object binder.
exports.extend = extend;
