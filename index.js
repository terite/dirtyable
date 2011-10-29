var events = require('events');

var reserved = ['_data', '_dirty', '_emitter', 'on', 'setDirty', 'setClean'];

module.exports = function(properties) {
  if (typeof properties != "object")
    throw new Error("Properties argument must be an Object");
  if (Object.keys(properties).length == 0)
    throw new Error("Must pass at least one property to track.");

  // Translate native objects like String and Number into strings.
  Object.keys(properties).forEach(function (key) {
    if (typeof properties[key] == 'function') {
      properties[key] = typeof properties[key]();
    }
  });
  
  Object.keys(properties).forEach(function(key) {
    if (reserved.indexOf(key) != -1)
      throw new Error('Key ' + key + ' is reserved and cannot be used.');
  });

  var DirtyableModel = function(props) {
    if (typeof props == 'undefined')
      props = {};
    
    if (typeof props !== 'object')
      throw new Error('Invalid model constructor argument.');
    
    var self = this;
    
    this._data = {};
    this._dirty = [];
    this._emitter = new events.EventEmitter;
    this.on = this._emitter.on.bind(this._emitter);

    Object.defineProperty(this, 'isDirty', {
      get: function () { return self._dirty.length !== 0; }
    });
    
    var get = function(key) {
      return self._data[key];
    };
    var set = function(key, value) {
      if (typeof properties[key] == 'undefined')
        throw new Error(key + ' must be defined at model creation.');
      if (typeof value != properties[key]) {
        console.log(key, properties);
        throw new Error(key + ' must be type of ' + properties[key]);
      }
        
      self._data[key] = value;
      self.setDirty(key);
    };
    
    Object.keys(properties).forEach(function(key) {
      this._data[key] = null;

      Object.defineProperty(self, key, {
        get: get.bind(self, key),
        set: set.bind(self, key)
      });
    }, this);
    
    Object.keys(props).forEach(function(key) {
      self[key] = props[key];
    });
  };

  DirtyableModel.prototype.setDirty = function (key, dontFireEvent) {
    if (this._dirty.indexOf(key) !== -1)
      return;
    
    this._dirty.push(key);

    if (dontFireEvent)
      return;
    
    this._emitter.emit('change', key);
  };
  DirtyableModel.prototype.setClean = function () {
    this._dirty = [];
    this._emitter.emit('clean');
  };

  return DirtyableModel;
};
