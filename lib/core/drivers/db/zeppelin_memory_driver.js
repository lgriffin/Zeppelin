/* 
 * Author: Richard Rodger
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

/* In-memory driver.
 * Useful for debugging, hacking and as a template for new drivers.
 * Depends:
 * npm install node-uuid
 */

"use strict"

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var ObjectID= require('mongodb/bson/bson').ObjectID;

var util = require('util');
var uuid = require('node-uuid');

var memory = null




var def = exports.def = 
{
  // async print activity to stdout
  print:false,

  _print: function(msg) 
  {
    this.print && util.debug('MEMORY-DRIVER (ms='+(new Date().getTime()%10000000)+'): '+msg);
  },


  _sane: function(memory, collectionName, args, callback, win) {
    var ok = true
    var msg = 'ERROR: '

    if( !memory ) {
      msg += 'no memory'
    }
    else if( !collectionName ) {
      msg += 'no collection'
    }

    for( var aI = 0; aI < args.length; aI++ ) {
      var argspec = args[aI]
      if( !argspec[1] ) {
        msg += 'no '+argspec[0]
        ok = false
        break
      }
    }

    ok && win()
    !ok && this._print(msg) && callback(msg)
  },


  tearUp: function(callback)
  {
    this._print('tearUp')
    memory = {}
    callback();
  },


  tearDown: function()
  {
    this._print('tearDown')
    memory = null
    // wait for the GC I guess...
  },


  create: function(collectionName, entitys, callback)
  {
    var self = this
    self._print('create')
    self._sane(memory, collectionName, [['entity(s)',entitys]], callback, function(){
      memory[collectionName] = memory[collectionName] || {}

      entitys = Array.isArray(entitys) ? entitys : [entitys]

      for( var eI = 0; eI < entitys.length; eI++ ) {
        var entity = entitys[eI]
        entity._id = entity._id || uuid()
        self._print('creating:'+JSON.stringify(entity))

        memory[collectionName][entity._id] = entity
      }

      callback(null,entitys)
    })
  },


  find: function(collectionName, query, callback)
  {
    var self = this
    self._print('find:'+JSON.stringify(query))
    self._sane(memory, collectionName, [['query',query]], callback, function(){
      memory[collectionName] = memory[collectionName] || {}
      var items = []
      for( var _id in memory[collectionName] ) {
        var entity = memory[collectionName][_id]
        
        for( var qn in query ) {
          if( query[qn] == entity[qn] ) {
            items.push(entity)
          }
        }
      }
      self._print('found:'+items.length)
      callback(items)
    })
  },


  update: function(collectionName, id, entity, callback)
  {
    var self = this
    self._print('update:'+id+':'+JSON.stringify(entity))
    self._sane(memory, collectionName, [['id',id],['entity',entity]], callback, function(){
      memory[collectionName] = memory[collectionName] || {}

      if( memory[collectionName][id] ) {
        memory[collectionName][id] = entity
        entity._id = id
        self._print('updated:'+id)
        callback(null,[entity])
      }
      else {
        callback('not found: '+collectionName+'/'+id)
      }
    })
  },


  remove: function(collectionName, id, callback)
  {
    var self = this
    self._print('remove:'+id)
    self._sane(memory, collectionName, [['id',id]], callback, function(){
      memory[collectionName] = memory[collectionName] || {}

      if( memory[collectionName][id] ) {
        delete memory[collectionName][id];
        self._print('removed:'+id)
        callback()
      }
    })
  },


  removeAll: function(collectionName, callback)
  {
    this._print('removeAll')
    this._sane(memory, collectionName, [], callback, function() {
      memory[collectionName] = {}

      callback(null,[])
    })
  }
}

