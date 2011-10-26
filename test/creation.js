var DirtyableModel = require('../index.js');

exports['Export worked as expected.'] = function (test) {
  test.equal(typeof DirtyableModel, 'function');
  test.done();
};

exports['Must construct with object'] = function (test) {
  test.throws(function () {
    new DirtyableModel();
  });
  test.done();
};

exports['Construction object cannot be blank'] = function (test) {
  test.throws(function () {
    new DirtyableModel({});
  });
  test.done();
};

exports['Cannot create a model with reserved keys'] = function (test) {
  // Set in constructor
  test.throws(function () {
    new DirtyableModel({
      on: String
    });
  });
  
  // Set in prototype
  test.throws(function() {
    new DirtyableModel({
      setDirty: Boolean
    });
  });
  test.done();
};

exports['Can create a model'] = function (test) {
  var model = new DirtyableModel({
    id: Number
  });
  test.equal(typeof model, 'function');
  test.done();
};

exports['Can create an instance of a model.'] = function (test) {
  var model = new DirtyableModel({
    id: Number
  });
  var instance = new model({id: 1});
  test.equal(instance.id, 1);
  test.done();
}
