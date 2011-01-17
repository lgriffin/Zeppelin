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
/*
 * add following to root page
 * <div id="fb-root"></div>
 * <script type="text/javascript">
 * var zfb = 
 * {
 *   applicationId: '146308242084763',
 *   url: "http://apps.facebook.com/zappaquoteorama/auth.html",
 *   scope: "user_photos,user_videos,publish_stream"
 * };
 * window.fbAsyncInit = zfb_asyncInitCanvas;
 * </script>
 */

var zfb_callback = null;


/**
 * call from document.ready to asynchronously load facebook API
 */
var zfb_loadAPI = function(callback)
{
  zfb_callback = callback;
  var e = document.createElement('script');
  e.type = 'text/javascript';
  e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
  e.async = true;
  document.getElementById('fb-root').appendChild(e);
}


/**
 * called by facebook api once loaded, initialise the api and check that user has authorised
 * user is authorised if user_id parameter is present. If not authorised then kick off oauth sequence
 */
var zfb_asyncInitCanvas = function() 
{
  FB.init({appId: zfb.applicationId, status: true, cookie: true, xfbml: true});

  var qs = zutil.parseQueryString();
  if (qs.length > 0)
  {
    var parts = qs["signed_request"].split('.');
    var sig = zb64.base64UrlToBase64(parts[0]);
    var payload = zb64.decode(zb64.base64UrlToBase64(parts[1]));
    var data = JSON.parse(payload);

    if ("undefined" == data.user_id || null == data.user_id)
    {
      top.location="https://graph.facebook.com/oauth/authorize?client_id=146308242084763&&scope=" + zfb.scope + "&redirect_uri=" + zfb.url;
    }
    else
    {
      zfb_callback();
    }
  }
  else
  {
    // if query string is not present application is loaded in editor - outside of facebook context
    // ignore and continue....Facebook buttons will not show in editor (
    zfb_callback();
  }
}


var zfb_asyncInitConnect = function() 
{
  FB.init({appId: zfb.applicationId, status: true, cookie: true, xfbml: true});
  FB.getLoginStatus(zfb.loginStatusCallback);
}



var zfb_wallpostQuote = function()
{
  FB.ui(
   {
     method: 'feed',
     name: 'Facebook Dialogs',
     link: 'http://apps.facebook.com/zappaquoteorama/',
     picture: 'http://fbrell.com/f8.jpg',
     caption: 'Reference Documentation',
     description: 'Dialogs provide a simple, consistent interface for applications to interface with users.',
     message: 'Facebook Dialogs are easy!'
   },
   function(response) {});
}


var zfb_shareApp = function()
{
 FB.ui(
 {
   method: 'stream.share',
   u: 'http://apps.facebook.com/zappaquoteorama/'
 },
 function(response) {});
}

