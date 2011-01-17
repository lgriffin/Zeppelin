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

var mysqlClient = require('mysql').Client,

exports.mysql = 
{
  tearUp: function()
  {
    client = new Client();
    client.user = zeppelin.config.database.username;
    client.password = zeppelin.config.database.password;
    client.connect();
  }


  tearDown: function()
  {
    client.end();
    client = null;
  }


  find: function(tableName, query, callback)
  {







            callback(items);
            _db.close();
          });
        });
      });
    });
  },


  insert: function()
  {
  },


  update: function()
  {
  },


  upsert: function()
  {
  },


  del: function()
  {
  }
}


var Client = require('mysql').Client,
client = new Client();

client.user = 'root';
client.password = 'root';

client.connect();

client.query('CREATE DATABASE '+TEST_CONFIG.database, function() {
if (err && err.errorNumber != Client.ERROR_DB_CREATE_EXISTS) {
throw err;
}
});

// If no callback is provided, any errors will be emitted as `'error'`
// events by the client
client.query('USE '+TEST_CONFIG.database);

client.query(
'CREATE TEMPORARY TABLE '+TEST_TABLE+
'(id INT(11) AUTO_INCREMENT, '+
'title VARCHAR(255), '+
'text TEXT, '+
'created DATETIME, '+
'PRIMARY KEY (id));',
);

client.query(
'INSERT INTO '+TEST_TABLE+' '+
'SET title = ?, text = ?, created = ?',
['super cool', 'this is a nice text', '2010-08-16 10:00:23'],
);

var query = client.query(
'INSERT INTO '+TEST_TABLE+' '+
'SET title = ?, text = ?, created = ?',
['another entry', 'because 2 entries make a better test', '2010-08-16 12:42:15']
);

client.query(
'SELECT * FROM '+TEST_TABLE,
gently.expect(function selectCb(err, results, fields) {
if (err) {
throw err;
}

console.log(results);
console.log(fields);
client.end();
})
);

