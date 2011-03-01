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
//var npm = require("npm");
var exec = require('child_process').exec;
//var inspect = require('eyes').inspector({styles: {all: 'magenta'}});


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



exports.installationPublicRoot = function(callback)
{
  if (process.argv[0] === "zeppelin")
  {
    getNpmRoot(function(npmRoot)
    {
      callback(npmRoot + "/.npm/zeppelin/active/package/lib/public");
    });
  }
  else
  {
    callback(process.cwd().split("\/lib")[0] + "\/lib\/public");
  }
};


var getNpmRoot = function(callback)
{
  var child = exec("npm config get root", function(error, stdout, stderr) 
  {
    if (error !== null) 
    {
      console.log('Failed to execute npm - check npm installation!');
      console.log('exec error: ' + error);
    }
    else
    {
      callback(stdout);
    }
  });
};

