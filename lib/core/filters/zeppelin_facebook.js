/* 
 * Author: P.Elger
 *
 * facebook filter for zeppelin
 * ripped from http://howtonode.org/facebook-connect - thanks man...
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

sys = require('sys')
require('joose');
require('joosex-namespace-depended');
hashlib = require('hash')


exports.before = function(req, res, app)
{
  var appId = app.config.facebook.appId;
  var appSecret = app.config.facebook.appSecret;

  if (null == req.session.facebook || false == req.session.facebook.authenticated)
  {
    if (authenticate(req, res, appId, appSecret)) 
    {
      var fbUserId = req.param['fb_sig_user'] ? req.param['fb_sig_user'] : req.cookies[appId + '_user'];
      req.session.facebook = { authenticated: true, userId: fbUserId };
    }
    else
    {
      req.session.facebook = { authenticated: false, userId: null };
    }
  }
}


exports.after = function(req, res, app)
{
}


/**
 * Try authenticating by verifying Facebook data in GET params and cookie
 */
var authenticate = function(req, res, appId, appSecret) 
{
  var cookies = req.cookies;
  var params; // = req.params == null ? null : req.params.get;
  var fingerprint = null;
  var signature = null;
  var valid = false;

  if (cookies && cookies[appId]) 
  {
    fingerprint = exports.getFingerprintForCookie(appId, cookies)
    signature = cookies[appId]
  }
  else if (params && params['fb_sig']) 
  {
    fingerprint = exports.getFingerprintForParams(params)
    signature = params['fb_sig']
  }

  if (fingerprint)
  {
    var expected_signature = Hash.md5(fingerprint + appSecret);
    valid = (expected_signature === signature)
  }

  return valid
}


/*---------------------------------------------------------
 * module private */

var getFingerprintForCookie = function(appId, cookies) 
{
  var fields = ['expires', 'session_key', 'ss', 'user'];
  var fingerprint = '';
  fields.sort();
  for(var i in fields) 
  {
    fingerprint += fields[i]+ '=' + cookies[appId + '_' + fields[i]];
  }
  return fingerprint;
}


var getFingerprintForParams = function(params) 
{
  var fields = [];
  for(var i in params) 
  {
    if(i.match(/^fb_sig_/)) 
    {
      fields.push(i);
    }
  }
  fields.sort();
  var fingerprint = '';
  fields.sort();
  for(var i in fields) 
  {
    fingerprint += fields[i].replace(/^fb_sig_/, '') + '=' + params[fields[i]];
  }
  return fingerprint;
}

