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

exports.def = 
{
  driver: null,
  collection: null,
  key: null,


  create: function(value, callback)
  {
    this.driver.create(this.collection, JSON.parse("{\"" + this.key + "\" : \"" + value + "\"}"), function(err, docs)
    {
      callback(err);
    });
  },


  findAll: function(callback) 
  {
    this.driver.find(this.collection, {}, function(items) 
    {
      callback(items);
    });
  },


  find: function(query, callback) 
  {
    eval("json = {" + this.key + ": new RegExp(query)}");
    this.driver.find(this.collection, json, function(items) 
    {
      callback(items);
    });
  },


  update: function(id, data, callback)
  {
    this.driver.update(this.collection, id, JSON.parse("{\"" + this.key + "\" : \"" + data + "\"}"), function(err, docs) 
    {
      callback(err);
    });
  },


  remove: function(id, callback)
  {
    this.driver.remove(this.collection, id, function(err, docs) 
    {
      callback(err);
    });
  },


  removeAll: function(callback)
  {
    this.driver.removeAll(this.collection, function(err, docs) 
    {
      callback(err);
    });
  }
}


