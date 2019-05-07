$(document).ready(function() {

	//creating game characters
	var characters = {
		"Muhammad Ali": {
			name: "Muhammad Ali",
			imageUrl: "assets/images/ali.jpg",
			health: 150,
			attack: 15,
			counterAttack: 25,
		},
		"Rocky Balboa": {
			name: "Rocky Balboa",
			imageUrl: "assets/images/rocky.jpg",
			health: 140,
			attack: 12,
			counterAttack: 18,
		},
		"Mike Tyson": {
			name: "Mike Tyson",
			imageUrl: "assets/images/tyson.jpg",
			health: 150,
			attack: 10,
			counterAttack: 22,
		},
		"Floyd Mayweather": {
			name: "Floyd Mayweather",
			imageUrl: "assets/images/mayweather.jpg",
			health: 130,
			attack: 8,
			counterAttack: 15,
		}
	}; 

  var fighter;
  var availableOpponents = [];
  var opponent;
  var turnCounter = 1;
	var killCount = 0;
	var opponentsLabel = "Opponents Available To Fight";
	var fighterLabel = "Your Fighter"
	var oppLabel = "Opponent"


	//Game sounds
	var punch = new Audio("./assets/sounds/punch.mp3");
	var start = new Audio("./assets/sounds/bell.mp3");
	var winSound = new Audio("./assets/sounds/cheer.mp3");
	var loseSound = new Audio("./assets/sounds/boos3.mp3");

  //creating the cards for users to select fighter and Opponents.
  var renderCharacter = function(character, renderArea) {
    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
		var charHealth = $("<div class='character-health'>").text(character.health);
	
	//adding newly created character properties to character cards
    charDiv.append(charName).append(charImage).append(charHealth);
    $(renderArea).append(charDiv);
  };

  //adding newly created cards to the DOM
  var initializeGame = function() {
    for (var key in characters) {
      renderCharacter(characters[key], ".choose-character");
		}
		$(".attack").hide();
  };
	initializeGame();


var updateCharacter = function(charObj, areaRender) {
  $(areaRender).empty();
     renderCharacter(charObj, areaRender);
};

// establishing other Opponents and displaying in correct section
var renderOpponents = function(opponentArr) {
  for (var i = 0; i < opponentArr.length; i++) {
	renderCharacter(opponentArr[i], ".Opponents");
  }
};

var renderMessage = function(message) {
	var gameMessageSet = $("#game-message");
	var newMessage = $("<div>").text(message);
	gameMessageSet.append(newMessage);
  };


var restartGame = function(resultMessage) {
	var restart = $("<button>Restart</button>").click(function() {
	  location.reload();
	});
  
	var gameState = $("<div class='endMessage'>").text(resultMessage);
	$(".end-game-notes").append(gameState);
	$(".end-game-notes").append(restart);
  };

  var clearMessage = function() {
	var gameMessage = $("#game-message");
	gameMessage.text("");
  };

$(".choose-character").on("click", ".character", function() {
  var name = $(this).attr("data-name");

  if (!fighter) {
	fighter = characters[name];
	for (var key in characters) {
	  if (key !== name) {
		availableOpponents.push(characters[key]);
	  }
	}
	$(".choose-character").hide();
	$(".other-Opponents").append(opponentsLabel);
	$(".fighter").append(fighterLabel);
	$(".opponent-attack").append(oppLabel);
	updateCharacter(fighter, ".your-fighter");
	renderOpponents(availableOpponents);
  }
});


$(".Opponents").on("click", ".character", function() {
  var name = $(this).attr("data-name");

  if ($(".opponent-fight").children().length === 0) {
	opponent = characters[name];
	updateCharacter(opponent, ".opponent-fight");
	start.play()
	$(this).hide();
	clearMessage();
	}
	$(".attack").show();
});


$(".attack").on("click", function() {
  if ($(".opponent-fight").children().length !== 0) {
	punch.play();
	var attackMessage = "You hurt " + opponent.name + " by " + fighter.attack * turnCounter + ".";
	var counterAttackMessage = opponent.name + " hurt you by " + opponent.counterAttack + ".";
	clearMessage();

	opponent.health -= fighter.attack * turnCounter;

	if (opponent.health > 0) {
	
	  updateCharacter(opponent, ".opponent-fight");
	  renderMessage(attackMessage);
	  renderMessage(counterAttackMessage);
	  fighter.health -= opponent.counterAttack;
	  updateCharacter(fighter, ".your-fighter");

	  if (fighter.health <= 0) {
		clearMessage();
		$(".attack").hide(); 
		restartGame("You have been knocked out...GAME OVER!!!");
		loseSound.play();

		$(".attack-button").off("click");
	  }
	}
	else {
	  $(".opponent-fight").empty();

	  var gameStateMessage = "You knocked out " + opponent.name + ", you can choose to fight another opponet.";
	  renderMessage(gameStateMessage);
	  killCount++;
	
	  if (killCount >= availableOpponents.length) {
		clearMessage();
		$(".attack").hide();
		restartGame("You Are the Champion!!!! GAME OVER!!!");
		winSound.play();
	  }
	}
	turnCounter++;
  }
  else {
	clearMessage();
	renderMessage("No opponet here.");
  }
});


});