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

var sys = require("sys");
var inspect = require('eyes').inspector({styles: {all: 'magenta'}});


Object.defineProperty(Object.prototype, "copy", {value: function() 
{
  return Object.create(this, {});
}});



Object.defineProperty(Object.prototype, "imbue", {value: function(props) 
{
  var defs = {};
  var key;
  var result;
  for (key in props) 
  {
    if (props.hasOwnProperty(key)) 
    {
      defs[key] = {value: props[key], enumerable: true};
    }
  }
  return Object.create(this, defs);
}});


/*
exports.installationRoot = function()
{
  return process.cwd().split("\/installation")[0] + "\/installation";
}
*/


exports.installationPublicRoot = function()
{
  return process.cwd().split("\/lib")[0] + "\/lib\/public";
}


/*
function.prototype.bind = function(scope) 
{
  var _function = this;
  return function() {
    return _function.apply(scope, arguments);
  }
}
*/


/*
exports.build = function(root, objects) 
{
  var defs = {};
  var key;
  var index;

  for (index = 0; index < objects.length; ++index)
  {
    props = objects[index];
    for (key in props) 
    {
      if (props.hasOwnProperty(key)) 
      {
        defs[key] = {value: props[key], enumerable: true};
      }
    }
  }

  props = root;
  for (key in props) 
  {
    if (props.hasOwnProperty(key)) 
    {
      defs[key] = {value: props[key], enumerable: true};
    }
  }
  return Object.create(root, defs);
}
*/


