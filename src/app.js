/* Adventure Engine */


var UI = require('ui');
var ajax = require('ajax');
var storyList;
var story;
var windowStack = [];

var collectWindows = function(){
    var windowCount = windowStack.length;
    for(var e=0; e<windowCount; e++)
      windowStack[e].hide();
};

var getChapterByID = function(chapterID){
   //get the current chapter by id
  var currentChapter = story.chapters.filter(
    function(chapter){
      return chapter.id == chapterID;
    })[0];
  
  return currentChapter;
};

var createChapterCard = function(chapterID){
  
  var chapter = getChapterByID(chapterID);
  var cardBody = chapter.text;
  
  if ( chapter.isEnd )
    cardBody += ' \n\nPress Back to try again!';
  else
    cardBody += ' \n\nPress Select to choose...';
  
  var cardTitle = chapter.title;
  
  var card = new UI.Card({
    body: cardBody,
    title: cardTitle,
    scrollable: true
  });
  
  card.on('click','back',function(){
    
    var quitScreen = new UI.Card({
      title: 'Quit?',
      body: 'Press Select to quit, back to continue the adventure...'
    });
    
    quitScreen.on('click','select', function(){
      windowStack.push(this);
      collectWindows();
    });
  
    quitScreen.show();
    
  });
  
  windowStack.push(card);
  
  return card;
};

var getMenuOptions = function(currentID){
  
  console.log('chapter id for menu options = ' + currentID);
  
  //get the current chapter by id
  var currentChapter = getChapterByID(currentID);
  //create a menu option list from the goto options defined in the chapter
  var options = [];
  
  for(var e=0; e<currentChapter.options.length; e++){
    options.push({
      title: 'Option ' + (e+1),
      subtitle: currentChapter.options[e].text,
      goto:currentChapter.options[e].goto
    });
  }
  
  return options;
  
} ;

var gotoChapter = function(chapterID){
  
  collectWindows();
  
  var chapterCard = createChapterCard(chapterID);
  
  var chapter = getChapterByID(chapterID);
  
  chapterCard.show();
  
  //only add menu if this isn't an end node (e.g. failure/death)
  if (!chapter.isEnd){
    chapterCard.on('click', 'select', function(e) {
      
      var items = getMenuOptions(chapterID);
      
      //create menu with current chapter's options
      var menu = new UI.Menu({
        style:'small',
        sections: [{
          items: items
        }]
      });
      
      //on click, set current chapter
      menu.on('select', function(e) {
        gotoChapter(e.item.goto);
      });
      
      windowStack.push(menu);
      menu.show();
    });
  }
};

var loadAdventure = function(gamefile){
 
    ajax(
    {
      url: 'http://www.web-gear.net/Adventure/Stories/' + gamefile + '.json',
      type: 'json'
    },
    function(data, status, request) {
      story = data;
      gotoChapter(0);
    });

};

var startGame = function(){

//main window
var main = new UI.Card({
  subtitle: 'Welcome to Adventure!',
  body: 'Press Select to choose a game',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});
main.show();
main.on('click', 'select', function(e) {
  //gotoChapter(0);
  var items = [];
  for(var y=0; y<storyList.stories.length; y++){
      items.push({
        title: 'Game ' + (y+1),
        subtitle: storyList.stories[y].title,
        gamefile: storyList.stories[y].gamefile
      });
  }
  
      //create menu with current chapter's options
      var menu = new UI.Menu({
        sections: [{
          title: 'Choose an Adventure',
          items: items
        }]
      });
       
      //on click, set current chapter
      menu.on('select', function(e) {
         console.log('starting game ' + e.item.gamefile);
        //get game via ajax and on success, go to chapter 0 of global 'story' object
        loadAdventure(e.item.gamefile);
      });
      
      windowStack.push(menu);
      menu.show();
  
});

};

ajax(
  {
    url: 'http://www.web-gear.net/Adventure/Stories/stories.json',
    type: 'json'
  },
  function(data, status, request) {
    storyList = data;
    startGame();
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
    var errorCard = new UI.Card({
      title:'Something Went Wrong...',
      body: 'Unable to download Adventures.  Is your Phone able to access the internet?  Please exit Adventure and try again.',
      scrollable: true
    });
    errorCard.show();
  }
);


