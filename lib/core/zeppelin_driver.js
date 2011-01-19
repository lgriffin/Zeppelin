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

/** Database driver handling */

var zfs = require('./zeppelin')

var eyes = require('eyes')
var util = require('util')
var _ = require('underscore')


var drivers = []

exports.tearUpDrivers = function(globalConfig,apps,callback) {
  var tearups = 0
  apps.forEach(function(app)
  {
    exports.tearUpDriver(globalConfig,app,function()
    {
      tearups++
      if( tearups == apps.length ) 
      {
        callback()
      }
    })
  })
}

exports.tearUpDriver = function(globalConfig, app, callback)
{
  var config = app.config
  var env    = config.live.environment

  var globalDatabase = globalConfig.environments[env].database
  var appDatabase    = config.environments[env].database

  var database = _.extend({},globalDatabase,appDatabase)

  var driverDef = require('./drivers/db/zeppelin_'+database.driver+'_driver').def;
  app.driver    = driverDef.imbue(database)

  app.driver.tearUp(function(){
    //eyes.inspect(app)
    callback()
  })
}
