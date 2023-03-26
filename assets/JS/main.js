
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

function segText() {
	let texte = document.getElementById("fileDisplayArea").textContent;
	let delim = document.getElementById("delimID").value;
	let speCar = /[\[\]\-\^\(\)\|\\\.\$\?\*\+\{\}\>\<]/g;
	let delimEsc = delim.replace(speCar, '\\$&');
	let regex = new RegExp("[" + delimEsc + "]", "g");
	let segments = texte.split(regex);
	let result = segments.join(" ");
	document.getElementById("page-analysis").innerHTML = result;
}
