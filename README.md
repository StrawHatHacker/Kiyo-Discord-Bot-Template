Kiyo is an open source Discord Bot under the GNU General Public License v3.0 License  <br/>
Kiyo has powerful utilities which make it great to build upon. <br/>
Feature rich and easy to maintain. <br/>
Based on the [discord.js](https://github.com/discordjs/discord.js) library.

## Installation
##### NPM and Node.js 14.0.0 or higher required.
##### MongoDB v4 or higher required. Create [here](https://docs.atlas.mongodb.com/getting-started/) for free.
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
Add the following in a new line: <br/>
`DB_CONNECTION_STRING="Connection string here"`
###### 7. Run the bot (Assuming you already are in the /src directory):
```shell
node index.js 
```
*If you see `Ready` in the console the the bot is online, congrats!*

## #Soon
* Automating the installation with a schell script.
* [OtakuGifs](https://otakugifs.xyz/) integration for anime gifs.

## Contribution
You can open pull requests on the `main` branch. They will take around 1 week to review.

## License
[GNU General Public License v3.0 License](https://github.com/StrawHatHacker/Kiyo-Discord-Bot/blob/main/LICENSE)
