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

var sys = require('sys');
var assert = require('assert');
var http = require('http');
var util = require('./test_util');
var zappaCore = require('../../../lib/core/zappa_core');
var config = require('../../../config').config;


module.exports =
{
  testTearUp: function(beforeExit)
  {
    var done = false;

    beforeExit(function()
    {
      assert.equal(true, done);
      zappaCore.tearDown();
    });

    config.applications[0].roots[0] = util.testAppPath();
    zappaCore.tearUp(config, function()
    {
      //getPage(localhost, 
      done = true;
    });
  }
}


getPage = function(host, url, port, callback)
{
  var client = http.createClient(port, url);
  var request = client.request('GET', url, {'host': host});
  request.end();
  request.on('response', function (response) 
  {
    console.log('STATUS: ' + response.statusCode);
    console.log('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) 
    {
      console.log('BODY: ' + chunk);
      callback();
    });
  });
}


postForm = function()
{
}


