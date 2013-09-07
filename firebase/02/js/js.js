var myDataRefUrl = 'https://allyusd.firebaseio.com/github/userpage/dropblock/';

var myDataRef = new Firebase(myDataRefUrl);

myDataRef.on('value', function(snapshot) {
  var block = snapshot.val();

  $('.block').remove();
  for (var i = 0; i < block.length; i++)
  {
    displayChatMessage(i, block[i].name, block[i].left, block[i].top);
  }
});

function displayChatMessage(index, name, left, top) {
  var div = $('<div/>');
  div.attr('id', index);
  div.attr('class', 'block alert alert-info ui-widget-content');
  div.text(name).appendTo($('#messagesDiv'));
  div.attr('style', 'position: absolute; left: ' + left + 'px; top: ' + top + 'px;');
  $(".ui-widget-content").draggable({
    stop: function (event, ui) {
      saveposition($(this));
    }
  });
};

function saveposition(ui) {
  var id = ui.attr('id');
  var left = ui.position().left;
  var top = ui.position().top;

  var myDataRef = new Firebase(myDataRefUrl + id);

  myDataRef.once('value', function(snapshot) {
    var block = snapshot.val();

    myDataRef.update( {
      name : block.name,
      left : left,
      top : top
    });
  });
}