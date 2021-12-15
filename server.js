/* Setting things up. */
const express = require("express"),
  app = express(),
  CronJob = require("cron").CronJob,
  Twit = require("twit"),
  config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */

    twitter: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  },
  T = new Twit(config.twitter);

app.use(express.static("public"));

let listener = app.listen(process.env.PORT, function() {
  console.log("Your bot is running on port " + listener.address().port);

  /*
    Set up a new cron job to start tweeting automatically.
    Check out https://www.npmjs.com/package/cron#available-cron-patterns to learn more about cron scheduling patterns.
    
    For a few examples, see https://glitch.com/edit/#!/creative-bots?path=helpers%2Fcron-schedules.js

  */

  var cron = require("node-cron");
  cron
    .schedule("0 * * * *", () => {
      console.log("running a task at the start of every hour"); //function logic goes here});
      /* The example below tweets out "Hello world 👋" and the current date. */
      const date = new Date().toLocaleString();

      T.post("statuses/update", { status: countdownMessage() }, function(
        err,
        data,
        response
      ) {
        if (err) {
          console.log("error!", err);
        } else {
          console.log(
            "tweeted",
            `https://twitter.com/${data.user.screen_name}/status/${data.id_str}`
          );
        }
      });
    })
    .start();
});
//Set the date to which you want to count down to here!
var countdownYear = 2022;
var countdownMonth = 2;
var countdownDay = 7;

const moment = require("moment");

//Get current date and time
const current = new Date();

//Get current timestamp in UTC
const now = current.getTime();

var currentYear = current.getUTCFullYear();
var currentMonth = current.getUTCMonth();
var currentDate = current.getUTCDate();

//Convert countdown date to UTC
const end = new Date(
  Date.UTC(countdownYear, countdownMonth, countdownDay, 0, 0, 0, 0)
).getTime();

const diffTime = end - now;

var diffDuration = moment.duration(diffTime, "milliseconds");

/* Returns the message to send as our status update */
function countdownMessage() {
  /* envoyer differentes onomatopées dans les tweets */

  var alphabet = [
    "BLIP",
    "BLOP",
    "BLOUP",
    "BZZ",
    "TAC",
    "BIIIIIIIIP",
    "BANG",
    "TIK",
    "TUT TUT TUT TUT",
    "ZIP ZAP",
    "ZZZZZZZZZZZ",
    "DIIIIING",
    "PWOUET",
    "POP",
    "BOOM",
    "SWOUIIIISHHHHH"
  ];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  var bruit1 = alphabet[getRandomInt(0, alphabet.length)];
  var bruit2 = alphabet[getRandomInt(0, alphabet.length)];
  var bruit3 = alphabet[getRandomInt(0, alphabet.length)];

  var status = "";

  if (diffTime > 0) {
    status += `🤖 ${bruit1} ${bruit2} 🤖 Il reste`;

    if (diffDuration.months() > 1) {
      status += ` ${diffDuration.months()} mois &`;
    } else if (diffDuration.months() == 1) {
      status += ` ${diffDuration.months()} mois &`;
    }

    if (diffDuration.days() > 1) {
      status += ` ${diffDuration.days()} jours`;
    } else if (diffDuration.days() == 1) {
      status += ` ${diffDuration.days()} jour`;
    }

    //Change the text //
    status += ` pour vous inscrire sur les listes électorales pour les élections présidentielles de 2022, si ce n\'est pas encore le cas. Plus d\'infos ici -> https://www.service-public.fr/particuliers/actualites/A15311  ${bruit3} 🤖
   #elections2022`;
  } else {
    //Change the text //
    status +=
      "J'espère que vous êtes bien inscrits ! Y'a plus qu'à se bouger la croupe jusqu'à votre bureau de vote! Blip Bloup. Je m'endors. A dans 5 ans !";
  }

  return status;
}
