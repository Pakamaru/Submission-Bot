const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
const fs = require('fs');
const auth = require("./auth.json");
sql.open("./submissions.sqlite");

client.on("ready", () => {
  client.user.setGame("#apply to apply");
});

client.on("message", (message) => {

  if(message.author.bot || message.content.indexOf(auth.prefix) !== 0) return ;

  const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const commandArgs = args.join(' ');

  //FOR TESTING PURPOSE ONLY!!!
  //DELETE THIS SECTION WHEN YOU ARE DONE WITH THE TESTING PHASE!!
  if(command === "reset"){
    sql.run(`UPDATE submissions SET userId = null WHERE userId = ${message.author.id}`);
    return message.reply("Done");
  }
  //
  //

  if(message.channel.type === "dm"){
    sql.get(`SELECT * FROM submissions WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return message.reply("AN ERROR HAS OCCURED");
    let applied = row.applied;
    if(applied === 0){
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
        case "done!":
          finished(message);
        default:
          "Sorry, but that does not work here..."
      }
    } else if (applied === 1) {
      return message.channel.send("```diff"+
                                  "\n- Sorry, but you have already applied for this application. You'll hear from us soon."+
                                  "\nIf you don't hear from us in one week, please send a direct message to one of our Head Moderators."+
                                  "```");
    }
    });
    if(command === "start"){
      return message.channel.send("```fix"+
                                  "\nWelcome to the moderator application!"+
                                  "\nThis is the application anyone has to pass before it's possible to become moderator."+
                                  "``````css"+
                                  "\nThere is some basic information we need to know. Underneath you can see all the information we'll need, as well as an example on how to give this information."+
                                  "\n\nKeep in mind that your information will only be shared with our trusted Head Moderators."+
                                  "``````glsl"+
                                  "\nHere is an example on how to give the proper information."+
                                  "\nI type: #timezone UTC -5"+
                                  "\nI recieve: Value set."+
                                  "``````css"+
                                  "\n#name (full name) #age (in years) #timezone (for instance: UTC +1) #place (for instance: Amsterdam, The Netherlands) #role (YouTube/Discord) #gender (Male/Female/Other) #activity (the amount of hours you'll be active each week) #reason (your motivation) #info (any other additional information, this is not required)"+
                                  "\nWhen you are done, type #done!"+
                                  "```");
    }
  }
  else {
    if(command === "apply" || command === "submission"){
      sql.get(`SELECT * FROM submissions WHERE userId = "${message.author.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0]);
          return message.author.send("```fix"+
                                            "\nHello "+message.author.username+"!"+
                                            "\nThanks for your interest in becoming moderator!"+
                                            "``````"+
                                            "\nThere are a couple of steps to take before anyone can become a moderator."+
                                            "\nFirst there are some basic questions you’ll have to answer. If you make it through, one of our Head Moderators will have a 1 on 1 chat conversation with you to see if you’ll be suited as a moderator."+
                                            "\n\nPlease note: we do not need moderators at all time."+
                                            "\nThere is also no reason to feel sad if you don’t make it through."+
                                            "\nYou can still have a great time chatting on YouTube and Discord!"+
                                            "``````css"+
                                            "\nTo start with the application please type #start"+
                                            "```");
        } else {
          return message.channel.send("```diff"+
                                      "\n- Sorry, but you have already applied for this application. You'll hear from us soon."+
                                      "\nIf you don't hear from us in one week, please send a direct message to one of our Head Moderators."+
                                      "```");
        }
      }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS submissions (userId TEXT PRIMARY KEY, applied INTEGER, name TEXT, age INTEGER, timezone TEXT, place TEXT, role TEXT, gender TEXT, activity TEXT, reason TEXT, info TEXT)").then(() => {
          sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0]);
        });
      });
    }
  }
});

function finished(message){
  sql.run(`UPDATE submissions SET applied = ${1} WHERE userId = ${message.author.id}`);
  sql.get(`SELECT * FROM submissions WHERE userId ="${message.author.id}"`).then(row => {
  if (!row) return message.reply("AN ERROR HAS OCCURED");
  fs.writeFileSync("./submission_folder/"+message.author.username+message.author.id+".txt",
  `Name: ${row.name}\r\nAge: ${row.age}\r\nTimezone: ${row.timezone}\r\n"+
  "Place: ${row.place}\r\nRole: ${row.role}\r\nGender: ${row.gender}\r\n"+
  "Activity: ${row.activity}\r\nInfo: ${row.info}\r\nReason: ${row.reason}`);
  return message.channel.send("Thank you for your application!\nYou will hear from a head moderator soon.")
  });
}
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
  sql.run(`UPDATE submissions SET place = "${commandArgs}" WHERE userId = ${message.author.id}`);
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
