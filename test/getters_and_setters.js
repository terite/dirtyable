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