
function date_heure() {
	let now = new Date();
	let annee = now.getFullYear();
	let mois = ('0'+now.getMonth()+1).slice(-2);
	let jour = ('0'+now.getDate()).slice(-2);
	let heure = ('0'+now.getHours()).slice(-2);
	let minute = ('0'+now.getMinutes()).slice(-2);
	let seconde = ('0'+now.getSeconds()).slice(-2);
 	document.getElementById("holder1").innerHTML = "Nous sommes le "+jour+"/"+mois+"/"+annee+" et il est "+heure+"h "+minute+"min "+seconde+"s.";
 	document.getElementById("btn2").style.display= "inline";
 }

function maj() {
	let text = document.getElementById("holder1").innerHTML;
	document.getElementById("holder1").innerHTML = text.toUpperCase();
}

// Analyse des données dans un fichier

window.onload = function() {
    let fileInput = document.getElementById('fileInput');
    let fileDisplayArea = document.getElementById('fileDisplayArea');
	//let fileLoaded = false; // variable qui indique si un fichier a été chargé
	
    // On "écoute" si le fichier donné a été modifié.
    // Si on a donné un nouveau fichier, on essaie de le lire.
    fileInput.addEventListener('change', function(e) {
        // Dans le HTML (ligne 22), fileInput est un élément de tag "input" avec un attribut type="file".
        // On peut récupérer les fichiers données avec le champs ".files" au niveau du javascript.
        // On peut potentiellement donner plusieurs fichiers,
        // mais ici on n'en lit qu'un seul, le premier, donc indice 0.
        let file = fileInput.files[0];
        // on utilise cette expression régulière pour vérifier qu'on a bien un fichier texte.
        let textType = new RegExp("text.*");

        if (file.type.match(textType)) { // on vérifie qu'on a bien un fichier texte
            // lecture du fichier. D'abord, on crée un objet qui sait lire un fichier.
            var reader = new FileReader();

            // on dit au lecteur de fichier de placer le résultat de la lecture
            // dans la zone d'affichage du texte.
            reader.onload = function(e) {
                fileDisplayArea.innerText = reader.result;
				segText();
                let nbTokens = global_var_tokens.length;
				let nbLines = global_var_lines.length;
                document.getElementById("logger2").innerHTML = '<span class="infolog">Nombre de tokens : ' + nbTokens +  '<br>Nombre de lignes : ' + nbLines +' </span>';
				//let fileLoaded = true; // fichier chargé
			}

            // on lit concrètement le fichier.
            // Cette lecture lancera automatiquement la fonction "onload" juste au-dessus.
            reader.readAsText(file);    

            document.getElementById("logger").innerHTML = '<span class="infolog">Fichier chargé avec succès</span>';
        } else { // pas un fichier texte : message d'erreur.
            fileDisplayArea.innerText = "";
            document.getElementById("logger").innerHTML = '<span class="errorlog">Type de fichier non supporté !</span>';
        }
    });
}

function showHide_aide() {
	let div = document.getElementById("aide");
	let b = document.getElementById("button_aide").innerHTML; 
  		if (div.style.display === "none") {
   			div.style.display = "block";
	  		let change = b.replace("Afficher","Masquer");
	  		document.getElementById("button_aide").innerHTML = change;
	  		} 	
		else {
			div.style.display = "none";
			var change = b.replace("Masquer","Afficher");
	    	document.getElementById("button_aide").innerHTML = change;
	    	}
}

// VERSION PROF segText() ------------------------------------------------------------------------

function segText() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        //alert("Il faut d'abord charger un fichier .txt !"); //autre possibilité
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML="";
        let text = document.getElementById("fileDisplayArea").innerText;
        let delim = document.getElementById("delimID").value;
        let display = document.getElementById("page-analysis");
    
        let regex_delim = new RegExp(
            "["
            + delim
                .replace("-", "\\-") // le tiret n'est pas à la fin : il faut l'échapper, sinon erreur sur l'expression régulière
                .replace("[", "\\[").replace("]", "\\]") // à changer sinon regex fautive, exemple : [()[]{}] doit être [()\[\]{}], on doit "échapper" les crochets, sinon on a un symbole ] qui arrive trop tôt.
            + "\\s" // on ajoute tous les symboles d'espacement (retour à la ligne, etc)
            + "]+" // on ajoute le + au cas où plusieurs délimiteurs sont présents : évite les tokens vides
        );
    
        let tokens = text.split(regex_delim);
        tokens = tokens.filter(x => x.trim() != ""); // on s'assure de ne garder que des tokens "non vides"
        let lines = text.split(/\r?\n/g);
        lines = lines.filter(line => line.trim() != "");
    
        global_var_tokens = tokens; // décommenter pour vérifier l'état des tokens dans la console développeurs sur le navigateur
        global_var_lines = lines;
        display.innerHTML = tokens.join(" ");
    }
}

//----------------------------------------------------------------------------

/*
//MA VERSION segText() --------------------------------------------
//qui fonctionne correctement après avoir changé .innerHTML et .textContent pour .innerText
function segText() {
	let texte = document.getElementById("fileDisplayArea").innerText; // ou textContent pour retirer les balises inutiles mais dans ce cas pb avec retours chariot qui ne sont pas remplacés par des espaces // même pb avec innerHTML
	let delim = document.getElementById("delimID").value;
	let speCar = /[\[\]\-\^\(\)\|\\\.\$\?\*\+\{\}\>\<]/g;
	let delimEsc = delim.replace(speCar, '\\$&');
	let regex = new RegExp("[" + delimEsc + "\\s" + "]", "g");
	let segments = texte.split(regex);
	tokens = segments.filter(x => x.trim() != "");
	global_var_tokens = tokens;
	let result = tokens.join(" ");
	document.getElementById("page-analysis").innerHTML = result;
}
*/

/*Ma version 2 segText()
function segText() {
	let texte = document.getElementById("fileDisplayArea").innerText;
	let delim = document.getElementById("delimID").value;
	let speCar = /[\[\]\-\^\(\)\|\\\.\$\?\*\+\{\}\>\<]/g;
	let delimEsc = delim.replace(speCar, '\\$&');
	let regex = new RegExp("[" + delimEsc + "]", "g");
	let segments = texte.split(regex);
	let result = segments.join(" ");
	document.getElementById("page-analysis").innerHTML = result.replace(/(?:\r\n|\r|\n)/gm, " ");
}

// A RETENIR : différences .innerHTML  .textContent  .innerText
//.innerHTML permet de récupérer ou définir le contenu HTML d'un élément, y compris les balises HTML.
//.textContent permet de récupérer ou définir le contenu textuel d'un élément, en ignorant les balises HTML. Supprime les espaces supplémentaires et les retours chariot.
//.innerText est similaire à .textContent, mais tient compte de la mise en forme CSS appliquée à l'élément, ce qui peut parfois affecter le texte affiché. Inclue des espaces et des retours chariot supplémentaires.
-----------------------------------------------------------------*/

function dictionnaire() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        //alert("Il faut d'abord charger un fichier .txt !");
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
    } else {
        document.getElementById('logger3').innerHTML="";
        let tokenFreq = {};
        let tokens = global_var_tokens;
          
        // Compter la fréquence de chaque token
        tokens.forEach(token => tokenFreq[token] = (tokenFreq[token] || 0) + 1);
          
        // Convertir l'objet en tableau de paires clé-valeur
        let freqPairs = Object.entries(tokenFreq);
          
        // Trier le tableau par fréquence décroissante
        freqPairs.sort((a, b) => b[1] - a[1]);
          
        // Ajouter l'entête du tableau
        let tableArr = [['<b>Token</b>', '<b>Fréquence</b>']];
          
        // Créer un tableau de tableaux contenant les tokens et leurs fréquences
        let tableData = freqPairs.map(pair => [pair[0], pair[1]]);
          
        // Concaténer les deux tableaux
        let finalTable = tableArr.concat(tableData);
          
        // Créer le tableau HTML à partir du tableau final
        let tableHtml = finalTable.map(row => '<tr><td>' + row.join('</td><td>') + '</td></tr>').join('');
          
        // Afficher le tableau HTML dans la page
        document.getElementById('page-analysis').innerHTML = '<table>' + tableHtml + '</table>';
    }
}

//GREP---------------------------------------------------------------------

function grep(){
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        //alert("Il faut d'abord charger un fichier .txt !");
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
    } else {
        if (document.getElementById('poleID').value==""){
        //alert("Il faut d'abord entrer un pôle !");
        document.getElementById('logger3').innerHTML="Il faut d'abord entrer un pôle !";
        } else {
            document.getElementById('logger3').innerHTML="";
            // Récupération de la valeur du pole
            let poleInput = document.getElementById('poleID').value;
            // Création d'une regex à partir de la valeur récupérée
            let poleRegex = new RegExp(poleInput, 'g');
            // Initialisation de la variable "resultat" à une chaîne vide
            let resultat = "";
            // Parcours de chaque ligne du tableau "global_var_lines", avec un compteur "compteur" initialisé à 0
            for (let nblines = 0, compteur = 0; nblines < global_var_lines.length; nblines++) {
                // Si la ligne en question correspond à la regex, procéder au traitement suivant
                if (global_var_lines[nblines].match(poleRegex)) {
                    // Incrémentation du compteur
                    compteur++;
                    // Ajout d'une nouvelle ligne dans le tableau "resultat", contenant le numéro de l'occurrence et son contexte
                    resultat += "<tr><td>" + compteur + "</td><td>" + global_var_lines[nblines].replace(poleRegex, "<font color='red'>$&</font>") + "</td></tr>";
                }
            }
            // Injection du contenu de "resultat" dans l'élément HTML "page-analysis", entouré d'un tableau HTML
            document.getElementById('page-analysis').innerHTML = "<table>" + resultat + "</table>";
        }
    }
}

//Concordancier---------------------------------------------------------------------------
function concord() {
    if (document.getElementById('fileDisplayArea').innerHTML == "") {
        document.getElementById('logger3').innerHTML = "Il faut d'abord charger un fichier .txt !";
        } else {
            document.getElementById('logger3').innerHTML="";
            let poleInput = document.getElementById('poleID').value;
            if (poleInput == "") {
                document.getElementById('logger3').innerHTML = "Il faut d'abord entrer un pôle !";
                } else {
                    document.getElementById('logger3').innerHTML="";
                    let lgInput = document.getElementById('lgID').value;
                    // Vérifier si une longueur a été saisi, et si > 0
                    if (lgInput == "" || lgInput < 1) {
                    // Afficher un message d'erreur
                        document.getElementById('logger3').innerHTML = "Il faut d'abord entrer une longueur > 0 !";
                        } else {
                            // Récupérer le pôle et le convertir en regex
						  	let poleRegex = new RegExp(document.getElementById("poleID").value, "gi"); // le "i" indique de ne pas prendre en compte la casse
						  	//Récupérer la valeur de "lgInput" (longueur de contexte) et conversion en nombre entier
						  	let long = parseInt(document.getElementById("lgID").value);
						
						  	// Chercher le mot et créer une liste de concordance avec la méthode Array.prototype.reduce()
						  	// On applique .reduce sur global_var_tokens. Le callback prend en paramètres acc : accumulateur initialisé à 0 ;  token : valeur courante ; i : index de la valeur courante
						  	let concordance = global_var_tokens.reduce((acc, token, i) => {
						  		// A chaque itération du callback on teste si le "poleRegex" correspond au token courant
						    	if (poleRegex.test(token)) {
						    		// Si oui, création du contexte gauche (cLeft) et droit (cRight)
						      		const cLeft = global_var_tokens.slice(Math.max(0, i - long), i).join(" "); // Ex : si long=10, on sélectionne les tokens de index du token courant -10 à index du token courant, càd les 10 tokens précédant le token courant. Mais si (i - 10) < 0, alors on reprend au début du texte. Math.max(0, i - long) renvoie le maximum entre deux nombres : 0 et (i - long)
						      		const cRight = global_var_tokens.slice(i + 1, Math.min(global_var_tokens.length, i + long + 1)).join(" "); // De la même manière : puisque i est l'index token courant et qu'on veut sélectionner les 10 tokens suivants, on reprend à partir de (i + 1) jusqu'à (i + long(ici 10) + 1) ou bien jusqu'à la fin du texte si (i + long + 1)>global_var_tokens.length.
						      		acc.push([cLeft, token, cRight]); // Ajout de (contexte gauche, pôle, contexte droit) à la liste acc
						   	 		}
						    		return acc;
						    		}, []); // [] correspondent à l'accumulateur initialisé, à chaque fois que la fonction callback trouve que "poleRegex" correspond au token courant, elle ajoute une nouvelle entrée dans le tableau
						
								  // Afficher les résultat dans une table HTML
								  let table = document.createElement("table");
								  table.innerHTML = "<thead><tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr></thead>";
								  concordance.forEach(([cLeft, pole, cRight]) => { // Itération sur chaque élément de "concordance" pour remplir la table
								  	// Insertion d'une nouvelle ligne dans la table
								  	let row = table.insertRow();
								  	// Ajouter les données à la ligne
								    row.innerHTML = "<td>" + cLeft + "</td><td>" + pole + "</td><td>" + cRight + "</td>";
								    });
								    
                             		// Vérifier si des résultats ont été trouvés
                               		if (table.innerHTML == "<thead><tr><th>Contexte gauche</th><th>Pôle</th><th>Contexte droit</th></tr></thead>") {
	                                    // Effacer les résulats précédent
	                                    document.getElementById('page-analysis').innerHTML = "";
	                                    // Afficher un message d'erreur
	                                    document.getElementById('logger3').innerHTML = "Aucune correspondance trouvée.";
                                    	} else {
                                    		// Effacer tout message d'erreur précédent
                                          	document.getElementById('logger3').innerHTML = "";
                                           	// Injecter le tableau résultant dans l'élément HTML
                                          	document.getElementById("page-analysis").innerHTML = "";
                                          	document.getElementById("page-analysis").appendChild(table);
                                          	}
                                    }
                        }
            }
}


//Nombre de phrases-----------------------------------------
function nbPhrases() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
        } else {
            document.getElementById('logger3').innerHTML="";
            let text = document.getElementById("fileDisplayArea").innerText;
            let phrase= /[.!?]/g;
            let nbPhrases = text.split(phrase);
            let resultat = nbPhrases.length-1;
            document.getElementById('page-analysis').innerHTML = '<div>Il y a ' + resultat + ' phrases dans ce texte.</div>';
            }
}

//Mots les plus longs----------------------------------------------
function tokenLong() {
     if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
        } else {
            document.getElementById('logger3').innerHTML="";
            // Trier le tableau 'global_var_tokens' par ordre décroissant de longueur et garder les 10 premiers éléments
            let tokenSort = global_var_tokens.sort((a, b) => b.length - a.length).slice(0, 10);
            // Convertir chaque token en une ligne de tableau HTML avec sa longueur
            let map = tokenSort.map(token => '<tr><td>' + token + '</td><td>' + token.length + '</td></tr>').join('');
            //Tableau HTML
            let resultat = '<table><tr><th colspan=2><b>Mots les Plus Longs</b></th></tr><tr><th><b>Mot</b></th><th><b>Longueur</b></th></tr>' + map + '</table>';
            // Injecter le tableau dans l'élément HTML
            document.getElementById('page-analysis').innerHTML = resultat;
            }
}

//Top10 tokens les plus fréquents-----------------------------------
function top10freq() {
    if (document.getElementById('fileDisplayArea').innerHTML==""){
        document.getElementById('logger3').innerHTML="Il faut d'abord charger un fichier .txt !";
        } else {
            document.getElementById('logger3').innerHTML="";
            // Compter le nombre d'occurrences de chaque token dans le tableau 'global_var_tokens'
            let count = {};
            global_var_tokens.forEach(token => {
                count[token] = (count[token] || 0) + 1;
                });
            // Trier les tokens par ordre décroissant de fréquence et garder les 10 premiers éléments
            let top10 = Object.keys(count).sort((a, b) => count[b] - count[a]).slice(0, 10);
            // Convertir chaque token en une ligne de tableau HTML avec sa fréquence
            map = top10.map(token => '<tr><td>' + token + '</td><td>' + count[token] + '</td></tr>').join('')
            // Tableau HTML
            let resultat = '<table><tr><th colspan=2><b>Top 10 des mots les plus fréquents</b></th></tr><tr><th><b>Token</b></th><th><b>Fréquence</b></th></tr>' + map + '</table>';
            // Injecter le tableau dans l'élément HTML
            document.getElementById('page-analysis').innerHTML = resultat;
            }
}


