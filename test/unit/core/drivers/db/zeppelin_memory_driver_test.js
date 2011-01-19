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

var sys = require('sys');
var assert = require('assert');
var memoryDriver = require('../../../../../lib/core/drivers/db/zeppelin_memory_driver').def;
var zeppelin = require('../../../../../lib/core/zeppelin').def;
var _collection = 'drivertest';

var util = require('util')


exports.testDriver = function(beforeExit)
{
  var done = false;
  var driver;

  beforeExit(function()
  {
    assert.equal(done, true);
  });

  driver = memoryDriver.imbue({print:true});
  driver.tearUp(function() 
  {
    driver.removeAll(_collection, function(err, docs)
    {
      driver.create(_collection, { test1: "wibble" }, function(err, docs) 
      {
        assert.ok(docs);
        driver.create(_collection, { test2: "zibble" }, function(err, docs) 
        {
          assert.ok(docs);
          driver.find(_collection, {test1: "wibble"}, function(items) 
          {
            assert.ok(items);
            assert.equal(items.length, 1);
            driver.update(_collection, items[0]._id, { test1: "bibble" }, function(err, docs) 
            {
              assert.ok(docs);
              driver.find(_collection, {test1: "bibble"}, function(items) 
              {
                assert.ok(items);
                assert.equal(items.length, 1);

                driver.remove(_collection, items[0]._id, function(){

                  driver.find(_collection, {test1: "bibble"}, function(items) 
                  {
                    assert.ok(items);
                    assert.equal(items.length, 0);
                    driver.tearDown();
                    done = true;
                  });
                }) 
              });
            });
          });
        });
      });
    });
  });
}

