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

/* not really a unit test just required to get my melon around prototypal inheritance
   which is not really inheritance at all. much cleaner and more powerful... */

var zappa = require('../../../../../lib/core/zappa');
var sys = require('sys');
var inspect = require('eyes').inspector({styles: {all: 'magenta'}});
var root = require("./root").def;
var guitarist = require("./guitarist").def;
var drummer = require("./drummer").def;
var singer = require("./singer").def;

var r1 = root.imbue({});
var r2 = root.imbue({});
var r3 = r1.copy();
r2.name = "Peter";
r2.age = "21";

sys.debug("------------------- root --------------------");
sys.debug("r1 = " + r1.name + " " + r1.age);
sys.debug("r2 = " + r2.name + " " + r2.age);
sys.debug("r3 = " + r3.name + " " + r3.age);
sys.debug(r1.shout());
sys.debug(r2.shout());
sys.debug(r3.shout());

sys.debug("------------------- guitarist --------------------");
var g1 = r1.imbue(guitarist);
var g2 = r2.imbue(guitarist);
sys.debug("g1 = " + g1.name + " " + g1.age);
sys.debug("g2 = " + g2.name + " " + g2.age);
sys.debug(g1.shout());
sys.debug(g1.play());
sys.debug(g2.shout());
sys.debug(g2.play());
sys.debug("r1 = " + r1.name + " " + r1.age);
sys.debug("r2 = " + r2.name + " " + r2.age);
sys.debug(r1.shout());
sys.debug(r2.shout());

