function exercice1() {
let desserts = ["Tarte", "Croissant", "Brioche", "Cookie"];
	let suppr_last = desserts.pop();
	let add_first = desserts.unshift(suppr_last);	
	document.getElementById("exercice1Resultat").innerHTML = desserts;
}


function exercice2() {
	let text = document.getElementById("texteExercice2").value;
    text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
    let mots = text.split(" ");
   for (let i = 0; i < mots.length; i++) {
    	mots[i] = mots[i].toUpperCase();
  	}
 	let maj = mots.join(" ");
 	document.getElementById("exercice2Resultat").innerHTML = maj;
}


function exercice3() {
	let text = document.getElementById("texteExercice3").value;
	text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
	let mots = text.split(" ");
	let motsFiltre = mots.filter(mot => mot.length > 3);
	let result = motsFiltre.join(" ");
	document.getElementById("exercice3Resultat").innerHTML = result;
}


function exercice4() {
	let text = document.getElementById("texteExercice4").value;
	text = text.replace(/[.,\"]/g,"");
    text = text.replace(/\'/g," ");
	let mots = text.split(" ");
	const tableau = [];
	mots.forEach(function(mot) {
		tableau.push(mot);
});
	document.getElementById("exercice4Resultat").innerHTML = tableau;
}
