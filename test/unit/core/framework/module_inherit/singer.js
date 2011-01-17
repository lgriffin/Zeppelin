var sys = require("sys");

exports.def =
{
  play: function() { return this.sing(); },
  test: function()
  {
    this.root.dispatch.call(this, function(name)
    {
      sys.debug("NAME = " + name);
      sys.debug("NAME = " + this.name);
      sys.debug("NAME = " + this.root.name);
    });
  }
}


