var keys = require('./keys.js');
var twitter = require("twitter");
var client = new twitter(keys.twitterKeys); 
var spotify = require('spotify');
var request = require('request');
var fs = require("fs");
var userCommand = process.argv[2];
var userInput = process.argv[3]; 

// for (var i = 3; i < process.argv.length; i++) {
// 	userInput += '+' + process.argv[i]; 
// };

console.log(process.argv[2]); 

function theSwitch() {
	switch(userCommand){
		case "my-tweets":
			fetchTweets();
			break; 
		case 'spotify-this-song':
			spotifyMe(userInput); 
			break; 
		case 'movie-this':
			moiveMe(userInput);
			break;
		case 'do-what-it-says':
			textRead(userInput);
			break; 
		default:
			console.log("Please choose 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'")
	}

};

function fetchTweets(){
	console.log("Displaying Tweets"); 

	var screenName = {screen_name: 'sagvoss'};

	client.get('statuses/user_timeline', screenName, function(error, tweets, response){
		//displays last 20 tweets 0 - 19 counting 0 as 1 
		if(!error){
			for (var i = 0; i < tweets.length; i++){
				var date = tweets[i].created_at;
				console.log("@sagvoss: " + tweets[i].text + 
					".\n"+ "Created at: " + date.substring(0, 19)); 
				console.log("------------------"); 
			}
		} else {
			console.log("error"); 
		}
	})
};

function spotifyMe(song){
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < 3; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function moiveMe(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie;

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('Error occurred.')
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function textRead(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}

theSwitch(); 