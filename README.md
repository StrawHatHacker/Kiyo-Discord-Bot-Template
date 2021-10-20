Kiyo is an open source Discord Bot under the GNU General Public License v3.0 License.  <br/>
Kiyo has powerful utilities which make it quick and easy to build upon.  <br/>
Feature rich and easy to maintain. <br/>
Based on the [discord.js](https://github.com/discordjs/discord.js) library.

## 📥 Installation
<b> Node.js v16.6.0 or higher required. </b> Download [here](https://nodejs.org/) <br/>
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
touch .env
```

###### 5. Add bot token into the .env file:
Open .env with your favourite text editor and add this line along with your bot token:

`DISCORD_BOT_TOKEN="Your bot token here"`

###### 6. Add MongoDB connection string into the .env file:
`DB_CONNECTION_STRING="Connection string here"`

###### 7. Add your Discord ID into the .env file:
`BOT_OWNER_ID="Discord ID here"`

###### 8. Add your development guild ID into the .env file:
`DEV_GUILD_ID="Discord ID here"`

###### 9. Add your bot's client ID into the .env file:
`BOT_ID="Discord ID here"`

###### 10. Add your environment into the .env file:
Can be either `DEV` or `PRODUCTION`. Use `PRODUCTION` to load slash commands for all guilds. Use `DEV` to load slash commands faster, only for your development server.
`ENVIRONMENT="Environment value here"`

###### 11. Run the bot (Assuming you are already in the /src directory):
```shell
node index.js 
```

###### 12. (Optional) Add your OtakuGIFs token for anime GIF reactions.
Get an API Token from https://otakugifs.xyz and add it to the .env file in a new line:
`OTAKUGIFS_TOKEN="API Key here"`

## Creating a command
A command should be a file that exports an object. Required properties of that object are:

```javascript
module.exports = {
    name: 'ban',
    description: 'Bans a user',
    aliases: ['boot'],
    syntax: 'ban <member> [reason]',
    requiredPermissions: {
        user: ['BAN_MEMBERS'],
        client: ['BAN_MEMBERS']
    },
    async run() {
        // code here
    }
}
```

`name`: Is the name of the command. It gets matched to user input.

`description`: General information about the command.

`aliases`: Array of strings that can invoke the command. They get matched to user input.

`syntax`: Visual representation of how the command should be structured in order to be executed. Elements wrapped in <> are required, elements wrapped in [] are optional.

`requiredPermissions`: *user* and *client* properties are arrays of key permissions flags that are needed run a command. In the case of *user*, the user needs any of the 
permissions to be authorized. In the case of *client*, the bot needs all of the permissions to run the command.

`run`: Function to execute when the command is invoked.

Needed for slash commands:

`slashCommand`: True or false, signifying if the object is a slash command. Should be true for obvious reasons.

`data`: Required information for slash commands. Refer to [this article](https://discordjs.guide/interactions/registering-slash-commands.html#options).


Optional properties:

`cooldown`: The cooldown of the command in milliseconds.

`selfPopulate`: A function that is run when the bot loads the command. Usually used to populate the aliases array, like the reaction command's, or create the data property for slash commands.

## Common issues
* **Slash commands not working**
Make sure the `application.commands` scope is authorized for your guild.

## 🙏 Contribution
You can open pull requests freely 👍

## 📜 License
[GNU General Public License v3.0 License](https://github.com/StrawHatHacker/Kiyo-Discord-Bot/blob/main/LICENSE)
