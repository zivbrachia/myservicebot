//npm install --save restify
var restify = require('restify');
//npm install --save botbuilder
var builder = require('botbuilder');
//npm install strong-soap
var soap = require('strong-soap').soap;

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Create chat bot
var bot = new builder.UniversalBot(connector);
//var bot = new builder.UniversalBot(connector, {
//    localizerSettings: { 
//        botLocalePath: "./locale", 
//        defaultLocale: "he" 
//    }
//});

var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);
//
intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile-name', session.dialogData);
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);
//
intents.matches(/^change years/i, [
    function (session) {
        session.beginDialog('/profile-years', session.dialogData);
    },
    function (session, results) {
        session.send('Ok... Changed your years to %s', session.userData.coding);
    }
]);
//
intents.matches(/^change lang/i, [
    function (session) {
        session.beginDialog('/profile-lang', session.dialogData);
    },
    function (session, results) {
        session.send('Ok... Changed your lan to %s', session.userData.language);
    }
]);
//
intents.matches(/^show profile/i, [
    function (session) {
        session.beginDialog('/profile-toString', session.dialogData);
    }
]);
//
intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.sendTyping();
            session.beginDialog('/profile');
        } else { 
            next();
        }
    },
    function (session, results) {
        //session.send('Hello %s!', session.userData.name);
        session.sendTyping();
        session.send('!שלום %s איך אפשר לעזור', session.userData.name);
        //session.send('https://youtu.be/IUwM5d3qvUY');
        
    }
]);

bot.dialog('/profile-name', [
    function (session) {
        session.sendTyping();
        builder.Prompts.text(session, "Hello... What's your name?");
       },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialogWithResult(results);
    }
]);
//
bot.dialog('/profile-years', [
    function (session) {
        session.sendTyping();
        builder.Prompts.number(session, "Hi " + session.userData.name + ", How many years have you been coding?", {maxRetries : 1});
       },
    function (session, results) {
        session.userData.coding = results.response;
        session.endDialogWithResult(results);
    }
]);
//
bot.dialog('/profile-lang', [
    function (session) {
        session.sendTyping();
        builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
       },
    function (session, results) {
        session.userData.language = results.response.entity;
        session.endDialogWithResult(results);
    }
]);
//
bot.dialog('/profile-toString', [
    function (session) {
        session.sendTyping();
        session.endDialog("Got it... " + session.userData.name + 
                     " you've been programming for " + session.userData.coding + 
                     " years and use " + session.userData.language + ".");
    }
]);
//
bot.dialog('/profile', [
    function (session) {
        session.beginDialog('/profile-name', session.dialogData);
       },
    function (session, results) {
        session.beginDialog('/profile-years', session.dialogData);
    },
    function (session, results) {
        session.beginDialog('/profile-lang', session.dialogData);
    },
    function (session, results) {
        session.beginDialog('/profile-toString', session.dialogData);
        session.endConversation('');
    }
]);

/*
bot.dialog('/cards', [
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle"))
            ]);
            console.log("aaa");
        session.send(msg);
    }
]);
*/