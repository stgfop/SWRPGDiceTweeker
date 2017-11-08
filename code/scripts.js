window.onload=function(){

//dices[DICE_NAME][SYMBOL_NAME] -> probability (expected value)
var dices = {
	"boost": {
		"success": 2 / 6,
		"advantage": 4 / 6,
		"triumph": 0,
		"failure": 0,
		"threat": 0,
		"despair": 0,
		"light": 0,
		"dark": 0
	},
	"setback": {
		"success": 0,
		"advantage": 0,
		"triumph": 0,
		"failure": 2 / 6,
		"threat": 2 / 6,
		"despair": 0,
		"light": 0,
		"dark": 0
	},
	"ability": {
		"success": 5 / 8,
		"advantage": 5 / 8,
		"triumph": 0,
		"failure": 0,
		"threat": 0,
		"despair": 0,
		"light": 0,
		"dark": 0
	},
	"difficulty": {
		"success": 0,
		"advantage": 0,
		"triumph": 0,
		"failure": 4 / 8,
		"threat": 6 / 8,
		"despair": 0,
		"light": 0,
		"dark": 0
	},
	"proficiency": {
		"success": 9 / 12,
		"advantage": 8 / 12,
		"triumph": 1 / 12,
		"failure": 0,
		"threat": 0,
		"despair": 0,
		"light": 0,
		"dark": 0
	},
	"chalenge": {
		"success": 0,
		"advantage": 0,
		"triumph": 0,
		"failure": 8 / 12,
		"threat": 8 / 12,
		"despair": 1 / 12,
		"light": 0,
		"dark": 0
	},
	"force": {
		"success": 0,
		"advantage": 0,
		"triumph": 0,
		"failure": 0,
		"threat": 0,
		"despair": 0,
		"light": 8 / 12,
		"dark": 8 / 12
	}
}

var currentCarac = null;
var currentSkill = null;
var currentBoost = null;
var currentSetback = null;
var currentChallenge = null;
var shouldUpgradeDifficulty = false;
var difficultyLevels = ["Trivial", "Easy", "Average", "Hard", "Daunting", "Formidable"]

$("input").each(function(index, elm) {
  $(elm).click(function() {
    //alert( "Handler for .click() called." );
    if (this.name === "carac") {
      UpdateCarac(this);
    } else if (this.name === "skill") {
      UpdateSkill(this);
    } else if (this.name === "boost") {
      currentBoost = this;
      UpdateDices(this, this.name);
    } else if (this.name === "setback") {
      currentSetback = this;
      UpdateDices(this, this.name);
    } else if (this.name === "challenge") {
      currentChallenge = this;
      UpdateDices(this, this.name);
    } else if (this.name === "switchChallengeType") {
			SwitchChallengeType(this);
		}
  });
});

function UpdateCarac(elm) {
  if (currentCarac != null) {
    SelectA(currentCarac, false);
  }
  currentCarac = elm;
  SelectA(currentCarac, true);
  Update();
}

function UpdateSkill(elm) {
  if (currentSkill != null) {
    SelectA(currentSkill, false);
  }
  currentSkill = elm;
  SelectA(currentSkill, true);
  Update();
}

function UpdateDices(elm, diceName) {
  $("." + diceName).each(function(index, belm) {
    if (index > 0) {
      if (elm.value >= belm.value) {
        $(belm).parent().addClass(diceName + "-active");
      } else {
        $(belm).parent().removeClass(diceName + "-active");
      }
    }
  });

  Update();
}

function SelectA(a, isSelected) {
  if (isSelected) {
    $(a).parent().addClass("btn-selected");
  } else {
    $(a).parent().removeClass("btn-selected");
  }
}

function Update() {
  if (currentSkill == null || currentCarac == null) {
    return;
  }
  var min = currentSkill,
    max = currentSkill;
  if (currentCarac.value < min.value) {
    min = currentCarac;
  } else {
    max = currentCarac;
  }
  var apt = max.value - min.value;
  var pro = min.value;
  var boo = (currentBoost == null ? 0 : currentBoost.value);
  var sbk = (currentSetback == null ? 0 : currentSetback.value);
  var chg = (currentChallenge == null ? 0 : currentChallenge.value);
  var bonuses = UpdateExpectation(apt, pro, boo);
  UpdateResultTable(apt, pro, boo, sbk, chg, bonuses);
}

function UpdateExpectation(apt, pro, boo) {
  var succ = apt*dices.ability.success + pro*dices.proficiency.success + boo*dices.boost.success;
  var adva = apt*dices.ability.advantage + pro*dices.proficiency.advantage + boo*dices.boost.advantage;
  var triu = apt*dices.ability.triumph + pro*dices.proficiency.triumph + boo*dices.boost.triumph;

  $("#proba-success").html(succ.toFixed(2));
  $("#proba-advantage").html(adva.toFixed(2));
  $("#proba-triumph").html(triu.toFixed(2));

  UpdateColor($("#proba-success"), succ);
  UpdateColor($("#proba-advantage"), adva);
  UpdateColor($("#proba-triumph"), triu * 12);

  return [succ, adva, triu, 0];
}

function UpdateResultTable(apt, pro, boo, sbk, chg, bonuses) {
  var table = $("#result-table");
  table.empty();

  for (var inf = 0; inf <= 5; inf++) {
    var row = $('<div class="container row" id="expectations"></div>');
    var h3 = $('<h3 class="col-3 btn infortune"></h3>');
		var infDices = inf-chg;
		var chgDices = chg;
		var label;
		if (shouldUpgradeDifficulty) {
			infDices = inf;
			chgDices = 0;
			var upgrade = chg;
			while (upgrade > 0) {
				if (infDices > 0) {
					chgDices++;
					infDices--;
				} else {
					infDices++;
				}
				upgrade--;
			}
		} else {
			if (infDices < 0) {
				infDices = 0;
				chgDices = inf;
			}
		}
		if (chgDices > 0) {
			label = infDices+"/"+chgDices;
		} else {
			label = ""+infDices;
		}
    var h3span = $('<span>'+label+'</span>');
    h3.append(h3span);
    h3span = $('<span class="hidden-xs"> - '+difficultyLevels[inf]+'</span>');
    h3.append(h3span);
    row.append(h3);


    var maluses = [
	  infDices*dices.difficulty.failure + chgDices*dices.chalenge.failure + sbk*dices.setback.failure,
	  infDices*dices.difficulty.threat + chgDices*dices.chalenge.threat + sbk*dices.setback.threat,
	  0,
	  infDices*dices.difficulty.despair + chgDices*dices.chalenge.despair + sbk*dices.setback.despair
    ]

    for (var i = 0; i < 4; i++) {
      var result = (bonuses[i] - maluses[i]) * (i == 3 ? -1 : 1);
      var color = ColorFor(result * (i >= 2 ? 12 : 1));
      var button = $('<button type="button" class="btn ' + color + ' col-2"></button>');
      var span = $('<span class="badge badge-light" id="result-' + inf + '-' + i + '"></span>');

      span.data("color", color);
      span.text(result.toFixed(2));
      button.append(span);
      row.append(button);
    }

    table.append(row);
  }
}

function UpdateColor(elm, value) {
  var color = elm.data("color");
  if (color != null) {
    elm.parent().removeClass(color);
  }
  color = ColorFor(value);
  elm.data("color", color);
  elm.parent().addClass(color);
}

function ColorFor(value) {
  if (value < -2.0) return "btn-fail-3";
  if (value < -1.0) return "btn-fail-2";
  if (value < 0.0) return "btn-fail-1";
  if (value < 1.0) return "btn-null";
  if (value < 2.0) return "btn-success-1";
  if (value < 3.0) return "btn-success-2";
  if (value < 4.0) return "btn-success-3";
  if (value < 5.0) return "btn-success-4";
	if (value < 6.0) return "btn-success-5";
	if (value < 7.0) return "btn-success-6";
  return "btn-success-7";
}

function SwitchChallengeType(elm) {
	shouldUpgradeDifficulty = !elm.checked;

	$("#switchChallengeType-text").html((shouldUpgradeDifficulty ? "Switch from Difficulty upgrade to Challenge" : "Switch from Challenge to Difficulty upgrade"))
	$("#switchChallengeType-header").html((shouldUpgradeDifficulty ? "Diff. upgrade" : "Challenge"))
  Update();
}


function log() {
  var message = "<p>";
  for (i = 0; i < arguments.length; i++) {
    message += arguments[i] + " ";
  }
  $("#log").prepend(message + "</p>")
}

}
