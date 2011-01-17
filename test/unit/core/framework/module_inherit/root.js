exports.def = {
  name: "John",
  age: "42",
  shout: function() { return this.name + ": Oi Geezer"; },
  sing: function() { return this.name + ": La La La..."; },
  dispatch: function(callback)
  {
    callback.call(this, this.name);
  }
}
