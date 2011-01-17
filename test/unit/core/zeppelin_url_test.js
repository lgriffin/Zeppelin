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
var zurl = require('../../../lib/core/zappa_url');

module.exports =
{
  testPublic: function(beforeExit)
  {
    var done = false;
    var count = 0;
    var callspec;

    callspec = zurl.parse("/quoteorama.std/quoteController.random/[random/viewQuote.ztp.html]");
    assert.equal(callspec.app, "quoteorama");
    assert.equal(callspec.method, "random");

    callspec = zurl.parse("/quoteorama.std/quoteController.random/(clientFunc)]");
    assert.equal(callspec.app, "quoteorama");
    assert.equal(callspec.method, "random");

    callspec = zurl.parse("/quoteorama/quoteController.random/(clientFunc)]");
    assert.equal(callspec.app, "quoteorama");
    assert.equal(callspec.method, "random");

    callspec = zurl.parse("/quoteorama/quoteController/clientFunc)]");
    assert.isNull(callspec);
  }
}

