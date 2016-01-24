var util = require('util');
var path = require('path');
var fs = require('fs');
var Bot = require('slackbots');
var chrono = require('chrono-node');
var moment = require('moment');

var SlackHRBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'slackhr';
};

util.inherits(SlackHRBot, Bot);

SlackHRBot.prototype.run = function () {
    SlackHRBot.super_.call(this, this.settings);

    this.on('start', this._onStart);
    this.on('message', this._onMessage);
};

SlackHRBot.prototype._onStart = function () {
    this._loadBotUser();
};

SlackHRBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

SlackHRBot.prototype._isItMe = function(message) {
	if(typeof this.user === 'undefined') this._loadBotUser();
	return this.user.id === message.user;
};

SlackHRBot.prototype._getUserById = function(userId) {
    return this.users.filter(function (user) {
        return user.id === userId;
    })[0];
};

SlackHRBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

SlackHRBot.prototype._getDate = function(message) {
	
	var parsedMessage = chrono.parse(message.text);
	if(parsedMessage.length === 0) return false;
	
	parsedMessage = parsedMessage[0];
	var start = parsedMessage.start.date();
	var end = start;
	if(parsedMessage.end){
		end = parsedMessage.end.date();
	}

	return {
		'from': start,
		'to': end
	};
};

SlackHRBot.prototype._replyToIncomingMessage = function(text, incomingMessage) {
	var sender = this._getUserById(incomingMessage.user);
	var channel = this._getChannelById(incomingMessage.channel);

   if(channel){
		this.postMessageToChannel(channel.name, text, {as_user: true});
	} else {
		this.postMessageToUser(sender.name, text, {as_user: true});
	}
};

SlackHRBot.prototype._onMessage = function (message) {
	if(message.type !== 'message' || this._isItMe(message)) return;
	
	var self = this;
	var parsedDates = this._getDate(message);

	if(!parsedDates){
		this._replyToIncomingMessage("I'm confused... I can't answer to that", message);
		return false;
	}
	var cakehr = this.settings.cakehr;
	cakehr.getTimeOff({
		'from': moment(parsedDates.from).format('YYYY-MM-DD'),
		'to': moment(parsedDates.to).format('YYYY-MM-DD'),
		'approval': 'approved'
	}).then(function (cakehrTimeOffs) {
		self._replyToIncomingMessage(cakehr.timeOffsToString(cakehrTimeOffs), message);
    });
};

module.exports = SlackHRBot;