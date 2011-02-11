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

/* Amazon AWS SimpleDB driver.
 * Requires the simpledb module and you need to have an Amazon AWS account so you can get the API keys.
 * npm install simpledb
 */

"use strict"


var eyes = require('eyes');

var util = require('util');
var uuid = require('node-uuid');
var simpledb = require('simpledb');



var knownCollections = {}

function sdberr(callback,win) {
  return function(err,res,meta){
    if(err) {
      eyes.inspect(err)
      callback(err)
    }
    else {
      win(res)
    }
  }
}




var def = exports.def = 
{
  // async print activity to stdout
  print:false,

  // simpledb logger callback, optional, overrides print
  logger: null,

  // simpledb config options go here
  // required:
  keyid: null,
  secret: null,

  _sdb: null,

  _print: function(msg) 
  {
    this.print && 
      util.debug('SIMPLEDB-DRIVER (m='+(new Date().getTime()%10000000)+'): '+msg);
  },


  _sane: function(collectionName, args, callback, win) {
    var self = this
    var ok = true
    var msg = 'ERROR: '

    if( !self._sdb ) {
      msg += 'no simpledb.SimpleDB instance'
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


  _autoCreateDomain: function( collectionName, callback, win ) {
    var self = this
    if( knownCollections[collectionName] ) {
      win()
    }
    else {
      self._sdb.createDomain(collectionName,sdberr(callback,function(res){
        knownCollections[collectionName] = true
        win()
      }))
    }
  },


  tearUp: function(callback)
  {
    var self = this
    self._print('tearUp')

    if( !self.keyid ) {
      callback('no keyid')
    }
    else if( !self.secret ) {
      callback('no secret')
    }
    else {
      self._sdb = new simpledb.SimpleDB(
        self, self.logger ? self.logger : self.print ? simpledb.debuglogger : null )

      callback();
    }
  },


  tearDown: function()
  {
    var self = this
    self._print('tearDown')
    // nothing to do really, SimpleDB is a web service
  },


  create: function(collectionName, entitys, callback)
  {
    var self = this
    self._print('create')
    self._sane( collectionName, [['entity(s)',entitys]], callback, function(){
      self._autoCreateDomain(collectionName,callback,function(){
        entitys = Array.isArray(entitys) ? entitys : [entitys]

        function putItem(eI){
          if( eI < entitys.length ) {
            var entity = entitys[eI]
            entity._id = entity._id || uuid()
            self._print('creating:'+JSON.stringify(entity))

            self._sdb.putItem(collectionName,entity._id,entity,sdberr(callback,function(res){
              putItem(eI+1)
            }))
          }
          else {
            callback( null, entitys )
          }
        }

        putItem(0)
      })
    })
  },


  find: function(collectionName, query, callback)
  {
    var self = this
    self._print('find:'+JSON.stringify(query))
    self._sane( collectionName, [['query',query]], callback, function(){
      self._autoCreateDomain(collectionName,callback,function(){

        var qstr = ['select * from',collectionName]
        var vals = []
        for( var qn in query ) {
          qstr = qstr.concat( ['and',qn,"='?'" ])
          vals.push(query[qn])
        }
        if(2 < qstr.length){
          qstr[2] = 'where'
        }

        self._sdb.select(qstr.join(' '),vals,sdberr(callback,function(res){
          self._print('found:'+res.length)
          for( var rI = 0; rI < res.length; rI++ ) {
            delete res[rI].$ItemName
          }
          callback(res)
        }))
      })
    })
  },


  update: function(collectionName, id, entity, callback)
  {
    var self = this
    self._print('update')
    self._sane( collectionName, [['id',id],['entity',entity]], callback, function(){
      self._autoCreateDomain(collectionName,callback,function(){

        entity._id = id
        self._print('updating:'+JSON.stringify(entity))

        self._sdb.putItem(collectionName,entity._id,entity,sdberr(callback,function(res){
          callback(null,entity)
        }))
      })
    })
  },


  remove: function(collectionName, id, callback)
  {
    var self = this
    self._print('remove:'+id)
    self._sane( collectionName, [['id',id]], callback, function(){
      self._sdb.deleteItem(collectionName,id,sdberr(callback,function(){
        self._print('removed:'+id)
        callback()
      }))
    })
  },


  removeAll: function(collectionName, callback)
  {
    var self = this
    self._print('removeAll')
    self._sane( collectionName, [], callback, function() {
      self._autoCreateDomain(collectionName,callback,function(){

        self._sdb.select('select * from '+collectionName,sdberr(callback,function(res){

          var rI = -1
          function deleteItem() {
            rI++
            if( rI < res.length ) {
              self._sdb.deleteItem(collectionName,res[rI].$ItemName,sdberr(callback,deleteItem))
            }
            else {
              callback()
            }
          }
          deleteItem()
        }))
      })
    })
  }
}

