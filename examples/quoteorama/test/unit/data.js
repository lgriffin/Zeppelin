#!/usr/bin/env node
/*
 * test quote data
 */

require.paths.unshift('/home/pelger/work/node/node-mongodb-native/lib/mongodb');
var sys = require('sys');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

var db = new Db("quoteorama-development", new Server("localhost", 27017, {}), {});
db.open(function(err, db)
{
  db.collection("quotes", function(err, collection) 
  {
  /*
      collection.find({}, function(err, cursor)
      {
        cursor.toArray(function (err, items)
        {
          sys.debug("**************" + JSON.stringify(items));
        });
      });
      */
    collection.insert([{'quote':'Lets get serious, no lets dont, lets mime the hard parts'}, 
                       {'quote':'Maybe your good looking, well watchout cos theres a lot more of us ugly mother f**kers than you'}, 
                       {'quote':'Take the Kama Sutra. How many people died from the Kama Sutra, as opposed to the Bible? Who wins?'}, 
                       {'quote':'A wise man once said, never discuss philosophy or politics in a disco environment.'}, 
                       {'quote':'Jazz is not dead, it just smells funny.'}, 
                       {'quote':'Remember theres a big difference between kneeling down and bending over'}], function(err, docs)
                       {
                         sys.debug("ERROR = " + err);
                         db.close();
                       });
  });
});

