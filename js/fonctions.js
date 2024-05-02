/************************************************************************** */
/************************************************************************** */
/************************************************************************** */
/* Etapes à suivre */
/*   1) Dessin du plateau de jeu
     2) Initialisation du jeu : cases vides / Message c'est au joueur 1 de jouer (PAS DE saisie des noms des joueurs) 
             / opt : tirage aleatoire joueur qui commence / opt : choix signe O ou X
     3) Jeu : Si clic sur une case
                    Vérifier si la case est vide (ou empêcher de cliquer sur une case pleine) 
                    Si la case est vide 
                        mettre le pion du joueur 
                        Tester si le jeu est fini : soit les joueurs décident de la fin 
                           / opt soit on utilise une fonction qui teste si le joueur a gagné
                        Ajouter 1 au nombre nombre de coups joués
                        Si fin du jeu : 1 joueur a gagné ou 9 coups ont été joués 
                            Message Gagné ou égalité
                                  opt  : proposer de rejouer et compter les points
                        Sinon    
                            Changer le nom du joueur
                            Afficher nom du joueur qui doit jouer
                    
*/

/* Idées pour la mise en oeuvre : 
- avoir un tableau qui enregistre ce qui a été joué => soit 9 cases / soit 3*3 cases
    (construction : i ligne j colonne / i,j )
     où on aura 0 si case vide / 1 si joueur 1 a joué / 2 si joueur 2 a joué 
- avoir un tableau des éléments 'td' (une case cliquée dans ce tableau => mettre le numéro du joueur dans l'autre tableau)     
- repérer les joueurs par "1" et "2" pour échanger facilement + lire / remplir le tableau
- Victoire : 
   LIGNE :  pour i de 0 à 6; i+3 => si ((tabCoups[i] == tabCoups[i + 1]) && (tabCoups[i] == tabCoups[i + 2]))
   COLONNE : pour i de 0 à 2, i++ => si ((tabCoups[i] == tabCoups[i + 3]) && (tabCoups[i] == tabCoups[i + 6])) 
   DIAGONALE : si ((tabCoups[0] == tabCoups[4]) && (tabCoups[0] == tabCoups[8]))
            ou si ((tabCoups[2] == tabCoups[4]) && (tabCoups[2] == tabCoups[6]))

*/

/* Pistes pour simplifier : 
- plutôt 1 et -1 pour joueurs 1 et 2, du coup changeJouer(courant) {return courant*(-1);}  
- victoire si somme sur 1 ligne, 1 colonne, 1 diagonale = 3 (joueur1 gagne) ou -3 (joueur2 gagne)
- test si le joueur peut gagner : 2 ou -2 dans une configuration de gain 
*/

/*
Faire jouer l'ordinateur => 1) Tester si il peut gagner
                            2) Tester si l'autre joueur peut gagner et le bloquer
                            3) Stratégie pour placer le pion dans les cases qui restent
                                    a) centre
                                    b) coin
                                    c) 1ère case libre
*/

/************************************************************************** */
/************************************************************************** */
/************************************************************************** */


// récupérer les éléments de type TD dans un tableau qui permettra de surveiller les clics 
//   et d'afficher les pions 
let tableauTD = document.querySelectorAll('td');

document.getElementById("jeuA2").addEventListener('click', lanceJeuA2);
document.getElementById("ordi").addEventListener('click', lanceJeuOrdi);


//surveiller si une des cases = un des td de la table HTML est cliquée
//tableauTD.forEach(function (elemt, index) {
    //elemt.addEventListener("click", function () { jeuOrdi(elemt, index) })
    //elemt.addEventListener("click", function () { jeuEnCours(elemt, index) }) //MARCHE
    //elemt.addEventListener("click", function() {jeuEnCoursTest(elemt,index)}) //MARCHE
    //elemt.addEventListener ("click",function() {elemt.style.backgroundColor="red";}) //MARCHE
    //elemt.addEventListener ("click",function() {console.log(`clic sur case ${index}`)}) //MARCHE
//});

//initialiser le tableau des coups joués à 0 partout
//contient 0 si case table HTML vide / 1 ou 2 si le joueur 1 ou le joueur 2 a joué
let tabCoups = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//initialiser le joueur en cours
let joueurCourant = 1;

//initialiser le nombre de coups joués à 0
let nbCoups = 0;

//initialiser la variable "finDuJeu" à false
let finDuJeu = false;

//initialiser la variable jeuAvecOrdi
let jeuAvecOrdi = true;


/**************************************************************************/
function lanceJeuA2() {

    jeuAvecOrdi = false;

    initialiseJeu(); 

    tableauTD.forEach(function (elemt, index) {
        elemt.addEventListener("click", function () { jeuEnCours(elemt, index) })
    });   
}

/**************************************************************************/
function lanceJeuOrdi() {

    jeuAvecOrdi = true;

    initialiseJeu(); 

    tableauTD.forEach(function (elemt, index) {
        elemt.addEventListener("click", function () { jeuOrdi(elemt, index) }) 
    });   
}

/**************************************************************************/

function initialiseJeu() {
    // Role : efface les boutons de choix de jeu et affiche le tableau de jeu
    // Paramètres : aucun
    // Retour : aucun

    document.getElementById('choix').style.display="none";
    document.getElementById('grille').style.display="flex";
    document.getElementById('infos').style.display="block";

}

/************************************************************************** */

function jeuEnCoursTest(elemt, index) {
    // Role : gère le jeu à chaque fois qu'une case est cliquée 
    // Paramètres : elemt l'élément du DOM qui a été cliqué
    //              index , l'index de l'élément cliqué dans ta tableau des éléments  
    // Retour :  aucun

    elemt.style.backgroundColor = "red";
    console.log(`clic sur case ${index}`);

}

/************************************************************************** */

function jeuEnCours(elemt, index) {
    // Role : gère le jeu à chaque fois qu'une case est cliquée 
    // Paramètres : elemt l'élément du DOM qui a été cliqué
    //              index , l'index de l'élément cliqué dans ta tableau des éléments  
    // Retour :  aucun

    if (!finDuJeu) {
        //vérifier que la case cliquée = d'indice index est bien vide (vaut 0 dans tabCoups) 
        if (caseVide(index)) {
            //afficher le pion du joueur Courant dans la case
            affichePion(joueurCourant, elemt);

            //placer le numéro du joueur courant dans le tableau enregistrant les coups des joueurs
            enregistreCoups(index);
            tabCoups[index] = joueurCourant;

            //ajouter 1 au nombre de coups joués
            nbCoups++;

            //tester fin du jeu (v1 : tester juste si la grille est remplie (9 coups joués))
            //                  (v2 : test si un joueur a gagné ou si la grille est remplie) 
            finDuJeu = testFin2(nbCoups);

            //si ce n'est pas la fin : changer le joueur en cours
            if (!finDuJeu) {
                //changer le joueur courant
                joueurCourant = changeJoueur(joueurCourant);

                if (joueurCourant == 1) {
                    afficheMessage(`C'est le tour du Joueur 1`);
                } else {
                    afficheMessage(`C'est le tour du Joueur 2`);
                }

            } else {
                proposeNouvellePartie();
            }
        }
        //sinon il ne se passe rien (la case est occupée et ne peut être utilisée)
    }
}

/************************************************************************** */

function jeuOrdi(elemt, index) {
    // Role : gère le jeu à chaque fois qu'une case est cliquée 
    // Paramètres : aucun / variables globales pour l'instant
    // Retour : néant   

    // Joueur1 : joueur - joueur 2 : ordinateur

    if (!finDuJeu) {
        //vérifier que la case cliquée = d'indice index est bien vide (vaut 0 dans tabCoups) 
        if (caseVide(index)) {
            //afficher le pion du joueur 1
            affichePion(1, elemt);

            //placer 1 dans le tableau enregistrant les coups des joueurs
            enregistreCoups(index);
            tabCoups[index] = 1;

            //ajouter 1 au nombre de coups joués
            nbCoups++;

            //tester fin du jeu (v1 : tester juste si la grille est remplie (9 coups joués))
            //                  (v2 : test si un joueur a gagné ou si la grille est remplie) 
            finDuJeu = testFin2(nbCoups);

            //si ce n'est pas la fin : c'est au tour de l'ordinateur de jouer
            if (!finDuJeu) {
                afficheMessage(`C'est le tour de l'ordinateur`);

                //choix de la case à jouer
                index = choixCaseOrdi();

                //trouver l'élément correspondant à cet inde dans la table HTML
                elemt = tableauTD[index];

                //afficher le pion de l'ordinateur
                affichePion(2, elemt);

                //placer 2 dans le tableau enregistrant les coups des joueurs
                enregistreCoups(index);
                tabCoups[index] = 2;

                //ajouter 1 au nombre de coups joués
                nbCoups++;

                //tester fin du jeu (v1 : tester juste si la grille est remplie (9 coups joués))
                //                  (v2 : test si un joueur a gagné ou si la grille est remplie) 
                finDuJeu = testFin2(nbCoups);
            }
            if (!finDuJeu) {
                afficheMessage("C'est le tour du Joueur 1")
            } else {
                proposeNouvellePartie();
            }
        }
        //sinon il ne se passe rien (la case est occupée et ne peut être utilisée)
    } 
}


/************************************************************************** */
/* testee - ok */

function testFin1(nbCoups) {
    // Role : Renvoie vrai si nbCoups = 9
    // Paramètre : nbCoups le nombre à tester
    // Retour : booléan, true si nbCoups = 9 false sinon    

    //version 1 : stop si 9 coups joués
    if (nbCoups == 9) {
        //afficher que la partie est finie
        afficheMessage('La partie est finie, la grille est pleine');
        //retourner vrai
        return true;
    } else {
        //retourner faux
        return false;
    }
}

/************************************************************************** */
/* ok sur les cas testés */
// Mettre les cas testés ici
//
//
//

function testFin2(nbCoups) {
    // Role : teste si le jeu est fini, soit parce qu'un joueur a gagne, soit parce qu'on a joué 9 coups
    // Paramètres : nbCoups le nombre de pions placés dans la grille
    // Retour : true si fin de jeu / false sinon (on peut encore jouer)

    //Test si un joueur a aligné 3 pions sur une même ligne (attention au 0 !!!)
    for (let i = 0; i <= 6; i += 3) {
        if ((tabCoups[i] == tabCoups[i + 1]) && (tabCoups[i] == tabCoups[i + 2])) {
            //trouver quel joueur a gagné
            let numJoueur = tabCoups[i];

            //attention si 3 fois le chiffres 0, on n'est pas dans un cas gagnant
            if (numJoueur != 0) {
                //afficher le nom du joueur qui a gagné
                afficheGagnant(numJoueur);

                //renvoyer vrai (partie finie)
                return true;
            }
        }
    }

    //Test si un joueur a aligné 3 pions sur une même colonne 
    for (let i = 0; i <= 2; i++) {
        if ((tabCoups[i] == tabCoups[i + 3]) && (tabCoups[i] == tabCoups[i + 6])) {
            //trouver quel joueur a gagné
            let numJoueur = tabCoups[i];

            //attention si 3 fois le chiffres 0, on n'est pas dans un cas gagnant
            if (numJoueur != 0) {
                //afficher le nom du joueur qui a gagné
                afficheGagnant(numJoueur);

                //renvoyer vrai (partie finie)
                return true;
            }
        }
    }

    //Test si un joueur a aligné 3 pions sur une diagonale
    if ((tabCoups[0] == tabCoups[4]) && (tabCoups[0] == tabCoups[8])) {
        //trouver quel joueur a gagné
        let numJoueur = tabCoups[4];

        //attention si 3 fois le chiffres 0, on n'est pas dans un cas gagnant
        if (numJoueur != 0) {
            //afficher le nom du joueur qui a gagné
            afficheGagnant(numJoueur);

            //renvoyer vrai (partie finie)
            return true;
        }
    }

    if ((tabCoups[2] == tabCoups[4]) && (tabCoups[2] == tabCoups[6])) {
        //trouver quel joueur a gagné
        let numJoueur = tabCoups[4];

        //attention si 3 fois le chiffres 0, on n'est pas dans un cas gagnant
        if (numJoueur != 0) {
            //afficher le nom du joueur qui a gagné
            afficheGagnant(numJoueur);

            //renvoyer vrai (partie finie)
            return true;
        }
    }

    // si aucun joueur n'a gagné, on teste si on a rempli le tableau ou si on peut encore jouer
    if (nbCoups == 9) {
        afficheEgalite();
        return true;
    } else {
        return false;
    }

}

/**************************************************************************/

function choixCaseOrdi () {
    // Role : choisit la case où l'ordinateur va jouer
    // Paramètres : aucun
    // Retour : indice du coup à jouer 

    let indice = -1;

    //tester si l'ordinateur peut gagner
    indice = peutGagner(2);
    //si indice != -1 l'ordianteur peut ggner et doit jouer dans la case d'indice "indice"
    if (indice != -1) {
        return indice;
    }

    //tester si le joueur peut gagner (il faudra jouer la case indiquée pour bloquer le joueur)
    indice = peutGagner(1);
    //si indice != -1 le joueur peut gagner au tour suivant, il faut jouer dans la case d'indice "indice"
    if (indice != -1) {
        return indice;
    }

    //choisir une case
    return choixCaseVide();
}

/**************************************************************************/

function choixCaseVide() {
    // Role : choisit une case vide pour placer le pion de l'ordinateur
    // Paramètres : aucun
    // Retour : indice de la case choisie

    //si la case centrale est vide, choisir cette case
    if (tabCoups[4] == 0) {
        return 4;
    }    

    //sinon choisir un des coins
    if (tabCoups[0] == 0) {
        return 0;
    } else if (tabCoups[2] == 0) {
        return 2;
    } else if (tabCoups[6] == 0) {
        return 6;
    } else if (tabCoups[8] == 0) {
        return 8;
    }       

    //sinon remplir 1ère case vide du tableau
    for (let i=0 ; i<tabCoups.length ; i++ ) {
        if (tabCoups[i] == 0) {
            return i;
        }
    }
}

/**************************************************************************/

function peutGagner(joueur) {
    // Role : teste si le joueur donné en paramètre peut gagner
    // Paramètres : numéro du joueur 
    // Retour : indice du coup à jouer pour gagner = celui de la case où dessiner

    //Test si le joueur a aligné 2 pions sur une même ligne et que la 3ème case est vide
    for (let i = 0; i <= 6; i += 3) {

        let gagne = lignePeutGagner(i, joueur);
        //si le retour de la fonction est != -1 la ligne peut gagner, il faut jouer à l'indice gagne
        if (gagne != -1) {
            return gagne
        }
    }

    //Test si le joueur a aligné 2 pions sur une même colonne et que la 3ème case est vide
    for (let i = 0; i <= 2; i++) {

        let gagne = colonnePeutGagner(i, joueur);
        //si le retour de la fonction est != -1 la ligne peut gagner, il faut jouer à l'indice gagne
        if (gagne != -1) {
            return gagne
        }
    } 

    //Test si un joueur a aligné 2 pions sur une des diagonales avec la 3ème case vide
    let gagne = uneDesDiagonalesPeutGagner(joueur);
    
    //renvoyer gagne : vaut -1 si aucun test n'a permis de trouver une position gagnante
    //l'indice de la position où jouer sinon
    return gagne; 
}

/**************************************************************************/

function lignePeutGagner(i, joueur) {
    //Role : teste si une ligne contient 2 pions du joueur et 1 case vide
    //Paramètre : i indice démarrant la ligne 
    //retour : indice de la case vide si la ligne permet de gagner, -1 sinon

    //il faut enregistrer le nb de pions du joueur et le nombre de 0 sur une même ligne
    let nbPionJoueur = 0;
    let nbCaseVide = 0;
    //si on trouve une case vide, il faut enregistrer son indice pour le renvoyer si le joueur peut gagner
    let indiceCaseVide = -1;

    if (tabCoups[i] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i] == 0) {
        nbCaseVide++;
        indiceCaseVide = i;
    }
    if (tabCoups[i + 1] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i + 1] == 0) {
        nbCaseVide++;
        indiceCaseVide = i + 1;
    }
    if (tabCoups[i + 2] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i + 2] == 0) {
        nbCaseVide++;
        indiceCaseVide = i + 2;
    }

    if (nbPionJoueur == 2 && nbCaseVide == 1) {
        return indiceCaseVide;
    } else {
        return -1;
    }
}

/**************************************************************************/

function colonnePeutGagner(i, joueur) {
    //Role : teste si une colonne contient 2 pions du joueur et 1 case vide
    //Paramètre : i indice démarrant la colonne 
    //retour : indice de la case vide si la colonne permet de gagner, -1 sinon

    //il faut enregistrer le nb de pions du joueur et le nombre de 0 sur une même colonne
    let nbPionJoueur = 0;
    let nbCaseVide = 0;
    //si on trouve une case vide, il faut enregistrer son indice pour le renvoyer si le joueur peut gagner
    let indiceCaseVide = -1;

    if (tabCoups[i] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i] == 0) {
        nbCaseVide++;
        indiceCaseVide = i;
    }
    if (tabCoups[i + 3] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i + 3] == 0) {
        nbCaseVide++;
        indiceCaseVide = i + 3;
    }
    if (tabCoups[i + 6] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[i + 6] == 0) {
        nbCaseVide++;
        indiceCaseVide = i + 6;
    }

    if (nbPionJoueur == 2 && nbCaseVide == 1) {
        return indiceCaseVide;
    } else {
        return -1;
    }    
}

/**************************************************************************/

function uneDesDiagonalesPeutGagner(joueur) {
    //Role : teste si une diagonale contient 2 pions du joueur et 1 case vide
    //Paramètre : i indice démarrant la diagonale 
    //retour : indice de la case vide si la diagonale permet de gagner, -1 sinon

    //il faut enregistrer le nb de pions du joueur et le nombre de 0 sur une même diagonale
    let nbPionJoueur = 0;
    let nbCaseVide = 0;
    //si on trouve une case vide, il faut enregistrer son indice pour le renvoyer si le joueur peut gagner
    let indiceCaseVide = -1;

    //Première diagonale
    if (tabCoups[0] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[0] == 0) {
        nbCaseVide++;
        indiceCaseVide = 0;
    }
    if (tabCoups[4] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[4] == 0) {
        nbCaseVide++;
        indiceCaseVide = 4;
    }  
    if (tabCoups[8] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[8] == 0) {
        nbCaseVide++;
        indiceCaseVide = 8;
    }      

    if (nbPionJoueur == 2 && nbCaseVide == 1) {
        return indiceCaseVide;
    } 

    //Seconde diagonale
    //il faut enregistrer le nb de pions du joueur et le nombre de 0 sur une même diagonale
    nbPionJoueur = 0;
    nbCaseVide = 0;
    //si on trouve une case vide, il faut enregistrer son indice pour le renvoyer si le joueur peut gagner
    indiceCaseVide = -1;

    if (tabCoups[2] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[2] == 0) {
        nbCaseVide++;
        indiceCaseVide = 2;
    }
    if (tabCoups[4] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[4] == 0) {
        nbCaseVide++;
        indiceCaseVide = 4;
    }  
    if (tabCoups[6] == joueur) {
        nbPionJoueur++;
    } else if (tabCoups[6] == 0) {
        nbCaseVide++;
        indiceCaseVide = 6;
    }      

    if (nbPionJoueur == 2 && nbCaseVide == 1) {
        return indiceCaseVide;
    } else {
        return -1;
    }
}

/************************************************************************** */
/* testee - ok */

function changeJoueur(joueurCourant) {
    // Role : Si joueurCourant est 1 renvoie 2, sinon renvoie 1
    // Paramètres : joueurCourant un nombre (1 ou 2)
    // Retour : 1 si joueurCourant est 2, 2 si joueurCourant est 1

    if (joueurCourant == 1) {
        return 2;
    } else {
        return 1;
    }
}

/************************************************************************** */

function caseVide(index) {
    // Role : teste si la case d'indice index est vide
    // Paramètres : index, l'indice de la case à tester dans tabCoups
    // Retour : néant

    if (tabCoups[index] == 0) {
        return true;
    } else {
        return false;
    }
}

/************************************************************************** */
/* testee - ok */

function affichePion(joueurCourant, elemt) {
    // Role : affiche le pion du jouerCourant dans la case elemt
    // Paramètres : joueurCourant le numéro du jouer en train de jouer
    //              elemt l'élément HTML où on doit afficher le pion 
    // Retour : néant

    //ajoute le style corr"espondant au joueur à la case avec une classe
    elemt.classList.add(`joueur${joueurCourant}`);

    if (joueurCourant == 1) {
        elemt.innerHTML = "X";
    } else {
        elemt.innerHTML = "0";
    }
}

/************************************************************************** */
function enregistreCoups(index) {
    // Role : enregistre le numéro du joueur courant dans le tableau des coups à la case d'index "index"
    // Paramètres : index, l'index de la case du tableau contenant les td de l'élément qui a été cliquée
    // Retour : néant

    tabCoups[index] = joueurCourant;
}
/************************************************************************** */
/* testee - ok */

function afficheMessage(message) {
    // Role : affiche le message passé en paramètre sous la grille de jeu
    // Paramètres : message la chaine à afficher
    // Retour : néant

    document.getElementById('infos').textContent = message;
}

/************************************************************************** */
/* testee - ok */

function afficheGagnant(numJoueur) {
    // Role : affiche le nom du joueur qui a gagné
    // Paramètres : numéro du joueur
    // Retour : néant

    //appliquer la classe gagne au p infos
    document.getElementById('infos').classList.add("message-gagne");

    if (numJoueur == 2 && jeuAvecOrdi == true) {
        afficheMessage(`L'ordinateur a gagné !`);
    } else {
        afficheMessage(`Le Joueur${numJoueur} a gagné !`);
    }
}

/************************************************************************** */

function afficheEgalite() {
    // Role : affiche un message de fin de jeu si personne n'a gagné
    // Paramètres : néant 
    // Retour : néant 

    //appliquer la classe gagne au p infos
    document.getElementById('infos').classList.add("message-gagne");

    // afficher le message
    afficheMessage(`Le jeu est fini, il n'y a pas de gagnant`);
}



/************************************************************************** */

function proposeNouvellePartie() {
    // Role : au cas où on veuille rejouer, effacer les données du jeu précédent
    // Paramètre : Aucun
    // Retour : Aucun  

    // affiche un bouton pour lancer une nouvelle partie
    document.getElementById('rejouer').innerHTML = ("<button id='nouveauJeu'>Rejouer</button>");
    document.getElementById('nouveauJeu').addEventListener("click", nouvellePartie);
}

/************************************************************************** */

function nouvellePartie() {
    // Role : au cas où on veuille rejouer, effacer les données du jeu précédent
    // Paramètre : Aucun
    // Retour : Aucun  

    //initialiser le tableau des coups joués à 0 partout
    //contient 0 si case table HTML vide / 1 ou 2 si le joueur 1 ou le joueur 2 a joué
    tabCoups = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    //initialiser le joueur en cours
    joueurCourant = 1;

    //initialiser le nombre de coups joués à 0
    nbCoups = 0;

    //initialiser la variable "finDuJeu" à false
    finDuJeu = false;

    //effacer la grille HTML
    effacerGrille();

    //effacer le bouton rejouer
    document.getElementById('nouveauJeu').removeEventListener("click", nouvellePartie);
    document.getElementById('rejouer').innerHTML = ("");

    //retire la classe gagne au p infos
    document.getElementById('infos').classList.remove("message-gagne");  

    //afficher qui doit jouer
    afficheMessage("C'est le tour du Joueur 1");
}

/************************************************************************** */

function effacerGrille() {
    for (let i = 0; i < tableauTD.length; i++) {
        tableauTD[i].innerHTML = "";
        tableauTD[i].classList.remove(`joueur1`);
        tableauTD[i].classList.remove(`joueur2`);
    }
}