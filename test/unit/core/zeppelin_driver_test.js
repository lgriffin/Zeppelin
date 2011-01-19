/* 
 * Author: Richard Rodger
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

var sys = require('sys')
var assert = require('assert')
var util = require('util')

var config = require('../../../lib/config').config
var zdriver = require('../../../lib/core/zeppelin_driver')


var app = {
  config:{
    live:{
      environment:'test'
    },
    environments:{
      test:{
        database:{
          driver:'memory',
          name:'testdriver',
          print:true
        }
      }
    }
  }
}

var apps = [
  app,
  {
    config:{
      live:{
        environment:'test'
      },
      environments:{
        test:{
          database:{
            driver:'mongo',
            name:'testdriver',
            host:'localhost',
            port:27017
          }
        }
      }
    }
  }
]


module.exports =
{
  testTearUpDriver: function(beforeExit)
  {
    var done = false;
    beforeExit(function()
    {
      assert.equal(true, done);
    });

    zdriver.tearUpDriver(config, app, function()
    {
      app.driver.tearDown()
      done = true
    });
  },

  testTearUpDrivers: function(beforeExit) {
    var done = false;
    beforeExit(function()
    {
      assert.equal(true, done);
    });

    zdriver.tearUpDrivers(config, apps, function()
    {
      apps.forEach(function(app){
        app.driver.tearDown()
      })
      done = true
    });
  }
}
