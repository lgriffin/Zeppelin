function edit(id)
{
  var tag;
  var val = $("#" + id + "_div").html();

  $('#' + id + "_div").html('');
  tag  = "<form id='editForm'>";
  tag += "  <input type='text' name='" + id + "' id='" + id + "' value='" + val + "'>";
  tag += "  <input type=\"button\" value=\"save\" onclick=\"zeppelin.submitForm({controller: 'quote', method: 'update', element: '" + id + "', callback: 'saveResult'}, this)\"/>";
  tag += "  <input type=\"button\" value=\"cancel\" onclick=\"javascript:cancel('" + id + "','" + val + "')\">";
  tag += "</form>";
  $('#' + id + "_div").html(tag);
}


function saveResult(context, data)
{
  var tag;
  tag = $('#' + context).val();
  $('#' + context + "_div").html('');
  $('#' + context + "_div").html(tag);
}


function cancel(id, value)
{
  $('#' + id + "_div").html('');
  $('#' + id + "_div").html(value);
}


function remove(id)
{
  zeppelin.submit({controller: 'quote', 
                method: 'remove', 
                element: '' + id,
                callback: 'removeResult'},
               [{ name: '' + id, value: ''}]);
}


function removeResult(context, data)
{
  $('#' + context + "_tr").remove();
}

