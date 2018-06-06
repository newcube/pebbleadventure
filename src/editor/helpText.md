# Adventure for Pebble - Game Editor

## The Basics

- An Adventure is made up of Chapters.  
- Each chapter can be a Good Ending, a Bad Ending or have Options that take the player to another Chapter.  
- A Chapter can also have a Pick Up Item.

## Chapters

Each Chapter has the following properties:

- ID - The numeric ID of the Chapter.  All Adventures start at Chapter 0.  Chapter IDs must be unique within the same Adventure.
- Title - Short enough to fit on one line on the watch, e.g. "The Garden"
- Body - The main text of the chapter.  This must be kept below 500 characters.
- IsWin - This marks the Chapter as a Good Outcome and ends the Adventure with a "You Did It!" message and the Crown icon.
- IsEnd - This marks the Chapter as a Bad Outcome and ends the Adventure with a "Try Again" message and the Skull icon.
- Pick up Item - An optional item that will automatically added to the player's Inventory
- 'What Now?' Options - Options allow the player to go to another Chapter.

## Chapter 'What Now?' Options

The 'What Now?' menu appears at the end of each Chapter (if the Chpater has not been marked as the end of the Adventure).  An Option has the following properties:

- Go To Chapter ID - This is the ID of the target Chapter.
- Menu Text - The text that is shown to the Player in the menu.  Must be short enough to fit on one line, roughly 15-20 characters, e.g. "Walk down the path".
- Show With Item - If an Item is added here, this Option will only be shown to the Player if they have that Item in their Inventory
- Show Without Item - If an Item is added here, this Option will only be shown to the Player if they do not have that Item in their Inventory


## Pickup Items and the Inventory

### Basics
Items are just text, e.g. "a sword", "some jelly", etc.  When picked up by the Player (i.e. the Player visits a Chapter that contains a Pickup Item) the Item is added to the Player Inventory and the Loot icon will be shown. Chapter Options that have either "Show With" or "Show Without" Items set are then tested against the Player Inventory.  Because of this the Name of the Item must be identical between the Chapter Pickup Item text and the Option With / Without text.  e.g.

- A Chapter Pickup Item called "a sword" is not the same as an item called "sword".

### Naming Items

When naming an item, it must make sense in the following sentence:

"You've found `???` !"

These work:

- `a sword` - "You've found _a sword_ !"
- `the magic lamp of Alkazar` - "You've found _the magic lamp of Alkazar_ !"
- `some custard` - "You've found _some custard_ !"

These don't work:

- `sword` - "You've found _sword_ !"
- `custard` - "You've found _custard_ !" (well, maybe..)


## Controlling the Story Flow With Items

This is the key to an exciting Adventure!  Controlling the story flow allows the Player to have an effect on the world.  The basic technique is to give the Player an item when you wish to open or close off a particular Chapter.  Download the "Crown Quest" game file below and examine Chapter 14.  This demonstrates how to allow the Player to kill a monster then when returning to the same 'location' will see the dead body rather than the monster again - in this case, controlled by the pickup of the Crown.

Examine Chapters 52 and 54 for tips on allowing Players to pass an obstacle many times with a item, in this case "some gold coins".

Another trick is to be able to write Chapter content safe in the knowledge that the Player can only be at this Chapter if they have a certain Inventory Item with them, e.g. With `the torch` the Player can be sent to a chapter that reads:

> You are standing in a large cavern, your torch flickering in your hand.  You see diamonds gleaming in the light.

Without it, the Chapter the Player can reach may read:

> You look around a huge dark echoing cavern.  You can not see beyond your nose.

Examine Chapters 10, 11 and 15 for tips on writing content around Inventory Items.

#### Warning!

Be careful never to mention a Pickup Item in the Chapter's text unless you ensure the Player can only visit this Chapter once.  If the text reads:

> You are crouching under a huge fallen tree.  Out of the corner of your eye you see a compass.

The issue here is that the Player will pickup a compass from the Chapter's Item but when revisiting the Chapter the reference to the Compass will remain.  

## Examples

Download the <a href="demo.json" target="_blank" download>Crown Quest</a> game file for tips (spoilers!)

Save then import it to the editor to see how it works.  Don't forget to save your work first!



#### Contact Me!

email <mailto:adventure@newcube.net> if you need any more help or have ideas for enhancements to either the Game Engine or the Editor.
