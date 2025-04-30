require("dotenv").config({path: "../.env"});
const pinataSDK = require("@pinata/sdk");
const fs        = require("fs");
const manifest = require("./manifest"); //manifest.js



const pinata = new pinataSDK(
    process.env.PINATA_API_KEY,
    process.env.PINATA_SECRET_API_KEY   
);

async function main() {
    const mdCids = [];metadata-cids
    for (const item of manifest){
        const json = {
            name: `Avatar #${item.index}`,
            description : `RArità : ${item.rarity}`,
            image: `ipfs://${item.imageCid}`,
            attributes: [
                { trait_type: "Rarity", value: item.rarity },
                { trait_type: "Trait",   value: item.trait  }
            ]
        };

        const { IpfsHash } = await pinata.pinJSONToIPFS(json, {
            pinataMetadata: { name: `metadata-${item.index}.sjon`} 
    });
    console.log(`Pinned metadata ${item.index}: ${IpfsHash}`);
    mdCids.push(IpfsHash);
    }

    fs.writeFileSync("../metadata/metadata-cids.json", JSON.stringify(mdCids, null, 2));
    console.log("Metadata CIDs saved to metadata-cids.json");
}

main().catch(console.error);