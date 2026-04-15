# Game logic — jaipur-game.js

Single file (~900 lines) at the project root, shared by both themes.

## State object: `etatJeu`

```javascript
etatJeu = {
  pioche: [],          // draw pile
  marche: [],          // market (5 visible cards)
  joueurs: [           // 2 players
    { main: [], chameaux: [], jetons: [], score: 0, sceaux: 0 }
  ],
  jetons: {},          // token piles per commodity
  joueurActif: 1|2,
  mancheActuelle: 1-3, // best-of-3 rounds
  aiMode: [false, false]
}
```

## Key functions

| Function | Purpose |
|----------|---------|
| `initialiserJeu()` | Reset full game state |
| `distribuerCartes()` | Deal initial hands and market |
| `prendreCarteDuMarche(index)` | Take a single card from market |
| `prendreTousLesChameaux()` | Take all camels from market |
| `vendreCartes(type, quantite)` | Sell cards of one type |
| `echangerMarchandises(cartesJoueur, cartesMarche, chameaux)` | Trade cards with market |
| `verifierFinManche()` | Check if round-end conditions are met |
| `terminerManche()` | Score and advance to next round |
| `playAI()` | Execute one AI turn |

## Round end conditions

A round ends when **3+ token piles are exhausted** OR the **deck is empty**. Best-of-3 rounds wins the match (tracked via `sceaux`).

## French ↔ English glossary

| French | English |
|--------|---------|
| joueur | player |
| marche | market |
| pioche | draw pile |
| main | hand |
| chameau | camel |
| jeton | token |
| manche | round |
| sceau | seal (round-win marker) |
| vendre | sell |
| échanger | trade/exchange |
| Diamant / Or / Argent | Diamond / Gold / Silver |
| Tissu / Épice / Cuir | Fabric / Spice / Leather |
