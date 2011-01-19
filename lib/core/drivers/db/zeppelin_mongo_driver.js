/* 
 * Author: P.Elger
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED 
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE. 
 */         

/*---------------------------------------------------------
 * zeppelin mongo driver - layered over node-mongodb-native */

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectID= require('mongodb/bson/bson').ObjectID;
var sys = require('sys');


exports.def = 
{
  host: null,
  port: null,
  name: null,
  db: null,

  tearUp: function(callback)
  {
    if (undefined == this.db || null == this.db)
    {
      this.db = new Db(this.name, new Server(this.host, this.port, {}), {});
      this.db.open(function(err, db)
      {
        this.db = db;
        if (null != err) 
        { 
          throw err; 
        }
        callback();
      });
    }
  },


  tearDown: function()
  {
    this.db.close();
  },


  create: function(collectionName, data, callback)
  {
    if (null != this.db)
    {
      this.db.collection(collectionName, function(err, collection)
      {
        if (null != collection)
        {
          collection.insert(data, function(err, docs)
          {
            callback(err, docs);
          });
        }
      });
    }
  },


  find: function(collectionName, query, callback)
  {
    if (null != this.db)
    {
      this.db.collection(collectionName, function(err, collection) 
      {
        if (null != err) 
        {
          throw err;
        }

        collection.find(query, function(err, cursor)
        {
          cursor.toArray(function (err, items)
          {
            callback(items);
          });
        });
      });
    }
  },


  update: function(collectionName, id, data, callback)
  {
    if (null != this.db)
    {
      this.db.collection(collectionName, function(err, collection)
      {
        if (null != collection)
        {
          collection.update({ _id : ObjectID.createFromHexString(id) }, data, function(err, docs)
          {
            callback(err, docs);
          });
        }
      });
    }
  },


  remove: function(collectionName, id, callback)
  {
    if (null != this.db)
    {
      this.db.collection(collectionName, function(err, collection)
      {
        collection.remove({ _id : ObjectID.createFromHexString(id) }, function(err, docs)
        {
          callback(err, docs);
        });
      });
    }
  },


  removeAll: function(collectionName, callback)
  {
    if (null != this.db)
    {
      this.db.collection(collectionName, function(err, collection)
      {
        if (null != collection)
        {
          collection.find({}, function(err, cursor)
          {
            collection.remove(function(err, docs)
            {
              callback(err, docs);
            });
          });
        }
      });
    }
  }
}

