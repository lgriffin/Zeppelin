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
var assert = require('assert');
var mongoDriver = require('../../../../../lib/core/drivers/db/zappa_mongo_driver').def;
var zappa = require('../../../../../lib/core/zappa').def;
var _collection = 'drivertest';


exports.testDriver = function(beforeExit)
{
  var done = false;
  var driver;

  beforeExit(function()
  {
    assert.equal(done, true);
  });

  driver = mongoDriver.imbue({host: "localhost", port: 27017, database: "zappatest"});
  driver.tearUp(function() 
  {
    driver.removeAll(_collection, function(err, docs)
    {
      driver.create(_collection, { test1: "wibble" }, function(err, docs) 
      {
        assert.ok(docs);
        driver.create(_collection, { test2: "bibble" }, function(err, docs) 
        {
          assert.ok(docs);
          driver.find(_collection, {test1: "wibble"}, function(items) 
          {
            assert.ok(items);
            assert.equal(items.length, 1);
            driver.update(_collection, JSON.stringify(items[0]._id).slice(1, 25), { test1: "bibble" }, function(err, docs) 
            {
              assert.ok(docs);
              driver.find(_collection, {test1: "bibble"}, function(items) 
              {
                assert.ok(items);
                assert.equal(items.length, 1);
              });

              driver.find(_collection, {test1: "wibble"}, function(items) 
              {
                assert.ok(items);
                assert.equal(items.length, 0);
                driver.tearDown();
                done = true;
              });
            });
          });
        });
      });
    });
  });
}


