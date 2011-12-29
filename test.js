var events = require('events'),
    util = require('util'),
    DirtyableObject = require('./index.js');

var TestObject = function () {
  events.EventEmitter.call(this);
  this.bool = true;
  this.number = 1337;
  this.object = {foo: 'bar'};
  this.string = "Hello, World!";
  DirtyableObject(this, ['bool', 'number', 'object', 'string']);
};
util.inherits(TestObject, events.EventEmitter);

exports['Example with asserts.'] = function (test) {
  var MyObject = function () {
    events.EventEmitter.call(this);
    this.foo = 1;
    this.bar = 'Two';
    DirtyableObject(this, ['foo', 'bar']);
  }
  util.inherits(MyObject, events.EventEmitter);

  var instance = new MyObject;
  test.strictEqual(instance.foo, 1);
  test.strictEqual(instance.bar, 'Two');
  test.strictEqual(instance.isDirty, false);

  test.equal(instance.foo++, 1);
  test.equal(instance.foo, 2);
  test.equal(instance.bar, 'Two');
  test.equal(instance.isDirty, true);
  test.deepEqual(instance.dirty, ['foo']);
  instance.on('dirty', function (properties) {
    test.deepEqual(properties, ['foo']);
  });
  instance.emitIfDirty();
  
  test.done();
};

exports['Properties retain initial values'] = function (test) {
  var i = new TestObject;
  test.strictEqual(i.bool, true);
  test.strictEqual(i.number, 1337);
  test.deepEqual(i.object, {foo: 'bar'});
  test.strictEqual(i.string, "Hello, World!");
  test.done();
};

exports['Objects initially not dirty'] = function (test) {
  var i = new TestObject;
  test.equal(i.isDirty, false);
  test.deepEqual(i.dirty, []);
  test.done();
};

exports['emitIfDirty usage'] = function (test) {
  var i = new TestObject;
  test.expect(2);

  i.on('dirty', function () {
    test.ok(false, 'Unexpected event fire.');
  });
  i.emitIfDirty();
  i.removeAllListeners();
  i.string = "I'm a dirty property";
  i.on('dirty', function (properties) {
    test.deepEqual(properties, ['string']);
  });
  i.emitIfDirty(); // should fire
  i.emitIfDirty(true); // should fire
  i.emitIfDirty(); // should NOT fire
  test.done();
};

// Share between this test and next.
var i;
exports['setDirty usage'] = function (test) {
  i = new TestObject;
  i.setDirty('string');
  test.deepEqual(i.dirty, ['string']);

  i.setDirty('bool');
  test.deepEqual(i.dirty, ['bool', 'string']);

  test.throws(function () {
    i.setDirty();
  });
  test.throws(function () {
    i.setDirty('unknown');
  });
  
  i.setDirty('number');
  i.setDirty('object');
  test.deepEqual(i.dirty, ['bool', 'number', 'object', 'string']);
  test.done();
};

exports['setClean usage'] = function (test) {
  test.throws(function () {
    i.setClean('unknown');
  });
  test.deepEqual(i.dirty, ['bool', 'number', 'object', 'string']);

  i.setClean('object');
  test.deepEqual(i.dirty, ['bool', 'number', 'string']);

  i.setClean();
  test.deepEqual(i.dirty, []);
  test.equal(i.isDirty, false);
  test.done();
};
