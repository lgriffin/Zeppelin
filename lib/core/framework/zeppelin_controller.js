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

var util = require('util')


exports.def =
{
  model: null,
  helper: null,

  create: function(params)
  {
    var self = this;
    //this.model.base.create(params.clientParams[0].value, function(err)
    this.model.create(params.clientParams[0].value, function(err)
    {
      self.render(null, err, params);
    });
  },
    

  find: function(params)
  {
    var self = this;
    this.model.find(params.clientParams[0].value, function(items)
    {
      self.render(items, null, params);
    });
  },


  update: function(params)
  {
    var self = this;
    this.model.update(params.clientParams[0].name, params.clientParams[0].value, function(err)
    {
      self.json(null, err, params);
    })
  },


  remove: function(params)
  {
    var self = this;
    this.model.remove(params.clientParams[0].name, function(err)
    {
      self.json(null, err, params);
    });
  },


  renderOnly: function(params)
  {
    this.render(null, null, params);
  },


  readjson: function(req,win) {
    var bodyarr = [];
    req.on('data',function(chunk){
      bodyarr.push(chunk);
    })
    req.on('end',function(){
      var bodystr = bodyarr.join('');
      util.debug('READJSON:'+req.url+':'+bodystr);
      var body = JSON.parse(bodystr);
      win && win(body);
    })
  },


  sendjson: function(code,res,obj) {
    res.writeHead(code,{
      'Content-Type': 'text/json',
    });
    var objstr = JSON.stringify(obj);
    util.debug('SENDJSON:'+objstr);
    res.end( objstr );
  },


/*---------------------------------------------------------
 * module private */

  render: function(items, err, params)
  {
    var json = { data: items,
                 error: err,
                 view: { url: params.template } };
    params.res.write(JSON.stringify(json));
    params.callback(params);
  },


  json: function(items, err, params)
  {
    var json = { data: items,
                 error: err,
                 view: { callback: params.clientCallback } };
    params.res.write(JSON.stringify(json));
    params.callback(params);
  }
}

