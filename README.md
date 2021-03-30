Kiyo is an open source Discord Bot under the GNU General Public License v3.0 License  <br/>
Kiyo has powerful utilities which make it quick and easy to build upon, writing  <br/>
Feature rich and easy to maintain. <br/>
Based on the [discord.js](https://github.com/discordjs/discord.js) library.

## 📥 Installation
<b> NPM and Node.js 14.0.0 or higher required. </b> Download [here](https://nodejs.org/) <br/>
<b> MongoDB v4 or higher required. </b> Create [here](https://docs.atlas.mongodb.com/getting-started) for free. 
###### 1. Clone this repository from your terminal:
```shell
git clone https://github.com/StrawHatHacker/Kiyo-Discord-Bot
```
###### 2. Navigate into the directory:
```shell
cd Kiyo-Discord-Bot/
```
###### 3. Install dependencies:
```shell
npm install
```
###### 4. Create .env file in the src directory:
```shell
cd src/
```
```shell
touch .env
```
###### 5 Add bot token into the .env file:
Open .env with your favourite text editor and add this line along with your bot token: <br/>
`DISCORD_BOT_TOKEN="Your bot token here"`
###### 6 Add MongoDB connection string into the .env file:
Add the following in a new line:
`DB_CONNECTION_STRING="Connection string here"`
###### 7. Run the bot (Assuming you already are in the /src directory):
```shell
node index.js 
```
*If you see `Ready` in the console the the bot is online, congrats!*

###### 8. (Optional) Add your OtakuGIFs token for anime GIF reactions.
Get an API Token from https://otakugifs.xyz and add it to the .env file in a new line:
`OTAKUGIFS_TOKEN="Token goes here"`

<br/><br/>
#### ❕ By no means this is a descriptive 100% coverage documentation. Please look at the code, find similar use cases of how I use the classes, utils, how commands and events are syntaxed, and go from there.
<br/>

## Classes
#### Bot `Class` `extends Client`
Adding helper methods for easier client creation.
##### Arguments:
* **botConfig**: `Object` This is the [options](https://discord.js.org/#/docs/main/stable/typedef/ClientOptions) object for Discord.#Client(options).
##### Methods
* **_loadCommands:** **`Private`** `void` Loads all commands from the `src/commands/` directory and subdirectories.
* **_loadEvents:** **`Private`** `void` Loads all events from the `src/events/` directory.
* **_connectToDB:** **`Private`** `void` Connects to the database.
* **start:** `void` Calls `_loadCommands`, `_loadEvents` and `_connectToDB` and then starts the bot.

<br/>

#### Err `Class`
Custom error objects and methods for ease of use and readability.
##### Arguments: 
* **httpStatus**: `Number` Error status code. 
* **name**: `String` Error name.
* **message**: `String` Error description.
##### Methods
* **inputErr:** `this` Set name to "Input Error"
* **memberNotFound:** `this` Set message to "Member not found"

<br/>

#### Embed `Class` `extends MessageEmbed`
Adding helper methods for easier embed creation.
##### Methods
* **addDescription:** `this` Takes in a string and appends it to the `.description` property of the object, in a line (don't confuse with the inherited `.setDescription` method which replaces the previous description value)

<br/>

#### Permission `Class`
Permissions class for filtering and formatting Discord permissions
##### Arguments:
* **perms**: A `Discord.Collection` of `Discord.Permissions`, this is usually `#GuildMember.permissions`.
##### Methods
* **filterKeyPerms:** `this` Returns an *Array* of key permission flags. See `KEY_PERMS` in `src/config.js`
* **filterNonKeyPerms:** `this` Returns an *Array* of non key permission flags. See `KEY_PERMS` in `src/config.js`
* **permsToArray:** `this` Returns an *Array* of all permission flags passed.
* * NOTE:  `filterKeyPerms` & `filterNonKeyPerms` are mutually exclusive. Meaning they will never have a mutual permission if run on the same instance.
* * NOTE:  It's always recommended to run `filterKeyPerms`, `filterNonKeyPerms` or `permsToArray` before executing any other method of the class.
* **userhasPermission:** `Boolean` Takes in an array of permissions. Resolves if the user has **ANY** of those permissions.
* **clientHasPermission:** `Boolean` Takes in an array of permissions. Resolves if the client has **ALL** of those permissions.
* **formatToReadable:** `String` Returns a readable string of `this.perms`.

<br/>

## Utils
#### checkForPermissions `Function`
Check if user and bot have permissions to run a command. Returns `Boolean`
##### Arguments:
* **client** A discord.js `Client`. Or a `Bot` Class.
* **message** A discord.js `Message`.
* **cmdName** The `name` property of a command module.
* **requiredPermissions** The `requiredPermissions` property of a command module.
#### database `object`
Database utilities.
* **guild** `object`
    * **findOneOrCreate** `async function` Simple "find or create" implementation.
        Args: 
        * *GuildModel*: a valid mongoose.Model.
        * *id* `String`: Discord guild id.

#### DateFormatter `Class`
Date formatting tools. This is in the utils and not in the classes folder because it's rarely used and more of a situational utility.
##### Arguments:
* **date:** `Date` a valid JavaScript Date object.
##### Methods
* **formatDayOfMonthToReadable:** `String` Appends the right suffix depending on the number(day of the month) and returns that string (Ex: 1 -> 1st, 2 -> 2nd, 6 -> 6th). *Ignores `this.date`*.
    Arguments:
    * **number:** `Number` The day of the month (1 - 31).
* **formatToReadable:** `String` Returns a readable string of `this.date`.
* **messageErrorHandler:** handles errors in the `message` event. DON'T TOUCH THIS ONE!
#### findMember `Function`
Returns a discord.js `GuildMember` from a given argument.
##### Arguments:
* **message** A discord.js `Message`.
* **arg** `String`, argument to match.

## 🔜 Soon
* Automating the installation with a schell script.
* Module reloading / command reloading

## 🙏 Contribution
You can open pull requests on the `main` branch. They will take around 1 week to review.

## 📜 License
[GNU General Public License v3.0 License](https://github.com/StrawHatHacker/Kiyo-Discord-Bot/blob/main/LICENSE)
