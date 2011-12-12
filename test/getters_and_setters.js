var DirtyableModel = require('../index.js');

exports['Basic getter and setter works'] = function(test) {
  var model = new DirtyableModel({
    foo: String
  });
  var instance = new model(),
      triggered = false;
  
  instance.on('change', function(key) {
    if (key == 'foo') {
      triggered = true;
    }
  });
  
  test.equal(instance.foo, null);
  instance.foo = 'bar';
  
  test.equal(instance.foo, 'bar');
  test.equal(triggered, true);
  
  test.done();
};

exports['Getter and setter validation'] = function(test) {
  var model = new DirtyableModel({
    foo: String,
    bar: Number,
    baz: Boolean
  });

  var instance = new model();
  test.doesNotThrow(function() {
    instance.foo = 'String here';
    instance.bar = 1234;
    instance.baz = true;
  });
  test.throws(function() {
    instance.foo = false;
  });
  test.throws(function() {
    instance.bar = '12345';
  });
  test.throws(function() {
    instance.baz = 123;
  });

  test.done();
};
