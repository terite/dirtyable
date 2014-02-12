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
obj.foo = 'fo shizzle'
obj.foo_isChanged // => true
```

### What it does
On the object, it defines the following getters

* `.isChanged`
* `.changes`
* `.changed`

And for each property it extends, it overrides the property with a getter/setter, then adds the following

* `.<property>_isChanged`
* `.<property>_change`
* `.<property>_was`
