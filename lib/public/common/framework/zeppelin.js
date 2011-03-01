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
Use Weld client side

Support jQuote as a view
Support weld as a view

templates into .jq.html or .weld.html
or into the main DOM body

example apps
1). zappa qoute ot rama as today but refactored to client mvc

2). zepplin lyrics as per zappa example but using weld tempaltes - i.e. recursive stuff...

3). zeppelin lyrics single page application - weld templates - with perhpas one external template pulled down
- just data no render


Build this version of example app with no <% type tempates 
have the frags as seperate chunks - held in the main body - no actually allow for any number of
template files 

views will take these markups and process them with selectors

mvc  client logic will provide a clean way to do this.

----

will also provide suppport for templates ?? probably

----

lets have 2 parallel sets 
1). current
2). client mvc no <%

then blend mvc client / server shared helpers.... etc...


elements are:
1). container to insert into
2). templates
3). data


  var data = [
    { 
      name: 'hij1nx',  
      title : 'code slayer' 
    },
    { 
      name: 'tmpvar', 
      title : 'code pimp'; 
    }
  ];

<ul class="contacts">
  <li class="contact">
    <span class="name">My Name</span>
    <p class="title">Leet Developer</p>
  </li>
</ul>


<ul class="contacts">
  <li class="contact">
    <span class="name">Paolo</span>
    <p class="title">Code Slayer</p>
  </li>
  <li class="contact">
    <span class="name">Elijah</span>
    <p class="title">Code Pimp</p>
  </li>  
</ul>






<ul class="contacts">
  <li class="contact">
    <span class="name">Hello my name is <span class="firstAndLast">My Name</span></span>
    <p class="title">Leet Developer</p>
  </li>
</ul>


var data = [
  { 
    name: 'Paulo',  
    title: 'code exploder' 
  },
  { 
    name: 'Elijah', 
    title: 'code pimp' 
  }
];


*/

/**
 * common helper functions
 */
var zeppelin = 
{
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

    while (node.tagName !== 'FORM' && node !== null && node.tagName !== 'HTML')
    {
      node = node.parentNode;
    }
    if (node.tagName === 'FORM') 
    {
      result = node;
    } 
    return $("#" + result.id);
  },


  constructUrl: function(app, params)
  {
    var targetUrl;

    if (null !== params.view)
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method + "/[" + params.view + "]";
    }
    else if (null !== params.callback)
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method + "/(" + params.callback + ")";
    }
    else
    {
      targetUrl = "/" + app + "/" + params.controller + "." + params.method;
    }
    return targetUrl;
  }
};

