// scripts/manifest.js
const imageCids = require("../image-cids.js");   // path corretto!

module.exports = [
    // tokenIndex, fileName, e la rarità che vuoi assegnare
    { index: 0, imageCid: imageCids[0], rarity: "Legendary", trait: "Golden Monkey" },
    { index: 1, imageCid: imageCids[1], rarity: "Epic",     trait: "Obsidian Monkey" },
    { index: 2, imageCid: imageCids[2], rarity: "Rare",     trait: "Cobalt Monkey" },
    { index: 3, imageCid: imageCids[3], rarity: "Common",   trait: "Metal Monkey" }
  ];
  