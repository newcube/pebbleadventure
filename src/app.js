/* Adventure Engine */


var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

//game variables
var storyList;
var story;
var currentChapter;
var windowStack = [];
var inventory = [];

var showSplash = function(splashText){
  var splash = new UI.Card({
    title:splashText,
    body:''
  });
  console.log('showing splash');
  splash.show();
  setTimeout(function(){ splash.hide(); }, 2000);
};

var saveGame = function(){
  var gameFile = {};
  gameFile.gameID = story.id;
  gameFile.inventory = inventory;
  gameFile.chapter = currentChapter;
  gameFile.gamefile = story.gamefile;
  
  console.log('story.gamefile = ' + story.gamefile);
  
  console.log('setting gameFile : ' + JSON.stringify(gameFile));
  Settings.data('saveGame', gameFile);
  
  showSplash('Game saved');
  
};

var collectWindows = function(){
    var windowCount = windowStack.length;
    for(var e=0; e<windowCount; e++)
      windowStack[e].hide();
};

var displayInventory = function(){
 
  var bodyText = '';
  
  if ( inventory.length === 0 )
    bodyText = '\nNothing!';
  else
  {
    for(var e=0;e<inventory.length;e++){
      bodyText += '-' + inventory[e] + '\n';
    }
  } 
  
  var card = new UI.Card({
      subtitle: 'You\'re carrying:',
      body: bodyText,
      scrollable: true
    });
    card.show();
};

var showBackButtonMenu = function(chapterID){
    //create menu with current chapter's options
    var menu = new UI.Menu({
      sections: [{
        items: [
          {
            id: 0,
            title: 'Save',
            subtitle: 'Save and continue'
          },
          {
            id: 1,
            title: 'Save and Quit',
            subtitle: 'Save and quit to menu'
          },
          {
            id: 2,
            title: 'Quit',
            subtitle: 'Quit to menu'
          },
          {
            id: 3,
            title: 'Inventory',
            subtitle: 'Show inventory'
          }
        ]
      }]
    });
  
    menu.on('select', function(e) {
      
      console.log('menu item id : ' + e.item.id);
      
         switch(e.item.id){
           case 0:
              saveGame();
              this.hide();
            break;
           case 1:
             saveGame();
             windowStack.push(this); // collect all the windows to the root (title screen)
             collectWindows();
            break;
          case 2:
             windowStack.push(this); // collect all the windows to the root (title screen)
             collectWindows();
             break;
          case 3:
            displayInventory();
             break;
         }
    });
  
    menu.show();
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
  
  if ( chapter.item )
    cardBody += ' \n\nYou picked up ' + chapter.item + '!';
  
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
    showBackButtonMenu();
  });
  
  windowStack.push(card);
  
  return card;
};

var getChapterMenuOptions = function(currentID){
  
  console.log('chapter id for menu options = ' + currentID);
  
  //get the current chapter by id
  var currentChapter = getChapterByID(currentID);
  //create a menu option list from the goto options defined in the chapter
  var options = [];
  
  for(var e=0; e<currentChapter.options.length; e++){
    
    var option = currentChapter.options[e];
    
    var addOption = true;
    
    if ( option.with )
    {
      var inventoryMatch = inventory.filter(function(item){return item==option.with;});
      if (inventoryMatch.length===0) // player does not has item
        addOption = false;
        
    }
    
    if ( option.without )
    {
      var inventoryMatch = inventory.filter(function(item){return item==option.without;});
       if (inventoryMatch.length>0) // player has item
        addOption = false;
        
    }
    
    if ( addOption ){
      options.push({
        title: 'Option ' + (e+1),
        subtitle: option.text,
        goto: option.goto
      });
    }
  }
  
  return options;
  
} ;

var gotoChapter = function(chapterID){
  
  collectWindows();
  
  currentChapter = chapterID;
  
  var chapter = getChapterByID(chapterID);
  
  var chapterCard = createChapterCard(chapterID);
  
  //test for chapter item
  if (chapter.item){
    inventory.push(chapter.item);  // add to inventory
    chapter.item = undefined; // remove from room
  }
  
  currentChapter = chapterID;
  
  chapterCard.show();
  
  //only add menu if this isn't an end node (e.g. failure/death)
  if (!chapter.isEnd){
    chapterCard.on('click', 'select', function(e) {
      
      var items = getChapterMenuOptions(chapterID);
      
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

var stripSavedInventoryFromStory = function(){
  //if a saved game has in inventory item, we need to remove that item from the chapter it was found in
  
  console.log('strip inventory from story');
  
  for (var c=0; c<story.chapters.length; c++){
    for(var i=0; i<inventory.length; i++)
      if ( inventory[i] == story.chapters[c].item )
        story.chapters[c].item = undefined;
  }
};

var loadAdventure = function(gamefile, startingChapter, startingInventory){
  
 
    ajax(
    {
      url: 'http://www.web-gear.net/Adventure/Stories/' + gamefile + '.json',
      type: 'json'
    },
    function(data, status, request) {
      story = data;
      
      inventory = startingInventory;
      
      stripSavedInventoryFromStory();
      
      gotoChapter(startingChapter);
    });
};

var startGame = function(){
  
//main window
var main = new UI.Card({
  title: ' Adventure',
  body: '\nPress Select to Begin Your Adventure!',
  icon: 'images/adventure.png'
});
main.show();
main.on('click', 'select', function(e) {
  //gotoChapter(0);
  var items = [];
  
  var saveGame = Settings.data('saveGame');
  
  console.log('getting save game : ' + JSON.stringify(saveGame));
  
  if (saveGame){
     items.push({
        title: 'Resume Game',
        subtitle: 'Continue the Adventure',
       resume: true
     });
  } 
  
  
  for(var y=0; y<storyList.stories.length; y++){
      items.push({
        title: 'Adventure ' + (y+1),
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
        if ( e.item.resume ){
          inventory = saveGame.inventory;
          loadAdventure(saveGame.gamefile, saveGame.chapter, saveGame.inventory);
        }
        else
          loadAdventure(e.item.gamefile, 0, []);
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


