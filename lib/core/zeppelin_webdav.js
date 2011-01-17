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
var jsDAV = require("jsdav");

exports.tearUp = function(server, applications)
{
  sys.puts("webdav mounting:");
  jsDAV.debugMode = true;
  for (var blockIndex in applications)
  {
    for (var appIndex in applications[blockIndex].apps)
    {
      if (undefined != applications[blockIndex].apps[appIndex].config.webdav && true == applications[blockIndex].apps[appIndex].config.webdav)
      {
        sys.puts(applications[blockIndex].apps[appIndex].name + ": (" + applications[blockIndex].apps[appIndex].path + ")");
        jsDAV.mount(applications[blockIndex].apps[appIndex].path, applications[blockIndex].apps[appIndex].name, server);
      }
    }
  }
  //!! HACK - mount appmgr web dav folder for cross frame posting
//  jsDAV.mount("/Users/peterelger/work/Zeppelin/code/Zeppelin/canonical2/installation/sysapps/appmgr/webdav", "appmgrwd", server);
}

