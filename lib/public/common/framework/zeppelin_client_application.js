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

var zapp = 
{
  _self: null,
  mvc: null,
  debug: false,


  /**
   * mvc is dynamically generated and is of the form:
   * mvc: { "application": { "controller": application_controller,
   *                         "model": application_model,
   *                         "view": null}};
   */
  init: function(mvc, debug)
  {
    zassert(null !== mvc);

    _self = this;
    _self.debug = debug;
    _self.mvc = mvc;

    for (var element in _self.mvc)
    {
      if (null !== _self.mvc[element].controller) 
      { 
        _self.mvc[element].controller.init(_self.mvc[element].model, _self.mvc[element].view, _self.mvc); 
      }
    }
  },


  render: function()
  {
    for (var element in _self.mvc)
    {
      if (null !== _self.mvc[element].controller && undefined !== _self.mvc[element].controller.render)
      { 
        _self.mvc[element].controller.render(_self.game_state); 
      }
    }
  },


	log: function(s) 
  {
		if (_self.debug && typeof(console) != 'undefined' && typeof(console.log) != 'undefined')
    { 
      console.log(s); 
    }
	}
};


$(document).ready(function()
{
  zepApp.init();
});


