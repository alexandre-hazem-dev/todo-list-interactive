let inputTache = document.getElementById("inputTache");
let boutonAjouter = document.getElementById("boutonAjouter");
let message = document.getElementById("message");
let listeTaches = document.getElementById("listeTaches");
let boutonToutEffacer = document.getElementById("boutonToutEffacer");
let statistiques = document.getElementById("statistiques");
let filtreToutes = document.getElementById("filtreToutes");
let filtreNonRealisees = document.getElementById("filtreNonRealisees");
let filtreEnCours = document.getElementById("filtreEnCours");
let filtreTerminees = document.getElementById("filtreTerminees");
let filtreActuel = "toutes";

let taches = JSON.parse(localStorage.getItem("taches")) || [];

function sauvegarderTaches() {
    localStorage.setItem("taches", JSON.stringify(taches));
}

function afficherStatistiques() {
    let total = taches.length;

    let nonRealisees = taches.filter(function(tache) {
        return tache.statut === "non-realisee";
    }).length;

    let enCours = taches.filter(function(tache) {
        return tache.statut === "en-cours";
    }).length;

    let terminees = taches.filter(function(tache) {
        return tache.statut === "terminee";
    }).length;

    statistiques.textContent =
        "Total : " + total +
        " | Non réalisées : " + nonRealisees +
        " | En cours : " + enCours +
        " | Terminées : " + terminees;
}

function afficherTaches() {
    listeTaches.textContent = "";

    let nombreTachesAffichees = 0;

    taches.forEach(function(tache, index) {

        if (filtreActuel !== "toutes" && tache.statut !== filtreActuel) {
            return;
        }

        nombreTachesAffichees++;

        let zoneTache = document.createElement("div");
        zoneTache.classList.add("tache");
        zoneTache.classList.add(tache.statut);

        let texte = document.createElement("span");
        texte.classList.add("texte-tache");
        texte.textContent = tache.texte;

        let boutonNonRealisee = document.createElement("button");
        boutonNonRealisee.textContent = "Non réalisée";

        boutonNonRealisee.addEventListener("click", function() {
            taches[index].statut = "non-realisee";
            sauvegarderTaches();
            afficherTaches();
        });

        let boutonEnCours = document.createElement("button");
        boutonEnCours.textContent = "En cours";

        boutonEnCours.addEventListener("click", function() {
            taches[index].statut = "en-cours";
            sauvegarderTaches();
            afficherTaches();
        });

        let boutonTerminee = document.createElement("button");
        boutonTerminee.textContent = "Terminée";

        boutonTerminee.addEventListener("click", function() {
            taches[index].statut = "terminee";
            sauvegarderTaches();
            afficherTaches();
        });

        let boutonModifier = document.createElement("button");
        boutonModifier.textContent = "Modifier";

        boutonModifier.addEventListener("click", function() {

            let nouveauTexte = prompt("Nouveau texte :", tache.texte);

            if (nouveauTexte === null) {
                return;
            }

            if (nouveauTexte.trim() === "") {
                return;
            }

            taches[index].texte = nouveauTexte.trim();

            sauvegarderTaches();

            afficherTaches();
        });

        let boutonSupprimer = document.createElement("button");
        boutonSupprimer.textContent = "Supprimer";

        boutonSupprimer.addEventListener("click", function() {
            taches.splice(index, 1);
            sauvegarderTaches();
            afficherTaches();
        });

        zoneTache.appendChild(texte);
        zoneTache.appendChild(boutonNonRealisee);
        zoneTache.appendChild(boutonEnCours);
        zoneTache.appendChild(boutonTerminee);
        zoneTache.appendChild(boutonModifier);
        zoneTache.appendChild(boutonSupprimer);

        listeTaches.appendChild(zoneTache);
    });

    if (nombreTachesAffichees === 0) {
        let messageVide = document.createElement("p");
        messageVide.classList.add("message-vide");

        if (taches.length === 0) {
            messageVide.textContent = "Aucune tâche pour le moment.";
        } else {
            messageVide.textContent = "Aucune tâche dans ce filtre.";
        }

        listeTaches.appendChild(messageVide);
    }

    afficherStatistiques();
}

boutonAjouter.addEventListener("click", function() {

    if (inputTache.value.trim() === "") {
        message.textContent = "Merci d'écrire une tâche.";
        message.classList.remove("succes");
        message.classList.add("erreur");
        return;
    }

    let nouvelleTache = {
        texte: inputTache.value.trim(),
        statut: "non-realisee"
    };

    taches.push(nouvelleTache);

    sauvegarderTaches();

    afficherTaches();

    message.textContent = "Tâche ajoutée avec succès.";
    message.classList.remove("erreur");
    message.classList.add("succes");

    inputTache.value = "";
});

inputTache.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        boutonAjouter.click();
    }

});

afficherTaches();

boutonToutEffacer.addEventListener("click", function() {

    let confirmation = confirm("Voulez-vous vraiment supprimer toutes les tâches ?");

    if (confirmation === false) {
        return;
    }

    taches = [];

    sauvegarderTaches();

    afficherTaches();

    message.textContent = "Toutes les tâches ont été supprimées.";
    message.classList.remove("erreur");
    message.classList.add("succes");

});

filtreToutes.addEventListener("click", function() {
    filtreActuel = "toutes";
    afficherTaches();
});

filtreNonRealisees.addEventListener("click", function() {
    filtreActuel = "non-realisee";
    afficherTaches();
});

filtreEnCours.addEventListener("click", function() {
    filtreActuel = "en-cours";
    afficherTaches();
});

filtreTerminees.addEventListener("click", function() {
    filtreActuel = "terminee";
    afficherTaches();
});