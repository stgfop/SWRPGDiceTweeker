window.onload=function(){
var currentCarac = null;
var currentSkill = null;
var currentBoost = null;
var currentSetback = null;
var currentChallenge = null;
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
  var succ = apt * 0.50 + apt * 2 * 0.12 + pro * 0.58 + pro * 2 * 0.16 + boo * 0.33;
  var adva = apt * 0.50 + apt * 2 * 0.12 + pro * 0.50 + pro * 2 * 0.16 + boo * 0.5 + boo * 2 * 0.16;
  var triu = pro * 0.0834;

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
	if (infDices < 0) {
		infDices = 0;
		chgDices = inf;
	}
	var label = ""+inf;
	if (chgDices > 0) {
		label = infDices+"/"+chgDices;
	}
	
    var h3span = $('<span>'+label+'</span>');
    h3.append(h3span);
    h3span = $('<span class="hidden-xs"> - '+difficultyLevels[inf]+'</span>');
    h3.append(h3span);
    row.append(h3);

	
    var maluses = [
      infDices * 0.37 + infDices * 2 * 0.12 + sbk * 0.33 + chgDices * 0.5 + chgDices * 2 * 0.16,
      infDices * 0.62 + infDices * 5 * 0.12 + sbk * 0.33 + chgDices * 0.5 + chgDices * 2 * 0.16,
      0,
      chgDices * 0.0834
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
  return "btn-success-6";
}

function log() {
  var message = "<p>";
  for (i = 0; i < arguments.length; i++) {
    message += arguments[i] + " ";
  }
  $("#log").prepend(message + "</p>")
}

}