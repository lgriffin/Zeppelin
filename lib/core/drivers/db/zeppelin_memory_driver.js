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

var util = require('util');
var uuid = require('node-uuid');

// need to keep a global index so that you can connect to same memory store multiple times
var space = {}




var def = exports.def = 
{
  // async print activity to stdout
  print:false,
  name:null,
  
  _memory: null,

  _print: function(msg) 
  {
    this.print && 
      util.debug('MEMORY-DRIVER (n='+this.name+';m='+(new Date().getTime()%10000000)+'): '+msg);
  },


  _sane: function(_memory, collectionName, args, callback, win) {
    var ok = true
    var msg = 'ERROR: '

    if( !_memory ) {
      msg += 'no _memory'
    }
    else if( !this.name ) {
      msg += 'no name'
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
    var self = this
    self._print('tearUp')

    if( !self.name ) {
      callback('no name')
    }
    else {
      self._memory = space[self.name] || {}
      callback();
    }
  },


  tearDown: function()
  {
    var self = this
    self._print('tearDown')
    self._memory = null
    // data still remains in _memory as referenced from space var
    // use removeAll to kill completely
  },


  create: function(collectionName, entitys, callback)
  {
    var self = this
    self._print('create')
    self._sane(self._memory, collectionName, [['entity(s)',entitys]], callback, function(){
      self._memory[collectionName] = self._memory[collectionName] || {}

      entitys = Array.isArray(entitys) ? entitys : [entitys]

      for( var eI = 0; eI < entitys.length; eI++ ) {
        var entity = entitys[eI]
        entity._id = entity._id || uuid()
        self._print('creating:'+JSON.stringify(entity))

        self._memory[collectionName][entity._id] = entity
      }

      callback(null,entitys)
    })
  },


  find: function(collectionName, query, callback)
  {
    var self = this
    self._print('find:'+JSON.stringify(query))
    self._sane(self._memory, collectionName, [['query',query]], callback, function(){
      self._memory[collectionName] = self._memory[collectionName] || {}
      var items = []
      for( var _id in self._memory[collectionName] ) {
        var entity = self._memory[collectionName][_id]
        
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
    self._sane(self._memory, collectionName, [['id',id],['entity',entity]], callback, function(){
      self._memory[collectionName] = self._memory[collectionName] || {}

      if( self._memory[collectionName][id] ) {
        self._memory[collectionName][id] = entity
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
    self._sane(self._memory, collectionName, [['id',id]], callback, function(){
      self._memory[collectionName] = self._memory[collectionName] || {}

      if( self._memory[collectionName][id] ) {
        delete self._memory[collectionName][id];
        self._print('removed:'+id)
        callback()
      }
    })
  },


  removeAll: function(collectionName, callback)
  {
    var self = this
    self._print('removeAll')
    self._sane(self._memory, collectionName, [], callback, function() {
      self._memory[collectionName] = {}

      callback(null,[])
    })
  }
}

