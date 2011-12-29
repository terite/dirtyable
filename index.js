module.exports = function DirtyableObject(object, properties) {
  var data = {},
      dirty = [];
  
  var get = function (key) {
    return data[key];
  };
  var set = function (key, value) {
    data[key] = value;
    object.setDirty(key);
  };
  var checkIfValidProperty = function (property) {
    if (properties.indexOf(property) === -1)
      throw new Error('Invalid property ' + property);
  };

  properties.forEach(function (i) {
    data[i] = object[i];
    delete object[i];

    Object.defineProperty(object, i, {
      enumerable: true,
      get: get.bind(null, i),
      set: set.bind(null, i)
    });
  });

  Object.defineProperty(object, 'isDirty', {
    enumerable: false,
    get: function () {
      return dirty.length > 0;
    }
  });

  Object.defineProperty(object, 'dirty', {
    enumerable: false,
    get: function () {
      return dirty;
    }
  });

  object.setDirty = function (key) {
    checkIfValidProperty(key);
    if (dirty.indexOf(key) == -1) {
      dirty.push(key);
      dirty.sort();
    }

  };

  object.setClean = function (key) {
    if (typeof key == 'undefined') {
      dirty = [];
      return;
    }

    checkIfValidProperty(key);
    var i;
    if ((i = dirty.indexOf(key)) !== -1)
      dirty.splice(i, 1);
  };

  object.emitIfDirty = function (setClean) {
    if (!object.isDirty)
      return;

    object.emit('dirty', dirty);

    if (setClean)
      object.setClean();
  };
};
