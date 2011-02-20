/* 
 * Author: Peter Elger
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

/*
RR note:
can't use just the controller name as the cache key - this would cause horrible
problems if one had 2 apps with the same controller name!
*/


var sys = require("sys");
var baseModelDef = require('./zeppelin_model').def;
var baseHelperDef = require('./zeppelin_helper').def;
var baseControllerDef = require('./zeppelin_controller').def;

var models = [];
var controllers = [];
var helpers = [];
var appLookupIndex;


exports.def = 
{
  tearUp: function(lookupIndex)
  {
    appLookupIndex = lookupIndex;
  },


  getController: function(callSpec)
  {
    return tearUpController(callSpec.app, callSpec.controller);
  }
};


var zappkey = function(appName, name)
{
  return appName + name;
};


var tearUpController = function(appName, name) 
{
  var controller = controllers[zappkey(appName, name)];

  if (!controller) 
  {
    var controllerRequire = zeppelinRequire(appName, 'controller', name);
    if (controllerRequire) 
    {
      var controllerDef = controllerRequire.def;
      var model  = tearUpModel(appName, name);
      var helper = tearUpHelper(appName, name);
      var baseController = baseControllerDef.imbue({model:model, helper:helper});
      controller = controllers[zappkey(appName, name)] = baseController.imbue(controllerDef);
    }
  }
  console.log('app.controller(' + name + ')=', controller);
  return controller;
};



var tearUpModel = function(appName, name) 
{
  var model = models[zappkey(appName, name)];
  if (!model) 
  {
    var modelRequire = zeppelinRequire(appName, 'model', name);
    if (modelRequire) 
    {
      var modelDef = modelRequire.def;
      var modelCollection = modelRequire.collection;
      var modelKey = modelRequire.key;
      var baseModel = baseModelDef.imbue({driver: appLookupIndex[appName].driver,
                                          collection: modelCollection,
                                          key: modelKey});
      model = models[zappkey(appName, name)] = baseModel.imbue(modelDef);
    }
  }
  console.log('app.model(' + name + ') = ', model);
  return model;
};


var tearUpHelper = function(appName, name) 
{
  var helper = helpers[zappkey(appName, name)];

  if (!helper) 
  {
    var helperRequire = zeppelinRequire(appName, 'helper', name);
    if (helperRequire) 
    {
      var helperDef  = helperRequire.def;
      var baseHelper = baseHelperDef.imbue({});
      helper = helpers[zappkey(appName, name)] = baseHelper.imbue(helperDef);
      // FIX: init should really get some sort of content - config settings?
      //helper.init && helper.init();
    }
  }
  console.log('app.helper(' + name + ')', helper);
  return helper;
};


var zeppelinRequire = function(appName, type, name) 
{
  var component = null;
  try 
  {
    component = require(appLookupIndex[appName].path + "/app/" + type + "s/" + name);
  }
  catch(e) 
  {
    sys.debug("ERROR: component not resolved:");
    sys.debug("app: " + appName);
    sys.debug("type: " + type);
    sys.debug("name: " + name);
    sys.debug("luindex: " + appLookupIndex[appName]);
    sys.debug("path: " + appLookupIndex[appName].path + "/app/" + type + "s/" + name);
  }
  return component;
};


