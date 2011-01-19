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

var sys = require('sys');
var connect = require('connect');
var zstatic = require('./zeppelin_static');
var zdyn = require('./zeppelin_dynamic');
var zwd = require('./zeppelin_webdav');
var jsDAV = require("jsdav");

var minute = 60000;
var memory;


/**
 * initialise the framework using the supplied config block
 */
/*
BUG: at the moment static stacks will be available on all ports and across all application
     blocks - refactor the static stack serving so that that static data is restricted to 
     specific blocks - do dyn first then create static stacks from roots
*/
exports.tearUp = function(config, callback)
{
//  process.on('uncaughtException', uncaughtHandler);
  memory = new connect.session.MemoryStore({ reapInterval: minute, maxAge: minute * 5 });

  zstatic.tearUp(config, function(roots, rootIndex, stacks)
  {
    zdyn.tearUp(roots, rootIndex, config, function(dynStack, applications)
    {
      stacks.unshift(dynStack);
      stacks.unshift(connect.logger());
      stacks.unshift(connect.session({ store: memory, secret: 'FrankZappa' }));
      stacks.unshift(connect.cookieDecoder());

//---------------------------------------------------------
// single application block hack for demo - need strategy to fix longer term
// due to single orign policy - possible solution is to split client editing code
// and load app under edit in a frame, use frame parent DOM as a means of writing edits back
      
      /*
      sys.debug(sys.inspect(applications));
      var allApps = applications[0].apps.concat(applications[1].apps);
      applications[0].apps = allApps;
      applications[1].apps = [];
      sys.debug(sys.inspect(applications));
      sys.puts("tearing up server for application block: " + applications[0].name + " (" + applications[0].description + ")");
      sys.puts("  host ip: " + applications[0].hostIp);
      sys.puts("  port: " + applications[0].portNumber);
      sys.puts("");
      var server = connect['createServer'].apply(this, stacks).listen(applications[0].portNumber, applications[0].hostIp);
      zwd.tearUp(server, applications);
      */

//---------------------------------------------------------

      applications.forEach(function(application)
      {
        sys.puts("tearing up server for application block: " + application.name + " (" + application.description + ")");
        sys.puts("  host ip: " + application.hostIp);
        sys.puts("  port: " + application.portNumber);
        sys.puts("");
        var server = connect['createServer'].apply(this, stacks).listen(application.portNumber, application.hostIp);
        if ("system" == application.name)
        {
          zwd.tearUp(server, applications);
        }
      })
      callback();
    });
  });
}


exports.hup = function(config)
{
}


/**
 * gracefully shutdown
 */
exports.tearDown = function()
{
  try
  {
  }
  catch (exp)
  {
  }
}


/*---------------------------------------------------------
 * module private */

var dataDriver = null;


var uncaughtHandler = function(err)
{
  console.log('---------------------------- Uncaught exception ------------------------------------');
  console.log(err);
}


//------------ experimental webdav ------------
/*

web dav module needs to ....
webdav must be running on the system stack - enable this by default - look for sysapps and treat as special for now...
iterate over all application configs for a block if 1 or more webdavs then mount the application folder
and attach webdav to the 

pass apps to webdav - will crete a flat list of apps to put webdav on
and mount onto stack
*/


//jsDAV.debugMode = true;

//var server = jsDAV.createServer({node: __dirname }, 8000);
//jsDAV.mount(__dirname, "test", server);
      
//---------------------------------------------

