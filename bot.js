const Discord = require('discord.js');
const client = new Discord.client;
const auth = require('./auth.json');

client.on("ready", () => {
  client.user.setGame("#help for info");
});

client.on("message", (message) => {

  if(message.author.bot || message.content.indexOf(auth.prefix) !== 0) return ;

  const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const commandArgs = args.join(' ');

  if(message.channel.type === "dm" && commandArgs && ["id of the user is in the database and not signed up yet"]){
    switch (command) {
      case "name":
        name(commandArgs);
      break;
      case "age":
        age(commandArgs);
      break;
      case "timezone":
        timezone(commandArgs);
      break;
      case "place":
        place(commandArgs);
      break;
      case "role":
        role(commandArgs);
      break;
      case "gender":
        gender(commandArgs);
      break;
      case "activity":
        activity(commandArgs);
      break;
      case "info":
        info(commandArgs);
      break;
      case "reason":
        reason(commandArgs);
      break;
      default:
        "Sorry, but that does not work here..."
    }
  }
  else {
    if(command === "apply"){
      return message.reply("test");
    }
  }
});

function name(commandArgs) {

}
function age(commandArgs) {

}
function timezone(commandArgs) {

}
function place(commandArgs) {

}
function role(commandArgs) {

}
function gender(commandArgs) {

}
function activity(commandArgs) {

}
function info(commandArgs) {

}
function reason(commandArgs) {

}


client.login(auth.secret);
