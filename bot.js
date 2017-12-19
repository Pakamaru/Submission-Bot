const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
const auth = require("./auth.json");
sql.open("./submissions.sqlite");

client.on("ready", () => {
  client.user.setGame("#help for info");
});

client.on("message", (message) => {

//FOR TESTING PURPOSE ONLY!!!
//DELETE THIS SECTION WHEN YOU ARE DONE WITH THE TESTING PHASE!!
if(command === "reset"){
  sql.run(`UPDATE submissions SET userId = null WHERE userId = ${message.author.id}`);
}
//
//

  if(message.author.bot || message.content.indexOf(auth.prefix) !== 0) return ;

  const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const commandArgs = args.join(' ');
  let applied;

  if(message.channel.type === "dm"){
    if(command === "start"){
      sql.get(`SELECT * FROM submissions WHERE userId = "${message.author.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)", [message.author.id, "NULL"]);
        } else {
          return message.channel.send("Sorry, but you have already applied and we have not yet looked at your application.");
        }
        }).catch(() => {
          console.error;
          sql.run("CREATE TABLE IF NOT EXISTS submissions (userId TEXT PRIMARY KEY, applied TEXT, name TEXT, age INTEGER, timezone TEXT, place TEXT, role TEXT, gender TEXT, activity TEXT, reason TEXT, info TEXT)").then(() => {
            sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)", [message.author.id, "NULL"]);
          });
        });
      applied = sql.get(`SELECT applied FROM submissions WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("AN ERROR HAS OCCURED");
      });
      const values = "#name #age #timezone #place #role #gender #activity #reason #info";
      return message.channel.send(values);
    }
    //TODO: turn applied on when you are done with the form!
    if(applied === null || applied === "" || applied == "NULL"){
      switch (command) {
        case "name":
          name(commandArgs, message);
        break;
        case "age":
          age(commandArgs, message);
        break;
        case "timezone":
          timezone(commandArgs, message);
        break;
        case "place":
          place(commandArgs, message);
        break;
        case "role":
          role(commandArgs, message);
        break;
        case "gender":
          gender(commandArgs, message);
        break;
        case "activity":
          activity(commandArgs, message);
        break;
        case "info":
          info(commandArgs, message);
        break;
        case "reason":
          reason(commandArgs, message);
        break;
        default:
          "Sorry, but that does not work here..."
      }
    }
  }
  else {
    if(command === "apply" || command === "submission"){
      console.log("test");
      return message.author.sendMessage("Hello "+message.author.username+"!"+
        "\nThanks for your interest in becoming moderator!"+
        "\nThere are a couple of steps to take before anyone can become a moderator."+
        "\nFirst there are some basic questions you’ll have to answer."+
        "\nIf you get through, one of our head moderators will have a 1 on 1 chat conversation with you to see if you’ll be suited as a moderator."+
        "\nPlease note that we do not need moderators at all time. There is definitely no reason to feel sad if you don’t make it through."+
        "\nYou can still have a great time chatting on YouTube and Discord!"+
        "\nTo start with the application please type #start");
    }
  }
});

function name(commandArgs, message) {
  sql.run(`UPDATE submissions SET name = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function age(commandArgs, message) {
  sql.run(`UPDATE submissions SET age = ${parseInt(commandArgs)} WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function timezone(commandArgs, message) {
  sql.run(`UPDATE submissions SET timezone = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function place(commandArgs, message) {
  sql.run(`UPDATE scosubmissionsres SET place = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function role(commandArgs, message) {
  sql.run(`UPDATE submissions SET role = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function gender(commandArgs, message) {
  sql.run(`UPDATE submissions SET gender = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function activity(commandArgs, message) {
  sql.run(`UPDATE submissions SET activity = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function info(commandArgs, message) {
  sql.run(`UPDATE submissions SET info = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}
function reason(commandArgs, message) {
  sql.run(`UPDATE submissions SET reason = "${commandArgs}" WHERE userId = ${message.author.id}`);
  return message.channel.send("Value set.");
}

client.login(auth.token);
