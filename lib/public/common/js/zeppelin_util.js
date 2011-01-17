/* 
 * Author: P.Elger - with some pillaging...
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

var zutil = 
{
  parseQueryString: function()
  {
    var queryParams = new Array();
    var query = window.location.search.substring(1);
    var params = query.split('&');
    for (var i = 0; i < params.length; ++i) 
    {
      var pos = params[i].indexOf('=');
      if (pos > 0) 
      {
        var key = params[i].substring(0, pos);
        var val = params[i].substring(pos + 1);
        queryParams[key] = val;
      }
    }
    return queryParams;
  },


  copy: function(obj) 
  {
		if (typeof obj !== 'object' ) 
    {
			return obj;
		} 
    else 
    {
			var value = obj.valueOf();
			if (obj != value) 
      { 
				return new obj.constructor(value);
			} 
      else 
      {
				if ( obj instanceof obj.constructor && obj.constructor !== Object ) 
        { 
					var c = clone(obj.constructor.prototype);

					for ( var property in obj) 
          { 
						if (obj.hasOwnProperty(property)) 
            {
							c[property] = obj[property];
						} 
					}
				}
        else 
        {
					var c = {};
					for ( var property in obj ) 
          {
            c[property] = obj[property];
          }
				}
				return c;
			}
		}
	},


	Clone: function() {},
	clone: function(obj) 
  {
		this.Clone.prototype = obj;
		return new this.Clone();
	},


	chain: function(base, local) 
  {
		var chain = clone(base);
		for ( key in local ) 
    {
			chain[key] = local[key];
		}
		return chain;
	}
}

