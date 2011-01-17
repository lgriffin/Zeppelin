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

var connect = require('connect');
var sys = require('sys');
var zfs = require('./zeppelin_fs');
var zurl = require('./zeppelin_url');
var mongoDef = require('./drivers/db/zeppelin_mongo_driver').def;
var baseModelDef = require('./framework/zeppelin_model').def;
var baseControllerDef = require('./framework/zeppelin_controller').def;


/* match url as /type.application/controller.method/[target/template] 
   or as /type.application/controller.method/(callback) */
//var matchUrl = /(.*)\.(.*)\/(.*)\.(.*)\/[\[%5B(].*/;
var matchUrl = /(.*)\.*(.*)\/(.*)\.(.*)\/[\[%5B(].*/;


/*---------------------------------------------------------
 * zeppelin dynamic stack */

/**
 * scan app folder for applications. An application is identified by a config.js
 */
exports.tearUp = function(sRoots, staticRootIndex, config, callback)
{
  staticRoots = sRoots;
  zurl.setStaticRootIndex(staticRootIndex);

  applications = locateApplicationRoots(config, applications);
  applications = sortApplications(applications);
  tearUpApplications(config, applications, function(applications)
  {
    //applications = tearUpFilters(config, applications);
    printApplications(applications);
    callback(dynStack, applications);
  });
}


/*---------------------------------------------------------
 * module private */

var applications = [];
var appLookupIndex = [];
var staticRoots = [];
var drivers = [];
var controllers = [];


var dynStack = connect.router(function(app) 
{
  app.get(matchUrl, function(req, res, next) 
  {
    req.on('end', function() {
      scrutinize(req, res, null, next);
    });
  });


  app.post(matchUrl, function(req, res, params, next) 
  {
    var clientParams;
    var body = [];

    req.on('data', function(data) {
        body.push(data.toString('utf8'));
    });

    req.on('end', function() {
      clientParams = '' == body.join('') ? {} : JSON.parse(body);
      scrutinize(req, res, clientParams, next);
    });
  });
});


/**
 * this is the guts of it. parse the url and attempt to macth up to an application controller
 * if a match can be made, load in the controller and cache it against the application
 */
var scrutinize = function(req, res, clientParams, next) 
{
  var callSpec;
  var paramMap = {};

  try
  {
    sys.puts(req.url);
    callSpec = zurl.parse(unescape(req.url))
    if (null != callSpec && null != appLookupIndex[callSpec.app])
    {
      var controller = instantiateModelAndController(appLookupIndex, controllers, callSpec);

      res.writeHead(200, { "Content-Type" : "text/json" });
      if (null == clientParams && null != callSpec.parameters)
      {
        clientParams = JSON.parse(callSpec.match[callSpec.parameters]);
      }

      if (null != clientParams)
      {
        for (var paramIndex = 0; paramIndex < clientParams.length; ++paramIndex)
        {
          paramMap[clientParams[paramIndex].name] = clientParams[paramIndex].value;
        }
      }

      var params = { template: callSpec.viewPath,
                     clientCallback: callSpec.callback,
                     req: req,
                     res: res,
                     clientParams: clientParams,
                     params: paramMap,
                     next: null,
                     config: appLookupIndex[callSpec.app].config,
                     callback: function(params) { res.end() } };

/*---------------------------------------------------------
 * experimental - if sys app add additional parameters */

    params.staticRoots = staticRoots;
    params.applications = applications;

/*---------------------------------------------------------
 */

//      runBeforeFilters(applications, callSpec, req, res);
      if (undefined == controller[callSpec.method])
      {
        controller.base[callSpec.method](params);
      }
      else
      {
        controller[callSpec.method](params);
      }
//      runAfterFilters(applications, callSpec, req, res);
    }
    else
    {
      sys.puts("---------- BAD REQUEST ----------");
      res.writeHead(500, { "Content-Type" : "text/json" });
      res.write("bad url");
      res.end();
    }
  }
  catch (exp)
  {
    try
    {
      sys.puts("Exception: " + exp);
      res.end();
    }
    catch (exp2)
    {
      sys.puts("Cascaded exception no repsonse sent: " + exp2);
    }
  }
}


/**
 * assumes model and controller have identical file names
 */
var instantiateModelAndController = function(appLookupIndex, controllers, callSpec)
{
  var controllerKey = "" + callSpec.app + callSpec.controller;

  if (null == controllers[controllerKey])
  {
    var appConfig = appLookupIndex[callSpec.app].config;
    var modelDef = require(appLookupIndex[callSpec.app].path + "/app/models/" + callSpec.controller).def;
    var modelCollection = require(appLookupIndex[callSpec.app].path + "/app/models/" + callSpec.controller).collection;
    var modelKey = require(appLookupIndex[callSpec.app].path + "/app/models/" + callSpec.controller).key;
    var baseModel = baseModelDef.imbue({driver: appLookupIndex[callSpec.app].driver,
                                        collection: modelCollection,
                                        key: modelKey});
    //var model = modelDef.imbue({base: baseModel});
    var model = baseModel.imbue(modelDef);

    var controllerDef = require(appLookupIndex[callSpec.app].path + "/app/controllers/" + callSpec.controller).def;
    var baseController = baseControllerDef.imbue({model: model});
    //var controller = controllerDef.imbue({base: baseController});
    var controller = baseController.imbue(controllerDef);

    controllers[controllerKey] = controller;
  }
  return controllers[controllerKey];
}



var runBeforeFilters = function(appLookupIndex, callSpec, req, res)
{
  var filters = null;

  if (null != (filters = readFilters(appLookupIndex, callSpec)))
  {
    for (var filter in filters)
    {
      filters[filter].before(req, res, appLookupIndex[callSpec.app]);
    }
  }
}


var runAfterFilters = function(appLookupIndex, callSpec, req, res)
{ 
  var filters = null;

  if (null != (filters = readFilters(appLookupIndex, callSpec)))
  {
    for (var filter in filters)
    {
      filters[filter].after(req, res, appLookupIndex[callSpec.app]);
    }
  }
} 


var readFilters = function(appLookupIndex, callSpec)
{
  var filters = appLookupIndex[callSpec.app].config.filters;
  var face = callSpec.extension;
  var result = null;

  if (undefined != filters && null != filters)
  {
    if (undefined == face || null == face)
    {
      face = "default";
    }
    result = filters[face];
  }
  return result;
}


/**
 * locates application roots then order on length so that shorter paths (higher up)
 * get searched first
 */
var locateApplicationRoots = function(config, applications)
{
  applications = [];
  for (var applicationIndex = 0; applicationIndex < config.applications.length; ++applicationIndex)
  {
    applications.push(config.applications[applicationIndex]);
    applications[applicationIndex].apps = [];
    for (var rootIndex = 0; rootIndex < config.applications[applicationIndex].roots.length; ++rootIndex)
    {
      zfs.recurse(config.applications[applicationIndex].roots[rootIndex],
                  /zconfig\.js/,
                  function(file)
                  {
                    applications[applicationIndex].apps.push({ path: file.split("\/zconfig.js")[0] });
                  //  applicatapplicationRoots[applicationBlockIndex].push(file.split("\/zconfig.js")[0]);
                  },
                  null);
    }
  }
  return applications;
}


var tearUpApplications = function(globalConfig, applications, callback)
{
  var blockCount = 0;
  appLookupIndex = [];
  for (var blockIndex = 0; blockIndex < applications.length; ++blockIndex)
  {
    ++blockCount;
    for (var appIndex = 0; appIndex < applications[blockIndex].apps.length; ++appIndex)
    {
      var config;
      var applicationPath;
      var pathSplit;

      pathSplit = applications[blockIndex].apps[appIndex].path.split("\/");
      config = require(applications[blockIndex].apps[appIndex].path + "/zconfig").config;
      applications[blockIndex].apps[appIndex].name = pathSplit[pathSplit.length - 1];
      applications[blockIndex].apps[appIndex].config = config;
      appLookupIndex[applications[blockIndex].apps[appIndex].name] = applications[blockIndex].apps[appIndex];
    }
  }
  var callbackCount = 0;
  for (var blockIndex = 0; blockIndex < applications.length; ++blockIndex)
  {
    tearUpDrivers(globalConfig, applications[blockIndex].apps, 0, function(applications)
    {
      if (++callbackCount >= blockCount)
      {
        callback(applications);
      }
    });
  }
}


var tearUpDrivers = function(globalConfig, apps, index, callback)
{
  if (index < apps.length)
  {
    var dbName = apps[index].config.environments[apps[index].config.live.environment].database;
    if (undefined == drivers[dbName] || null == drivers[dbName])
    {
      driver = mongoDef.imbue({host: globalConfig.environments[globalConfig.live.environment].database.host,
                               port: globalConfig.environments[globalConfig.live.environment].database.port,
                               database: dbName});
      drivers[dbName] = driver;
      apps[index].driver = driver;
      driver.tearUp(function()
      {
        tearUpDrivers(globalConfig, apps, ++index, callback);
      });
    }
    else
    {
      apps[index].driver = driver;
      tearUpDrivers(globalConfig, apps, ++index, callback);
    }
  }
  else
  {
    callback(applications);
  }
}


var tearUpFilters = function(globalConfig, applications)
{
  for (var blockIndex in applications)
  {
    for (var appIndex in applications[blockIndex].apps)
    {
      for (var faceIndex in applications[blockIndex].apps[appIndex].config.filters)
      {
        for (var filter in applications[blockIndex].apps[appIndex].config.filters[faceIndex])
        {
          if (null != applications[blockIndex].apps[appIndex].config.filters[faceIndex][filter])
          {
            applications[blockIndex].apps[appIndex].config.filters[faceIndex][filter] = require(applications[blockIndex].apps[appIndex].config.filters[faceIndex][filter]);
          }
        }
      }
    }
  }
}


var printApplications = function(applications)
{
  var appName;

  sys.puts("");
  sys.puts("zeppelin dynamic serving applications:");

  for (var blockIndex in applications)
  {
    for (var appIndex in applications[blockIndex].apps)
    {
      sys.puts("");
      sys.puts("  " + applications[blockIndex].apps[appIndex].name + ":");
      sys.puts("    " + applications[blockIndex].apps[appIndex].path);
      sys.puts("      enabled: " + applications[blockIndex].apps[appIndex].config.live.enabled);
      sys.puts("      environment: " + applications[blockIndex].apps[appIndex].config.live.environment);
      sys.puts("        " + JSON.stringify(applications[blockIndex].apps[appIndex].config.environments[applications[blockIndex].apps[appIndex].config.live.environment]));
    }
  }
  sys.puts("");
}


var sortApplications = function(applications)
{
  for (app in applications)
  {
    applications[app].apps.sort(sortFunction);
  }
  return applications;
}


var sortFunction = function(app1, app2)
{
  return app2.path.length - app2.path.length;
}

