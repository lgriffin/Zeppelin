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
var zfs = require('../../../lib/core/zappa_fs');

module.exports =
{
  testPublic: function(beforeExit)
  {
    var done = false;
    var count = 0;

    beforeExit(function()
    {
      assert.equal(2, count);
    });

    zfs.recurse('/Users/peterelger/work/Zappa/code/Zappa/canonical2/installation/test/resources/fstest', /public/,
                function(file)
                {
                  sys.debug("on file: " + file);
                },
                function(dir)
                {
                  sys.debug("on dir: " + dir);
                  ++count;
                });
  }
}


