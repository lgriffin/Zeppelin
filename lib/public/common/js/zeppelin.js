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

var matchZeppelinUrl = /\/(.*)\.(.*)\/\[(.*)\]/;

var zeppelin = 
{
  collectMode: true,    // need to switch this on only in edit mode
  views: [],

  
  /**
   * to be called on document ready event. applies zeppelin template to all objects of class .ztp
   */
  ready: function(callback)
  {
    var app = this.appName();
    var _self = this;

    if (0 == $(".ztp").length && undefined != callback && null != callback)
    {
      callback();
    }
    $(".ztp").each(function(index)
    {
      var match;

      $(this).toggleClass('ztp');
//      $(this).toggleClass('ztp_done');
      if (null != (match = matchZeppelinUrl.exec(this.title)))
      {
        _self.get("/" + app + this.title, {element: this.id}, callback);
      }
      else
      {
        throw "malformed url";
      }
    });
  },


  /**
   * to apply zeppelin dynamically
   */
  apply: function(params,callback)
  {
    var app = this.appName();
    var targetUrl = this.constructUrl(app, params);
    this.get(targetUrl, params, callback);
  },


  /**
   * to call zeppelin with explicit body post
   */
  submit: function(params, body, callback)
  {
    var app = this.appName();
    var targetUrl = this.constructUrl(app, params);
    this.post(targetUrl, params, body, callback);
  },


  /**
   * to call zeppelin with form post
   */
  submitForm: function(params, formElement)
  {
    var form = this.getEnclosingForm(formElement);
    var app = this.appName();
    var targetUrl = this.constructUrl(app, params);
    this.post(targetUrl, params, form.serializeArray(), callback);
  },


/*----------------------------------------------------------
 * module private */

  post: function(targetUrl, params, body, callback)
  {
    console.log(body)
    var _self = this;
    $.ajax({type: 'POST',
            contentType: "application/json",
            url: targetUrl,
            data: JSON.stringify(body),
            context: params.element,
            success: function(data, textStatus, XMLHttpRequest) {
              console.log('post-result',data)
              _self.execute(this, data, textStatus, XMLHttpRequest, function(){
                console.log('after-view',data)
                callback && callback(data)
              } );
            },
            error: function(jqXHR,status,err) {
              callback && callback({err:err,status:status})
            }
           });
  },


  get: function(targetUrl, params, callback)
  {
    var _self = this;
    $.ajax({url: targetUrl,
            context: params.element,
            success: function(data, textStatus, XMLHttpRequest) {
              _self.execute(this, data, textStatus, XMLHttpRequest, callback);
            },});
  },


  execute: function(context, data, textStatus, XMLHttpRequest, callback)
  {
    var _self = this;
    data.data = data.data || {};
    if (null != data.view.url)
    {
      $.ajax({url: data.view.url, 
              context: context,
              success: function(template) {
                //$('#' + data.view.target).hide().html('').fadeIn(300).jqoteapp(template, data);
                //$('#' + context).toggleClass('ztp');
                //$('#' + context).hide().html('').fadeIn(300).jqoteapp(template, data);
                if (_self.collectMode)
                {
                  // need to check that template is not inserted twice...
                  _self.views.push({ "view": data.view, "template": template});
                }

                $('#' + context).html('').jqoteapp(template, data);

                // recursively reapply templates
                _self.ready(callback);
              }});
    }
    else if (null != data.view.callback)
    {
      eval("" + data.view.callback + "('" + context + "'," + JSON.stringify(data.data) + ")");
    }
  },


  appName: function()
  {
    var regex;
    var match;
    var result = "";

    regex = new RegExp("http:\/\/.*\/(.*)\/.*");
    match = regex.exec(document.URL);
    if (2 == match.length)
    {
      result = match[1];
    }
    return result;
  },


  getEnclosingForm: function(obj)
  {
    var node = obj.parentNode;
    var result = null;

    while (node.tagName != 'FORM' && node != null && node.tagName != 'HTML')
    {
      node = node.parentNode;
    }
    if (node.tagName == 'FORM') 
    {
      result = node;
    } 
    return $("#" + result.id);
  },


  constructUrl: function(app, params)
  {
    var targetUrl;

    if (null != params.view)
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method + "/[" + params.view + "]";
    }
    else if (null != params.callback)
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method + "/(" + params.callback + ")";
    }
    else
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method;
    }
    return targetUrl;
  }
}

