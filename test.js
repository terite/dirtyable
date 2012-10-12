var vows = require('vows'),
    assert = require('assert'),
    dirtyable = require('./dirtyable.js');

vows.describe('Rails-like dirty behavior').addBatch({
    'When using a dirtied object': {
        topic: function() {
            var object = {
                foo: 'bar',
                bar: 'I already said bar!',
                // keep baz undefined.
            };

            dirtyable.extend(object, ['foo', 'bar', 'baz']);
            return object;
        },
        'the object starts with its original values': function(obj) {
            assert.equal(obj.foo, 'bar');
            assert.equal(obj.bar, 'I already said bar!');
            assert.equal(typeof obj.baz, 'undefined');
        },
        'the object starts unchanged': function(obj) {
            assert.equal(obj.foo_isChanged, false);
            assert.equal(obj.bar_isChanged, false);
            assert.equal(obj.isChanged, false);

            assert(Array.isArray(obj.changed));
            assert.equal(obj.changed.length, 0);

            assert.equal(typeof obj.changes, 'object');
            assert.equal(Object.keys(obj.changes).length, 0);

            assert.deepEqual(obj.changedProperties, {});
        },
        'the object tracks changes': function(obj) {
            assert.equal(obj.foo_isChanged, false);

            obj.foo = 'baz';
            assert.equal(obj.foo_isChanged, true);
            assert.equal(obj.bar_isChanged, false);
            assert.equal(obj.foo_was, 'bar');
            assert.deepEqual(obj.foo_change, ['bar', 'baz']);

            assert.equal(obj.isChanged, true);
            assert.deepEqual(obj.changed, ['foo']);
            assert.deepEqual(obj.changes, {'foo': ['bar', 'baz']});

            assert.deepEqual(obj.changedProperties, {'foo': 'bar'});
        },
        'and trying to clean the object': {
            topic: function(obj) {
                obj.bar = 'changed_bar';
                return obj;
            },
            'setting it to the original value cleans it.': function(obj) {
                assert.equal(obj.foo_isChanged, true);
                obj.foo = 'bar';
                assert.equal(obj.foo_isChanged, false);
            },
            'calling reset_property cleans it': function(obj) {
                assert.equal(obj.foo_isChanged, false);
                obj.foo = 'new foo';
                assert.equal(obj.foo_isChanged, true);
                obj.reset_foo();
                assert.equal(obj.foo_isChanged, false);
            },
            'clearing changedProperties cleans it': function(obj) {
                assert.equal(obj.isChanged, true);
                obj.changedProperties.clear();
                assert.equal(obj.isChanged, false);
            }
        }
    }
}).export(module);