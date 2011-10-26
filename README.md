# DirtyableModel
`DirtyableModel` is simply a function that returns a "class" that keeps track of which of its properties have changed.

## Usage.

### Requiring.
    var DirtyableModel = require('/path/to/DirtyableModel');

No need to put in the /index.js, node figures that out automatically.

### Creating a new model.

#### With type validation.
    
    var FooModel = new DirtyableModel({
      'bar': String,
      'baz': Number
    });

#### Reserved property names.
The following property names are taken by the implementation and cannot be used.
    _dirty
    _data
    on
    isDirty
    setDirty
    setClean

### Creating an instance of a model.
Properties not set in the constructor are set to null. Model constrctors require no arguments, but you may pass in an object for assignment.

    var ConstructorsDontRequireProperties = new FooModel();

    var FooModelInstance = new FooModel({
      bar: 'This is a valid string'
      // Not every property must be set in the constructor. Default value will be null.
    });


### Getting and setting.
    // Getting
    var barProperty = FooModelInstance.bar; // 'This is a valid string'
    
    // Setting
    FooModelInstance.bar = "A new value";
    // This will trigger a "change" event with a key of "bar"

### Knowing what is changed, and when.
Event "change": function (key)
Emitted when a property is changed.

Event "clean": function ()
Emitted when setClean is called

#### Registering callbacks.

    FooModelInstance.on("change", function (key) {
      console.log(key, "was changed!");
    });

