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

## 🙏 Contribution
You can open pull requests freely 👍

## 📜 License
[GNU General Public License v3.0 License](https://github.com/StrawHatHacker/Kiyo-Discord-Bot/blob/main/LICENSE)
