// we just import our SlackHRBot class, we instantiate it and we launch the bot with the run method. 
// It’s worth noticing that we are using some environment variables to make our bot configurable:
// 		
// 		BOT_API_KEY: this variable is mandatory and must be used to specify the API 
// 		token needed by the bot to connect to your Slack organization
// 		xoxb-19246230949-FzJZrAecCae3SOyizM83m2Mh
// 		 		
// 		BOT_NAME: the name of your bot, it’s optional and it will default to slackhrbot
// 		
// 		CAKEHR_API_KEY

var SlackHRBot = require('../lib/slackhr');
var CakeHR = require('../lib/cakehr');

var token = process.env.BOT_API_KEY;
var name = process.env.BOT_NAME;
var cakehr_token = process.env.CAKEHR_API_KEY;

if (!cakehr_token) {
	throw 'CAKEHR_API_KEY is not defined';
}

var cakehr = new CakeHR({
    token: cakehr_token
});

var slackhrbot = new SlackHRBot({
    token: token,
    name: name,
    cakehr: cakehr
});

slackhrbot.run();