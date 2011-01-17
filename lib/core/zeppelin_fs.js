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

/*---------------------------------------------------------
 * zeppelin file system handling */

var fs = require("fs");
var sys = require('sys');

exports.recurse = function(dir, pattern, onFileCallback, onDirectoryCallback, onCompleteCallback)
{
  var files = fs.readdirSync(dir);
  for (var index = 0; index < files.length; ++index)
  {
    var current = fs.statSync(dir + "/" + files[index]);

    if (null != onFileCallback && !current.isDirectory() && !current.isSymbolicLink())
    {
      if (pattern.test(files[index]))
      {
        onFileCallback(dir + "/" + files[index]);
      }
    }
    else if (current.isDirectory() && !current.isSymbolicLink())
    {
      if (null != onDirectoryCallback && pattern.test(files[index]))
      {
        onDirectoryCallback(dir + "/" + files[index]);
      }
      exports.recurse(dir + "/" + files[index], pattern, onFileCallback, onDirectoryCallback);
    }
  }
}

