[![Build Status](https://secure.travis-ci.org/terite/dirtyable.png)](http://travis-ci.org/terite/dirtyable)
#dirtyable.js
`dirtyable.js` helps you keep track of changes to properties on objects.

It aims to be a javascript equivalent to [ActiveModel::Dirty](http://api.rubyonrails.org/classes/ActiveModel/Dirty.html)

### Get it.
`npm install dirtyable`

### Track your objects.
`dirtyable.extend(object, ['foo', 'bar'])`

### How to use it
```javascript
var dirtyable = require('dirtyable');

var obj = {
    foo: 'fizzle',
    bar: 42,
    baz: 'black sheep'
};
dirtyable.extend(obj, ['foo', 'bar']);

obj.foo // => 'fizzle'
obj.foo_isChanged // => false
obj.bar_isChanged // => false
obj.isChanged // => false

obj.foo = 'fo shizzle';
obj.foo_isChanged // => true
obj.bar_isChanged // => false
obj.isChanged // => true

obj.foo_was // => 'fizzle'
obj.foo_change // => ['fizzle', 'fo shizzle']

obj.changed // => ['foo']
obj.changes // => { 'foo' => ['fizzle', 'fo shizzle'] }

// To reset, set it back to its original value.
obj.foo = 'fizzle'
obj.foo_isChanged // => false
obj.changed // => [ ]
```
