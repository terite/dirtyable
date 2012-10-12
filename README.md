## This readme is out of date.

[![Build Status](https://secure.travis-ci.org/terite/DirtyableObject.png)](http://travis-ci.org/terite/DirtyableObject)
# DirtyableObject
`DirtyableObject` is simply a function that keeps track of property changes. It
also gives you some methods to manage these "dirty" properties.

## Usage.

### Prerequisites.
Include DirtyableObject
    var DirtyableObject = require('/path/to/DirtyableObject');

The objects you call it on must be event emitters.

### Basic use.
Simply call `DirtyableObject(object, properties)`. For example:

```javascript
var events = require('events'),
    util = require('util');

var MyObject = function () {
    events.EventEmitter.call(this);
    this.foo = 1;
    this.bar = 'Two';
    DirtyableObject(this, ['foo', 'bar']);
}
util.inherits(MyObject, events.EventEmitter);

var instance = new MyObject;
instance.isDirty // false

instance.foo++;
instance.isDirty; // true
instance.on('dirty', function (properties) {
    // Once emitIfDirty is called below, this will be called.
});
instance.emitIfDirty();
```

## API

### Properties
readonly bool `isDirty`
True if even one tracked property is dirty.

`array dirty`
The array of dirty properties.

### Events
Event: 'dirty'
`function (properties) {}`

Emitted when `emitIfDirty` is called and there are dirty properties. The
argument `properties` is an array of dirty properties in alphabetical order.

### Functions & Methods
`DirtyableObject(object, properties)`

`void emitIfDirty([setClean = false])`

If any of the tracked properties have been marked dirty, the `dirty` event will
be emitted. If the optional `setClean` parameter is set true, the `setClean`
method with no paramters will be called immediately after event emission.

`void setDirty(property)`

Mark a specific property as dirty.

`void setClean([property])`

Mark a property as clean. If the `property` parameter is not provided, all
properties will be marked as clean.
