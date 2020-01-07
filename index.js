var express = require('express');
const path = require('path');
var app = express();
app.listen(3000, function () {
  console.log("Server started on port 3000");
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

const Telegraf = require('telegraf')
const config = require('./config.json')

const bot = new Telegraf(config.token)

bot.start((ctx) => {
    return ctx.reply('Please, send me a question')
})
bot.command('/post', (ctx) => {
    ctx.reply('Send me a question!')
})
bot.command('/stop', (ctx) => {
    ctx.reply('Ой все, просто не пиши...')
})

//FOR STUPID PEOPLE WHO WRITE THIS SHIT
checkHears()

//SENDING PHOTO WITH CAPTION
bot.on('photo', (ctx) => {
    
    var counter = updateCounter();                                                  //UPDATE COUNTER of QUESTIONS

    photo = ctx.message.photo[0].file_id;                                           //GETTING PHOTO
    text = ctx.message.caption;                                                     //GETTING CAPTION
    user = getUser(ctx);                                                            //GETTING USERNAME

    text = "Question #" + counter + " \n" + text + "\n\nFrom: " + user;

    //SENDING TO CONFING_CHAT_ID
    ctx.telegram.sendPhoto(config.chat_id, photo, {
        caption: text
    }, (ctx) => {
        return ctx.reply('Done')
    })
})


//SENDING MESSAGE
bot.on('message', (ctx) => {

    var msg = ctx.message.text                                                      //GETTING MESSAGE TEXT
    var counter = updateCounter();                                                  //UPDATING COUNTER OF QUESTIONS
    var user = getUser(ctx);                                                        //GETTING USERNAME

    msg = "Question #" + counter + " \n\n<b>" + msg + "</b>\n\nFrom: " + user;      //BUILDING MESSAGE
    
    ctx.telegram.sendMessage(config.chat_id, msg, {parse_mode: "HTML"}, (ctx) => {
        return ctx.reply('Done');                                                   //SENDING TO CHANNEL
    })    


    ctx.reply("Open our Telegram Channel @iut_faq in order to discuss it.\n******************\nSend next question:")
})

//COUNTER UPDATER FUNCTION
function updateCounter(i){
    const fs = require('fs');

    let file = fs.readFileSync('config.json')                                       //READING FILE config.json
    let counter = JSON.parse(file)                                                  //PARSING INTO JSON

    counter.counter += 1;                                                           //INCREMENT COUNTER
    let data = JSON.stringify(counter)                                              //BULDING JSON FORMAT

    i = counter.counter;                                                            //PREPARING VALUE TO RETURN

    fs.writeFile('config.json', data, (err) => {                                    //WRITING INTO FILE config.json
        if(err) throw err;
        console.log("Data written to file")                                         //FOR DEBUG
    })
    return i;                                                                       //RETURN VALUE OF NEW COUNTER
}

//GETTING USERNAME FUNCTION
function getUser(ctx){
    var username = ctx.from.username;                                               //GETTING USERNAME
    var first_name = ctx.from.first_name;                                           //GETTING FIRST NAME
    var last_name = ctx.from.last_name;                                             //GETTING LAST NAME
    var user;                                                                       //EMPTY VALUE

    //CHECKING USERNAME, FIRSTNAME AND LASTNAME
    if(!username && !last_name){
        user = first_name;
    }
    else if(!username){
        user = first_name + " " + last_name;
    }
    else{
        user = '@' + username;
    }

return user                                                                         //RETURN USERNAME
}

function checkHears(){
    bot.hears('hi', (ctx) => {
        ctx.reply('Хай май, вопрос гони...')
    })
    bot.hears('Hi', (ctx) => {
        ctx.reply('Хай май, вопрос гони...')
    })
    bot.hears('hello', (ctx) => {
        ctx.reply('Хорош писать хелло, где вопрос?')
    })
    bot.hears('Hello', (ctx) => {
        ctx.reply('Хорош писать хелло, где вопрос?')
    })
    bot.hears('test', (ctx) => {
        ctx.reply('Да работает все...')
    })
    bot.hears('Test', (ctx) => {
        ctx.reply('Да работает все...')
    })
}

bot.startPolling()