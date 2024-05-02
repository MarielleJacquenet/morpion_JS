<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Morpion v1</title>
    <link rel="stylesheet" href="css/styles.css">
</head>

<body class="text-center">
    <h1>Morpion</h1>
    <div id="choix">
        <button id="jeuA2">Jeu à 2</button>
        <button id="ordi">Jouer contre l'ordinateur</button>
    </div>
    <div id="grille" class="flex align-center justify-center">
        <div>
            <p class="joueur1">Joueur 1 : signe X</p>
        </div>
        <table>
            <!-- emmet : (tr>td*3)*3 -->
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        <div>
            <p class="joueur2">Joueur 2 : signe 0</p>
        </div>
    </div>
    <div id='infos'>
        <!-- Bloc destiné à l'affichage des messages : joueur qui doit jouer / joueur qui a gagné / fin du jeu -->
        C'est le tour du Joueur 1
    </div>
    <div id='rejouer'>
    </div>
    <script src="js/fonctions.js" defer></script>
</body>

</html>