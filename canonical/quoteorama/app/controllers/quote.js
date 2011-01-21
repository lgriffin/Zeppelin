exports.def = 
{
  random: function(params) 
  {
    var _self = this;
    this.model.random(function(items)
    {
      _self.render(items, null, params);
    });
  }
}

