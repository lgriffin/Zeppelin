var sys = require('sys');
exports.def = 
{
  random: function(callback) 
  {
    this.findAll(function(items)
    {
      var random = Math.floor(Math.random() * items.length);
      callback(items[random]);
    });
  }
}

