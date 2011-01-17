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

var fs = require("fs");

var matchExplicitRender = /\/(.*)\/(.*)\.(.*)\/\[(.*)\]/;
var matchExplicitCallback = /\/(.*)\/(.*)\.(.*)\/\((.*)\)/;
var staticRootIndex = {};


exports.setStaticRootIndex = function(idx)
{
  staticRootIndex = idx;
}


exports.parse = function(url)
{
  var APP = 1;
  var CTRL = 2;
  var FUNC = 3;
  var VIEW = 4;
  var CALLBACK = null;
  var callSpec = null;
  var match;
  var appDetail;

  if (null != (match = matchExplicitRender.exec(url)))
  {
    VIEW = 4;
    CALLBACK = null;
    appDetail = match[APP].split(".");
    if (appDetail.length > 1)
    {
      callSpec = { 'app': appDetail[0], 'extension': appDetail[1], 'controller': match[CTRL], 'method': match[FUNC], 'callback': null, 'view': match[VIEW], 'match': match };
    }
    else
    {
      callSpec = { 'app': match[APP], 'controller': match[CTRL], 'method': match[FUNC], 'callback': null, 'view': match[VIEW], 'match': match };
    }
    expandFullViewUrl(callSpec);
  }
  else if (null != (match = matchExplicitCallback.exec(url)))
  {
    VIEW = null;
    CALLBACK = 4;
    appDetail = match[APP].split(".");
    if (appDetail.length > 1)
    {
      callSpec = { 'app': appDetail[0], 'extension': appDetail[1], 'controller': match[CTRL], 'method': match[FUNC], 'callback': match[CALLBACK], 'view': null, 'match': match };
    }
    else
    {
      callSpec = { 'app': match[APP], 'controller': match[CTRL], 'method': match[FUNC], 'callback': match[CALLBACK], 'view': null, 'match': match };
    }
  }
  else
  {
    match = null;
  }

  return expandFullViewUrl(callSpec);
}


/**
 * tests that view exists in specified face. If not adjusts path to look in application root public folder
 */
var expandFullViewUrl = function(callSpec)
{
  var path = null;
  var viewPath = null;
  var stat = null;

  callSpec.viewPath = "/" + callSpec.app + "/views/" + callSpec.view;

  if (undefined != callSpec.extension && null != callSpec.extension)
  {
    if (undefined != staticRootIndex[callSpec.app + "." + callSpec.extension] && null != staticRootIndex[callSpec.app + "." + callSpec.extension])
    {
      path = staticRootIndex[callSpec.app + "." + callSpec.extension] + "/" + callSpec.app + "." + callSpec.extension + "/views/" + callSpec.view;
      try
      {
        stat = fs.statSync(path);
        callSpec.viewPath = "/" + callSpec.app + "." + callSpec.extension + "/views/" + callSpec.view;
      }
      catch (exp)
      {
        // normal condition...
      }
    }
  }
  return callSpec;
}


