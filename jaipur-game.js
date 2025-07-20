// Jaipur Game Logic
// This file contains the core game logic for the Jaipur card game

// Constantes du jeu
const TYPES_MARCHANDISES = {
    diamant: { nom: "Diamant", classe: "diamant", min_vente: 2 },
    or: { nom: "Or", classe: "or", min_vente: 2 },
    argent: { nom: "Argent", classe: "argent", min_vente: 2 },
    tissu: { nom: "Tissu", classe: "tissu", min_vente: 1 },
    epice: { nom: "Épice", classe: "epice", min_vente: 1 },
    cuir: { nom: "Cuir", classe: "cuir", min_vente: 1 },
    chameau: { nom: "Chameau", classe: "chameau", min_vente: 0 }
};

// Valeurs des jetons pour chaque type de marchandise
const VALEURS_JETONS = {
    diamant: [7, 7, 5, 5, 5],
    or: [6, 6, 5, 5, 5],
    argent: [5, 5, 5, 5, 5],
    tissu: [5, 3, 3, 2, 2, 1, 1],
    epice: [5, 3, 3, 2, 2, 1, 1],
    cuir: [4, 3, 2, 1, 1, 1, 1, 1, 1]
};

// Valeurs des jetons bonus
const BONUS_JETONS = {
    3: [3, 3, 2, 2, 1, 1],
    4: [6, 6, 5, 5, 4, 4],
    5: [10, 10, 9, 9, 8, 8]
};

// État du jeu
let etatJeu = {
    pioche: [],
    marche: [],
    joueurs: [
        { main: [], chameaux: [], jetons: [], score: 0, sceaux: 0 },
        { main: [], chameaux: [], jetons: [], score: 0, sceaux: 0 }
    ],
    jetons: {
        diamant: [],
        or: [],
        argent: [],
        tissu: [],
        epice: [],
        cuir: [],
        bonus3: [],
        bonus4: [],
        bonus5: []
    },
    joueurActif: 1,
    mancheActuelle: 1,
    typeMarchandiseAVendre: null,
    quantiteAVendre: 0,
    cartesJoueurPourEchange: [],
    cartesMarchePourEchange: [],
    chameauxPourEchange: 0,
    aiMode: [false, false], // AI mode for each player (index 0 = player 1, index 1 = player 2)
    dernierEchangeAI: [null, null] // Dernier échange effectué par chaque IA (index 0 = player 1, index 1 = player 2)
};

// Initialiser le jeu
function initialiserJeu() {
    // Réinitialiser l'état du jeu
    etatJeu = {
        pioche: [],
        marche: [],
        joueurs: [
            { main: [], chameaux: [], jetons: [], score: 0, sceaux: 0 },
            { main: [], chameaux: [], jetons: [], score: 0, sceaux: 0 }
        ],
        jetons: {
            diamant: [],
            or: [],
            argent: [],
            tissu: [],
            epice: [],
            cuir: [],
            bonus3: [],
            bonus4: [],
            bonus5: []
        },
        joueurActif: 1,
        mancheActuelle: 1,
        typeMarchandiseAVendre: null,
        quantiteAVendre: 0,
        cartesJoueurPourEchange: [],
        cartesMarchePourEchange: [],
        chameauxPourEchange: 0,
        aiMode: [false, false], // Preserve AI mode settings when initializing
        dernierEchangeAI: [null, null] // Réinitialiser le dernier échange de chaque IA
    };

    // Initialiser la pioche
    initialiserPioche();

    // Initialiser les jetons
    initialiserJetons();

    // Distribuer les cartes
    distribuerCartes();

    // Vérifier si le joueur actif est en mode AI et le faire jouer si nécessaire
    checkAndPlayAI();

    return etatJeu;
}

// Initialiser la pioche
function initialiserPioche() {
    etatJeu.pioche = [];

    // Ajouter les cartes de marchandises
    etatJeu.pioche.push({ type: "diamant" }, { type: "diamant" }, { type: "diamant" }, { type: "diamant" }, { type: "diamant" }, { type: "diamant" });
    etatJeu.pioche.push({ type: "or" }, { type: "or" }, { type: "or" }, { type: "or" }, { type: "or" }, { type: "or" });
    etatJeu.pioche.push({ type: "argent" }, { type: "argent" }, { type: "argent" }, { type: "argent" }, { type: "argent" }, { type: "argent" });
    etatJeu.pioche.push({ type: "tissu" }, { type: "tissu" }, { type: "tissu" }, { type: "tissu" }, { type: "tissu" }, { type: "tissu" }, { type: "tissu" }, { type: "tissu" });
    etatJeu.pioche.push({ type: "epice" }, { type: "epice" }, { type: "epice" }, { type: "epice" }, { type: "epice" }, { type: "epice" }, { type: "epice" }, { type: "epice" });
    etatJeu.pioche.push({ type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" }, { type: "cuir" });

    // Ajouter les chameaux
    etatJeu.pioche.push({ type: "chameau" }, { type: "chameau" }, { type: "chameau" }, { type: "chameau" }, { type: "chameau" }, { type: "chameau" }, { type: "chameau" }, { type: "chameau" });

    // Mélanger la pioche
    melangerPioche();
}

// Mélanger la pioche
function melangerPioche() {
    for (let i = etatJeu.pioche.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [etatJeu.pioche[i], etatJeu.pioche[j]] = [etatJeu.pioche[j], etatJeu.pioche[i]];
    }
}

// Initialiser les jetons
function initialiserJetons() {
    // Initialiser les jetons de marchandises
    for (const [type, valeurs] of Object.entries(VALEURS_JETONS)) {
        etatJeu.jetons[type] = [...valeurs];
    }

    // Initialiser les jetons bonus et les mélanger
    for (const [nbCartes, valeurs] of Object.entries(BONUS_JETONS)) {
        etatJeu.jetons[`bonus${nbCartes}`] = [...valeurs];
        // Mélanger les jetons bonus
        for (let i = etatJeu.jetons[`bonus${nbCartes}`].length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [etatJeu.jetons[`bonus${nbCartes}`][i], etatJeu.jetons[`bonus${nbCartes}`][j]] = 
            [etatJeu.jetons[`bonus${nbCartes}`][j], etatJeu.jetons[`bonus${nbCartes}`][i]];
        }
    }
}

// Distribuer les cartes
function distribuerCartes() {
    // Vider le marché et les mains des joueurs
    etatJeu.marche = [];
    etatJeu.joueurs[0].main = [];
    etatJeu.joueurs[1].main = [];
    etatJeu.joueurs[0].chameaux = [];
    etatJeu.joueurs[1].chameaux = [];

    // Placer 3 chameaux dans le marché
    let nbChameaux = 0;
    for (let i = 0; i < etatJeu.pioche.length && nbChameaux < 3; i++) {
        if (etatJeu.pioche[i].type === "chameau") {
            etatJeu.marche.push(etatJeu.pioche.splice(i, 1)[0]);
            nbChameaux++;
            i--; // Ajuster l'index après avoir retiré un élément
        }
    }

    // Compléter le marché avec 2 cartes aléatoires
    while (etatJeu.marche.length < 5 && etatJeu.pioche.length > 0) {
        etatJeu.marche.push(etatJeu.pioche.pop());
    }

    // Distribuer 5 cartes à chaque joueur
    for (let i = 0; i < 5; i++) {
        if (etatJeu.pioche.length > 0) {
            const carte1 = etatJeu.pioche.pop();
            if (carte1.type === "chameau") {
                etatJeu.joueurs[0].chameaux.push(carte1);
            } else {
                etatJeu.joueurs[0].main.push(carte1);
            }
        }

        if (etatJeu.pioche.length > 0) {
            const carte2 = etatJeu.pioche.pop();
            if (carte2.type === "chameau") {
                etatJeu.joueurs[1].chameaux.push(carte2);
            } else {
                etatJeu.joueurs[1].main.push(carte2);
            }
        }
    }
}

// Changer le joueur actif
function changerJoueurActif() {
    etatJeu.joueurActif = etatJeu.joueurActif === 1 ? 2 : 1;

    // Vérifier si le nouveau joueur actif est en mode AI
    checkAndPlayAI();

    return etatJeu.joueurActif;
}

// Prendre une carte du marché
function prendreCarteDuMarche(index) {
    if (index < 0 || index >= etatJeu.marche.length) {
        return { success: false, message: "Index de carte invalide!" };
    }

    const carte = etatJeu.marche[index];

    // Vérifier si c'est un chameau
    if (carte.type === "chameau") {
        return { success: false, message: "Vous ne pouvez pas prendre un chameau individuellement. Utilisez 'Prendre tous les chameaux'." };
    }

    // Vérifier si le joueur a moins de 7 cartes en main
    const joueur = etatJeu.joueurs[etatJeu.joueurActif - 1];
    if (joueur.main.length >= 7) {
        return { success: false, message: "Vous ne pouvez pas avoir plus de 7 cartes en main!" };
    }

    // Ajouter la carte à la main du joueur
    joueur.main.push(etatJeu.marche.splice(index, 1)[0]);

    // Piocher une nouvelle carte pour remplacer celle qui a été prise
    if (etatJeu.pioche.length > 0) {
        // Insérer la nouvelle carte à la position où la carte a été prise
        etatJeu.marche.splice(index, 0, etatJeu.pioche.pop());
    }

    // Changer le joueur actif
    changerJoueurActif();

    return { success: true, message: "Carte prise avec succès!" };
}

// Prendre tous les chameaux du marché
function prendreTousLesChameaux() {
    // Vérifier s'il y a des chameaux dans le marché
    const chameauxIndices = [];
    for (let i = 0; i < etatJeu.marche.length; i++) {
        if (etatJeu.marche[i].type === "chameau") {
            chameauxIndices.push(i);
        }
    }

    if (chameauxIndices.length === 0) {
        return { success: false, message: "Il n'y a pas de chameaux dans le marché!" };
    }

    // Ajouter les chameaux à la réserve du joueur
    const joueur = etatJeu.joueurs[etatJeu.joueurActif - 1];

    // Stocker les positions des chameaux pour les remplacer plus tard
    const positionsARemplacer = [];

    for (let i = chameauxIndices.length - 1; i >= 0; i--) {
        const index = chameauxIndices[i];
        const camel = etatJeu.marche.splice(index, 1)[0];
        joueur.chameaux.push(camel);
        positionsARemplacer.push(index);
    }

    // Piocher de nouvelles cartes pour remplacer les chameaux pris
    // Trier les positions en ordre décroissant pour éviter les problèmes d'index
    positionsARemplacer.sort((a, b) => a - b);

    for (const position of positionsARemplacer) {
        if (etatJeu.pioche.length > 0) {
            // Insérer une nouvelle carte à la position où le chameau a été pris
            etatJeu.marche.splice(position, 0, etatJeu.pioche.pop());
        }
    }

    // Changer le joueur actif
    changerJoueurActif();

    return { success: true, message: "Chameaux pris avec succès!" };
}

// Vendre des cartes
function vendreCartes(type, quantite) {
    const joueur = etatJeu.joueurs[etatJeu.joueurActif - 1];

    // Vérifier si le joueur a assez de cartes
    let compteCarte = 0;
    joueur.main.forEach(carte => {
        if (carte.type === type) compteCarte++;
    });

    if (compteCarte < quantite) {
        return { success: false, message: `Vous n'avez pas assez de cartes ${TYPES_MARCHANDISES[type].nom}!` };
    }

    // Vérifier le minimum requis pour la vente
    if (quantite < TYPES_MARCHANDISES[type].min_vente) {
        return { success: false, message: `Vous devez vendre au moins ${TYPES_MARCHANDISES[type].min_vente} cartes ${TYPES_MARCHANDISES[type].nom}!` };
    }

    // Retirer les cartes de la main du joueur
    for (let i = 0; i < quantite; i++) {
        for (let j = 0; j < joueur.main.length; j++) {
            if (joueur.main[j].type === type) {
                joueur.main.splice(j, 1);
                break;
            }
        }
    }

    // Attribuer les jetons
    let jetonsGagnes = [];
    for (let i = 0; i < quantite && etatJeu.jetons[type].length > 0; i++) {
        const valeurJeton = etatJeu.jetons[type].shift();
        joueur.jetons.push({ type: type, valeur: valeurJeton });
        jetonsGagnes.push(valeurJeton);
    }

    // Attribuer les jetons bonus si applicable
    if (quantite >= 3 && etatJeu.jetons[`bonus${quantite}`] && etatJeu.jetons[`bonus${quantite}`].length > 0) {
        const valeurBonus = etatJeu.jetons[`bonus${quantite}`].shift();
        joueur.jetons.push({ type: `bonus${quantite}`, valeur: valeurBonus });
        jetonsGagnes.push(valeurBonus);
    }

    // Calculer le total des points gagnés
    const totalPoints = jetonsGagnes.reduce((sum, val) => sum + val, 0);

    // Vérifier si la manche est terminée
    const mancheTerminee = verifierFinManche();

    // Changer le joueur actif si la manche n'est pas terminée
    if (!mancheTerminee) {
        changerJoueurActif();
    }

    return { 
        success: true, 
        message: `Vous avez vendu ${quantite} ${TYPES_MARCHANDISES[type].nom}(s) pour ${totalPoints} points!`,
        mancheTerminee: mancheTerminee
    };
}

// Échanger des marchandises
function echangerMarchandises(cartesJoueur, cartesMarche, nombreChameaux = 0) {
    const joueur = etatJeu.joueurs[etatJeu.joueurActif - 1];

    // Vérifier si le nombre de cartes est égal (cartes + chameaux du joueur = cartes du marché)
    if (cartesJoueur.length + nombreChameaux !== cartesMarche.length) {
        return { success: false, message: "Vous devez échanger le même nombre de cartes!" };
    }

    // Vérifier si le joueur a les cartes nécessaires
    const compteCarte = {};
    joueur.main.forEach(carte => {
        if (!compteCarte[carte.type]) {
            compteCarte[carte.type] = 0;
        }
        compteCarte[carte.type]++;
    });

    for (const type of cartesJoueur) {
        if (!compteCarte[type] || compteCarte[type] <= 0) {
            return { success: false, message: `Vous n'avez pas assez de cartes ${TYPES_MARCHANDISES[type].nom}!` };
        }
        compteCarte[type]--;
    }

    // Vérifier si le joueur a assez de chameaux
    if (nombreChameaux > joueur.chameaux.length) {
        return { success: false, message: "Vous n'avez pas assez de chameaux!" };
    }

    // Vérifier si les cartes du marché sont disponibles
    for (const index of cartesMarche) {
        if (index < 0 || index >= etatJeu.marche.length) {
            return { success: false, message: "Carte du marché invalide!" };
        }

        if (etatJeu.marche[index].type === "chameau") {
            return { success: false, message: "Vous ne pouvez pas échanger contre des chameaux!" };
        }
    }

    // Effectuer l'échange
    // 1. Retirer les cartes de la main du joueur
    const cartesJoueurObj = [];
    for (const type of cartesJoueur) {
        for (let i = 0; i < joueur.main.length; i++) {
            if (joueur.main[i].type === type) {
                cartesJoueurObj.push(joueur.main.splice(i, 1)[0]);
                break;
            }
        }
    }

    // 2. Retirer les chameaux du joueur
    const chameauxJoueurObj = [];
    for (let i = 0; i < nombreChameaux; i++) {
        chameauxJoueurObj.push(joueur.chameaux.pop());
    }

    // 3. Retirer les cartes du marché et stocker leurs positions
    const cartesMarcheObj = [];
    const positionsMarche = [...cartesMarche].sort((a, b) => a - b); // Copier et trier en ordre croissant

    // Retirer les cartes du marché en ordre décroissant pour éviter les problèmes d'index
    for (const index of [...cartesMarche].sort((a, b) => b - a)) {
        cartesMarcheObj.push(etatJeu.marche.splice(index, 1)[0]);
    }

    // 4. Ajouter les cartes du marché à la main du joueur
    joueur.main.push(...cartesMarcheObj);

    // 5. Remettre les cartes du joueur et les chameaux dans le marché aux positions d'origine
    const cartesARemettre = [...cartesJoueurObj, ...chameauxJoueurObj];

    // Remettre les cartes aux positions d'origine
    for (let i = 0; i < positionsMarche.length; i++) {
        const position = positionsMarche[i];
        if (i < cartesARemettre.length) {
            etatJeu.marche.splice(position, 0, cartesARemettre[i]);
        }
    }

    // Changer le joueur actif
    changerJoueurActif();

    return { success: true, message: "Échange effectué avec succès!" };
}

// Vérifier si la manche est terminée
function verifierFinManche() {
    // Condition 1: 3 piles de jetons épuisées
    let pilesEpuisees = 0;
    for (const type of Object.keys(TYPES_MARCHANDISES)) {
        if (type !== "chameau" && etatJeu.jetons[type].length === 0) {
            pilesEpuisees++;
        }
    }
    if (pilesEpuisees >= 3) {
        return true;
    }

    // Condition 2: Pioche épuisée et marché incomplet
    return etatJeu.pioche.length === 0 && etatJeu.marche.length < 5;
}

// Terminer la manche
function terminerManche() {
    // Calculer les points des jetons pour chaque joueur
    for (let i = 0; i < 2; i++) {
        const joueur = etatJeu.joueurs[i];
        joueur.pointsManche = joueur.jetons.reduce((sum, jeton) => sum + jeton.valeur, 0);
    }

    // Attribuer le bonus de chameaux
    if (etatJeu.joueurs[0].chameaux.length > etatJeu.joueurs[1].chameaux.length) {
        etatJeu.joueurs[0].pointsManche += 5;
        etatJeu.bonusChameaux = 1;
    } else if (etatJeu.joueurs[1].chameaux.length > etatJeu.joueurs[0].chameaux.length) {
        etatJeu.joueurs[1].pointsManche += 5;
        etatJeu.bonusChameaux = 2;
    } else {
        etatJeu.bonusChameaux = 0;
    }

    // Déterminer le gagnant de la manche
    if (etatJeu.joueurs[0].pointsManche > etatJeu.joueurs[1].pointsManche) {
        etatJeu.joueurs[0].sceaux++;
        etatJeu.gagnantManche = 1;
    } else if (etatJeu.joueurs[1].pointsManche > etatJeu.joueurs[0].pointsManche) {
        etatJeu.joueurs[1].sceaux++;
        etatJeu.gagnantManche = 2;
    } else {
        // En cas d'égalité, le joueur avec le plus de jetons gagne
        if (etatJeu.joueurs[0].jetons.length > etatJeu.joueurs[1].jetons.length) {
            etatJeu.joueurs[0].sceaux++;
            etatJeu.gagnantManche = 1;
        } else if (etatJeu.joueurs[1].jetons.length > etatJeu.joueurs[0].jetons.length) {
            etatJeu.joueurs[1].sceaux++;
            etatJeu.gagnantManche = 2;
        } else {
            // En cas d'égalité parfaite, aucun joueur ne gagne de sceau
            etatJeu.gagnantManche = 0;
        }
    }

    // Vérifier si la partie est terminée (2 sceaux d'excellence)
    if (etatJeu.joueurs[0].sceaux >= 2 || etatJeu.joueurs[1].sceaux >= 2) {
        etatJeu.partieTerminee = true;
        etatJeu.gagnantPartie = etatJeu.joueurs[0].sceaux >= 2 ? 1 : 2;
    } else {
        etatJeu.partieTerminee = false;
    }

    return {
        gagnantManche: etatJeu.gagnantManche,
        pointsJoueur1: etatJeu.joueurs[0].pointsManche,
        pointsJoueur2: etatJeu.joueurs[1].pointsManche,
        bonusChameaux: etatJeu.bonusChameaux,
        partieTerminee: etatJeu.partieTerminee,
        gagnantPartie: etatJeu.gagnantPartie
    };
}

// Préparer la manche suivante
function preparerMancheSuivante() {
    // Réinitialiser les jetons des joueurs
    etatJeu.joueurs[0].jetons = [];
    etatJeu.joueurs[1].jetons = [];

    // Incrémenter le compteur de manche
    etatJeu.mancheActuelle++;

    // Réinitialiser la pioche et les jetons
    initialiserPioche();
    initialiserJetons();

    // Distribuer les cartes
    distribuerCartes();

    // Le perdant de la manche précédente commence
    if (etatJeu.gagnantManche === 1) {
        etatJeu.joueurActif = 2;
    } else if (etatJeu.gagnantManche === 2) {
        etatJeu.joueurActif = 1;
    } else {
        // En cas d'égalité, le joueur 1 commence
        etatJeu.joueurActif = 1;
    }

    // Vérifier si le joueur actif est en mode AI et le faire jouer si nécessaire
    checkAndPlayAI();

    return etatJeu;
}

// Nouvelle partie
function nouvellePartie() {
    etatJeu.joueurs[0].score = 0;
    etatJeu.joueurs[1].score = 0;
    etatJeu.joueurs[0].sceaux = 0;
    etatJeu.joueurs[1].sceaux = 0;
    etatJeu.mancheActuelle = 1;
    etatJeu.partieTerminee = false;
    etatJeu.gagnantPartie = null;

    initialiserJeu();

    return etatJeu;
}

// Fonctions pour gérer le mode AI
function toggleAIMode(joueurId) {
    if (joueurId < 1 || joueurId > 2) {
        return { success: false, message: "Joueur invalide!" };
    }

    etatJeu.aiMode[joueurId - 1] = !etatJeu.aiMode[joueurId - 1];
    return { 
        success: true, 
        enabled: etatJeu.aiMode[joueurId - 1],
        message: `Mode AI ${etatJeu.aiMode[joueurId - 1] ? "activé" : "désactivé"} pour le Joueur ${joueurId}`
    };
}

function isAIMode(joueurId) {
    if (joueurId < 1 || joueurId > 2) {
        return false;
    }
    return etatJeu.aiMode[joueurId - 1];
}

// Fonction pour faire jouer l'IA
function playAI() {
    // Vérifier si c'est au tour de l'IA
    if (!isAIMode(etatJeu.joueurActif)) {
        return { success: false, message: "Ce n'est pas au tour de l'IA!" };
    }

    const joueur = etatJeu.joueurs[etatJeu.joueurActif - 1];
    let result = { success: false, message: "" };

    // Stratégie 1: Vendre des cartes si possible
    // Vérifier si le joueur a assez de cartes d'un même type pour les vendre
    const compteCarte = {};
    joueur.main.forEach(carte => {
        if (!compteCarte[carte.type]) {
            compteCarte[carte.type] = 0;
        }
        compteCarte[carte.type]++;
    });

    // Essayer de vendre les cartes les plus précieuses d'abord
    const typesParPriorite = ["diamant", "or", "argent", "tissu", "epice", "cuir"];

    // Stratégie avancée: Vendre seulement quand c'est avantageux
    for (const type of typesParPriorite) {
        // Vendre 3+ cartes de haute valeur, ou vendre 5+ de basse valeur
        if (compteCarte[type]) {
            // Si c'est un type précieux ou si on a beaucoup de cartes, on vend
            const estTypePrecieux = typesParPriorite.indexOf(type) <= 2;
            const quantiteOptimale = estTypePrecieux ? 3 : 5;

            // Vendre si on a atteint un seuil optimal, ou si on risque de ne plus pouvoir jouer
            if ((compteCarte[type] >= quantiteOptimale && compteCarte[type] >= TYPES_MARCHANDISES[type].min_vente) || 
                (joueur.main.length >= 6 && compteCarte[type] >= TYPES_MARCHANDISES[type].min_vente)) {
                result = vendreCartes(type, compteCarte[type]);
                if (result.success) {
                    return { 
                        success: true, 
                        message: `L'IA a vendu ${compteCarte[type]} ${TYPES_MARCHANDISES[type].nom}(s).`,
                        mancheTerminee: result.mancheTerminee
                    };
                }
            }
        }
    }

    // Stratégie 2: Vérifier les possibilités d'échange avantageuses
    // Cette stratégie permet d'obtenir des cartes de valeur supérieure
    if (joueur.chameaux.length > 0 || joueur.main.length > 0) {
        const echangesPossibles = trouverMeilleursEchanges(joueur, etatJeu.marche);
        if (echangesPossibles.cartesJoueur.length > 0) {
            // Vérifier si c'est le même échange que le précédent
            const joueurIndex = etatJeu.joueurActif - 1;
            const dernierEchange = etatJeu.dernierEchangeAI[joueurIndex];

            // Comparer l'échange actuel avec le dernier échange
            const memeEchange = dernierEchange && 
                JSON.stringify(dernierEchange.cartesJoueur.sort()) === JSON.stringify([...echangesPossibles.cartesJoueur].sort()) &&
                JSON.stringify(dernierEchange.cartesMarche.sort()) === JSON.stringify([...echangesPossibles.cartesMarche].sort()) &&
                dernierEchange.nombreChameaux === echangesPossibles.nombreChameaux;

            // Si c'est le même échange, passer à une autre stratégie
            if (memeEchange) {
                console.log("L'IA évite de faire le même échange deux fois de suite.");
                // Ne pas faire cet échange, continuer avec les autres stratégies
            } else {
                // Effectuer l'échange et le stocker comme dernier échange
                result = echangerMarchandises(
                    echangesPossibles.cartesJoueur, 
                    echangesPossibles.cartesMarche, 
                    echangesPossibles.nombreChameaux
                );
                if (result.success) {
                    // Stocker l'échange comme dernier échange pour ce joueur
                    etatJeu.dernierEchangeAI[joueurIndex] = {
                        cartesJoueur: [...echangesPossibles.cartesJoueur],
                        cartesMarche: [...echangesPossibles.cartesMarche],
                        nombreChameaux: echangesPossibles.nombreChameaux
                    };

                    return { 
                        success: true, 
                        message: `L'IA a échangé ${echangesPossibles.cartesJoueur.length + echangesPossibles.nombreChameaux} cartes.` 
                    };
                }
            }
        }
    }

    // Stratégie 3: Prendre tous les chameaux s'il y en a
    // Ne prendre les chameaux que si on en a moins de 5 ou s'il y en a plusieurs sur le marché
    const chameauxDansMarche = etatJeu.marche.filter(carte => carte.type === "chameau").length;
    if (chameauxDansMarche > 0 && (chameauxDansMarche >= 2 || joueur.chameaux.length < 5)) {
        result = prendreTousLesChameaux();
        if (result.success) {
            return { success: true, message: "L'IA a pris tous les chameaux." };
        }
    }

    // Stratégie 4: Essayer d'accumuler des cartes du même type pour les vendre plus tard
    // Analyser quels types de cartes on a déjà en main pour prioriser leur accumulation
    const typesAAccumuler = typesParPriorite.filter(type => 
        compteCarte[type] && compteCarte[type] > 0 && compteCarte[type] < TYPES_MARCHANDISES[type].min_vente + 2
    );

    if (typesAAccumuler.length > 0 && joueur.main.length < 6) {
        // Chercher ces types dans le marché
        for (let i = 0; i < etatJeu.marche.length; i++) {
            const carte = etatJeu.marche[i];
            if (carte.type !== "chameau" && typesAAccumuler.includes(carte.type)) {
                result = prendreCarteDuMarche(i);
                if (result.success) {
                    return { success: true, message: `L'IA a pris une carte ${TYPES_MARCHANDISES[carte.type].nom} pour compléter sa collection.` };
                }
            }
        }
    }

    // Stratégie 5: Prendre une carte précieuse du marché
    if (joueur.main.length < 6) {
        for (let i = 0; i < etatJeu.marche.length; i++) {
            const carte = etatJeu.marche[i];
            if (carte.type !== "chameau" && typesParPriorite.indexOf(carte.type) <= 2) { // Diamant, Or, Argent
                result = prendreCarteDuMarche(i);
                if (result.success) {
                    return { success: true, message: `L'IA a pris une carte ${TYPES_MARCHANDISES[carte.type].nom}.` };
                }
            }
        }
    }

    // Stratégie 6: Prendre n'importe quelle carte du marché
    if (joueur.main.length < 7) {
        for (let i = 0; i < etatJeu.marche.length; i++) {
            const carte = etatJeu.marche[i];
            if (carte.type !== "chameau") {
                result = prendreCarteDuMarche(i);
                if (result.success) {
                    return { success: true, message: `L'IA a pris une carte ${TYPES_MARCHANDISES[carte.type].nom}.` };
                }
            }
        }
    }

    // En dernier recours, prendre des chameaux même si ce n'est pas optimal
    if (chameauxDansMarche > 0) {
        result = prendreTousLesChameaux();
        if (result.success) {
            return { success: true, message: "L'IA a pris tous les chameaux comme dernier recours." };
        }
    }

    return { success: false, message: "L'IA n'a pas pu jouer son tour." };
}

// Fonction utilitaire pour déterminer les meilleurs échanges possibles
function trouverMeilleursEchanges(joueur, marche) {
    const typesParPriorite = ["diamant", "or", "argent", "tissu", "epice", "cuir"];
    const echanges = { cartesJoueur: [], cartesMarche: [], nombreChameaux: 0, score: -Infinity };

    // Calculer les cartes disponibles pour l'échange
    const compteCarte = {};
    joueur.main.forEach(carte => {
        if (!compteCarte[carte.type]) {
            compteCarte[carte.type] = 0;
        }
        compteCarte[carte.type]++;
    });

    // Essayer différentes combinaisons d'échanges (limité pour simplifier)
    // Chercher des échanges pour 1 à 3 cartes
    for (let taille = 1; taille <= 3; taille++) {
        if (joueur.main.length + joueur.chameaux.length < taille) continue;

        // Calculer toutes les possibilités d'échange de cette taille
        const cartesJoueurPossibles = [];
        const cartesJoueurTypes = Object.keys(compteCarte).filter(type => compteCarte[type] > 0);

        // Pour les cartes du joueur, priorité aux cartes moins précieuses
        const typesJoueurParPriorite = [...typesParPriorite].reverse();

        // Si le joueur a assez de cartes en main
        if (joueur.main.length >= taille) {
            // Tester en utilisant seulement des cartes en main
            const typesAUtiliser = [];

            // Prioriser l'utilisation des cartes de moindre valeur
            for (const type of typesJoueurParPriorite) {
                if (compteCarte[type] && compteCarte[type] > 0) {
                    for (let i = 0; i < Math.min(compteCarte[type], taille - typesAUtiliser.length); i++) {
                        typesAUtiliser.push(type);
                        if (typesAUtiliser.length === taille) break;
                    }
                }
                if (typesAUtiliser.length === taille) break;
            }

            if (typesAUtiliser.length === taille) {
                cartesJoueurPossibles.push({
                    types: typesAUtiliser,
                    chameaux: 0
                });
            }
        }

        // Utiliser des chameaux pour compléter si nécessaire
        if (joueur.chameaux.length > 0) {
            for (let chameauxUtilises = 1; chameauxUtilises <= Math.min(joueur.chameaux.length, taille); chameauxUtilises++) {
                if (joueur.main.length < taille - chameauxUtilises) continue;

                const typesAUtiliser = [];
                for (const type of typesJoueurParPriorite) {
                    if (compteCarte[type] && compteCarte[type] > 0) {
                        for (let i = 0; i < Math.min(compteCarte[type], taille - chameauxUtilises - typesAUtiliser.length); i++) {
                            typesAUtiliser.push(type);
                            if (typesAUtiliser.length === taille - chameauxUtilises) break;
                        }
                    }
                    if (typesAUtiliser.length === taille - chameauxUtilises) break;
                }

                if (typesAUtiliser.length === taille - chameauxUtilises) {
                    cartesJoueurPossibles.push({
                        types: typesAUtiliser,
                        chameaux: chameauxUtilises
                    });
                }
            }
        }

        // Pour chaque combinaison de cartes du joueur, chercher les meilleures cartes à prendre dans le marché
        for (const possibilite of cartesJoueurPossibles) {
            const indicesMarche = [];
            let scoreEchange = 0;

            // Calculer la valeur des cartes du joueur qu'on va échanger
            const valeurCartesJoueur = possibilite.types.reduce((total, type) => {
                // Estimation de la valeur: position dans la liste des priorités
                return total + (typesParPriorite.length - typesParPriorite.indexOf(type));
            }, 0);

            // Chercher les cartes de plus haute valeur dans le marché
            const cartesMarche = marche.map((carte, index) => ({
                carte,
                index,
                valeur: carte.type !== "chameau" ? typesParPriorite.indexOf(carte.type) + 1 : 0
            }))
            .filter(item => item.carte.type !== "chameau") // Exclure les chameaux
            .sort((a, b) => a.valeur - b.valeur); // Trier par valeur (plus petit index = plus précieux)

            // Prendre les meilleures cartes du marché
            for (let i = 0; i < Math.min(taille, cartesMarche.length); i++) {
                indicesMarche.push(cartesMarche[i].index);
                scoreEchange += cartesMarche[i].valeur;
            }

            // Si on n'a pas assez de cartes dans le marché, cette combinaison n'est pas valide
            if (indicesMarche.length !== taille) continue;

            // Calculer le score final de cet échange (valeur obtenue - valeur donnée)
            // Plus la différence est grande, meilleur est l'échange
            const scoreFinal = scoreEchange - valeurCartesJoueur - (possibilite.chameaux * 0.5); // Les chameaux ont une petite valeur

            // Si cet échange est meilleur que le précédent
            if (scoreFinal > echanges.score && indicesMarche.length === taille) {
                echanges.cartesJoueur = [...possibilite.types];
                echanges.cartesMarche = [...indicesMarche];
                echanges.nombreChameaux = possibilite.chameaux;
                echanges.score = scoreFinal;
            }
        }
    }

    // Ne proposer un échange que s'il est avantageux
    if (echanges.score <= 0) {
        echanges.cartesJoueur = [];
        echanges.cartesMarche = [];
        echanges.nombreChameaux = 0;
    }

    return echanges;
}

// Vérifier si le joueur actif est en mode AI et le faire jouer si nécessaire
function checkAndPlayAI() {
    if (isAIMode(etatJeu.joueurActif)) {
        // Laisser un court délai pour que l'interface se mette à jour
        setTimeout(() => {
            const aiResult = playAI();
            // Le message et la mise à jour de l'affichage seront gérés par l'interface
            // Mais on peut aussi déclencher un événement personnalisé pour informer l'interface
            if (aiResult.success && typeof window !== 'undefined' && window.document) {
                const event = new CustomEvent('aiPlayed', { 
                    detail: { 
                        success: aiResult.success, 
                        message: aiResult.message,
                        mancheTerminee: aiResult.mancheTerminee
                    } 
                });
                window.document.dispatchEvent(event);
            }
        }, 800); // Délai de 1 seconde pour que l'action de l'IA soit visible
    }
}

// Les fonctions et constantes sont maintenant disponibles globalement
// (pas besoin d'export avec un script standard)
