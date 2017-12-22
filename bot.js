const Discord = require('discord.js');
const client = new Discord.Client();
const sql = require("sqlite");
const fs = require('fs');
const auth = require("./auth.json");
const list = './submission_folder/submission_list.md';
sql.open("./submissions.sqlite");

client.on("ready", () => {
  client.user.setGame("#apply to apply");
});

client.on("message", (message) => {

  if(message.author.bot || message.content.indexOf(auth.prefix) !== 0) return ;

  const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const commandArgs = args.join(' ');
  const on = "false"; //use "" to turn it on and use "false" to turn it off

  //FOR TESTING PURPOSE ONLY!!!
  //DELETE THIS SECTION WHEN YOU ARE DONE WITH THE TESTING PHASE!!
  if(command === "reset"){
    sql.run(`UPDATE submissions SET userId = null WHERE userId = ${message.author.id}`);
    return message.reply("Done");
  }
  //
  //


  if(message.author.id == "140464114806947840" || message.author.id == "181749465089048576"){
    if(command === "getlist"){
      fs.writeFileSync(list, "");
      sql.all(`SELECT * FROM submissions WHERE applied = 1`).then(row => {
        if (!row) return message.reply(`AN ERROR HAS OCCURED!!\n${row}`);
        else{
        for(var i=0; i < row.length; i++){
          var read = fs.readFileSync(list, "utf8");
          fs.writeFileSync(list, read+
          "THIS PART IS FOR THE USER: "+row[i].user+"\r\n"+
          "Name: "+row[i].name+"\r\nAge: "+row[i].age+"\r\nTimezone: "+row[i].timezone+"\r\n"+
          "Place: "+row[i].place+"\r\nRole: "+row[i].role+"\r\nGender: "+row[i].gender+"\r\n"+
          "Activity: "+row[i].activity+"\r\nInfo: "+row[i].info+"\r\nReason: "+row[i].reason+"\r\n"+
          "---------------------------------------------------------------------------------------\r\n\r\n");
        }
          message.channel.send({file: list});//(list, "attachment");
        }
      });
    }
    if(command === "delete"){
      sql.run(`DELETE FROM submissions WHERE userId = (?)`, commandArgs, function(err){
        return message.reply("User has been deleted!");
      });
    }
  }
  if(on === "false") return message.reply("We do not need any moderators right now.");



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
        case "done":
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
                                  "\nWhen you are done, type #done"+
                                  "```");
    }
  }
  else {
    if(command === "apply" || command === "submission"){
      var started = "false";
      sql.get(`SELECT * FROM submissions WHERE userId = "${message.author.id}"`).then(row => {
        if(!row){
          sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0]);
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
        sql.run("CREATE TABLE IF NOT EXISTS submissions (userId INTEGER PRIMARY KEY, applied INTEGER, name TEXT, age INTEGER, timezone TEXT, place TEXT, role TEXT, gender TEXT, activity TEXT, reason TEXT, info TEXT, user TEXT)").then(() => {
          sql.run("INSERT INTO submissions (userId, applied, name, age, timezone, place, role, gender, activity, reason, info, user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0]);
        });
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
      });
    }
  }
});
function finished(message){
  sql.get(`SELECT * FROM submissions WHERE userId = ${message.author.id} AND age IS NOT NULL AND timezone IS NOT NULL AND place IS NOT NULL AND role IS NOT NULL AND gender IS NOT NULL AND activity IS NOT NULL AND reason IS NOT NULL AND info IS NOT NULL`).then(row => {
    if (!row) return message.reply("Please fill in all information");
    else{
      if(row.age >= 14){
        sql.run(`UPDATE submissions SET applied = ${1}, user = "${message.author.tag}" WHERE userId = ${message.author.id}`);
        return message.channel.send("Thank you for your application!"+
        "/nYou will hear from a Head Moderator soon.");
      } else return message.channel.send("You do not meet our requirements, try again later.");
    }
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
