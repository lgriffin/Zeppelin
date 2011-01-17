/* 
 * Author: P.Elger - 2010 Betapond (betapond.com) - All rights reserved. 
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED 
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES 
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
 * DISCLAIMED.  IN NO EVENT SHALL THE Betapond BE LIABLE FOR ANY DIRECT, 
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE 
 * POSSIBILITY OF SUCH DAMAGE. 
 */         

var assert = require('assert');
var sys = require('sys');
var zappa = require('../../../../lib/core/zappa');
var driverMod = require('../../../../lib/core/drivers/db/zappa_mongo_driver').def;
var modelMod = require('../../../../lib/core/framework/zappa_model').def;
var modelExtensionMod = require('./fw_model').def;
var controllerMod = require('../../../../lib/core/framework/zappa_controller').def;
var controllerExtensionMod = require('./fw_controller').def;

var _host = 'localhost';
var _port = 27017;
var _database = 'zappatest';
var _collection = 'controllertest';
var _key = 'testKey';

var params = { template: "templateUrl",
               clientCallback: "clientCallBackFunction",
               req: null,
               res: { write: function(response) 
                             { 
                               assert.ok(response);
                             } },
               clientParams: null,
               next: null,
               callback: null };

exports.testMc = function(beforeExit)
{
  var done = false;
  var driver;
  var baseModel;
  var baseController;
  var model;
  var controller;

  beforeExit(function()
  {
    assert.equal(done, true);
  });

  driver = driverMod.imbue({host: "localhost", port: 27017, database: "zappatest"});
  driver.tearUp(function() 
  {
    baseModel = modelMod.imbue({driver: driver, collection: "controllertest", key: "testKey"});
    model = baseModel.imbue(modelExtensionMod);

    model.removeAll(function(err)
    {
      assert.isNull(err);
      model.create("wibble", function(err)
      {
        assert.isNull(err);
        model.create("bibble", function(err)
        {
          assert.isNull(err);

          baseController = controllerMod.imbue({model: model});
          controller = baseController.imbue(controllerExtensionMod);
          params.callback = function(params) 
          {
            assert.isNull(err);
            assert.ok(params);
            done = true;
            driver.tearDown();
          }
          assert.isNull(err);
          controller.random(params);
        });
      });
    });
  });
}

//exports.testMc(function() {})

