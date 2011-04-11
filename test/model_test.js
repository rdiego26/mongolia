var testosterone = require('testosterone')({post: 3000, sync: true}),
    assert = testosterone.assert,
    gently = global.GENTLY = new (require('gently')),

    Model = require('./../lib/model'),
    collection_proxy = require('./../lib/helpers/collection_proxy'),
    mongodb = require('mongodb'),
    Db = mongodb.Db,
    Server = mongodb.Server,

    db = new Db('mongolia_test', new Server('localhost', 27017, {auto_reconnect: true, native_parser: true}), {}),

    User = function (db) {
      var user = Model(db, 'users');
      return user;
    },

    User = User(db),
    sys = require('sys')

testosterone

  .add('Throws an error when there is no db', function () {
    assert.throws(function () {
        var model = Model(null);
      }, /You must specify a db/);
  })

  .add('Throws an error when collection is missing', function () {
    assert.throws(function () {
        var model = Model(db);
      }, /You must specify a collection name/);
  })

  .add('#getCollection returns a document collection', function () {
    // gently.expect(db, 'getCollection');
    // gently.expect(db, 'getCollection', function(collection_name, callback) {
    //   assert.equal(collection_name, 'users');
    // });

    assert.ok(typeof User.getCollection(function (error, collection) {}) === 'object');
  })

  .add('#mongo proxies `collection` calls', function () {
    cb = function(error, doc) {};

    gently.expect(collection_proxy, 'proxy', function(fn, collection, args, callback) {
      assert.equal(fn, 'findArray');
      assert.equal(collection.collectionName, 'users');
      assert.deepEqual(args[0], {"name":"Pau"});
      assert.equal(callback, cb);
    });

    User.mongo('findArray', {name: 'Pau'}, cb);
  })

  .run(function () {
    require('sys').print('done!');
  });