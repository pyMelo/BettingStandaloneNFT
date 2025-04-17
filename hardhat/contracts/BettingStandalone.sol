// SPDX-License-Identifier: MIT
// https://docs.chain.link/vrf/v2/getting-started
// https://docs.openzeppelin.com/contracts/4.x/erc721
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFV2WrapperConsumerBase.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";

contract BettingStandalone is ERC721URIStorage, Ownable, VRFV2WrapperConsumerBase {
    enum Rarity {
        COMMON,
        UNCOMMON
    }

    struct Standalone {
        string name;
        string attribute1;
        string attribute2;
        Rarity rarity;
    }

    VRFCoordinatorV2Interface COORDINATOR;


    // chiave per usare Chainlink VRF
    // https://docs.chain.link/vrf/v2/subscription/supported-networks
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    mapping(uint256 => address) public requestToSender;
    mapping(uint256 => Standalone) public tokenToAttributes;

    uint256 public tokenCounter;

    constructor(address _linkToken, address _vrfWrapper)
        ERC721("BettingStandalone", "BS")
        Ownable(msg.sender)
        VRFV2WrapperConsumerBase(_linkToken, _vrfWrapper)
    {
        tokenCounter = 0;
    }

    /**
     @dev Richiesta di un valore random per la generaizone dell NFT
     @return requestId ID della richiesta
     @notice Questa funzione genera una richiesta usando Chainlink VR, questa funzione è prassi 
     */
    function requestMint() public returns (uint256 requestId) {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,   
            numWords
        );
        requestToSender[requestId] = msg.sender;
    }

    /**
        @dev Funzione che viene chiamata quando il valore random è pronto
        @notice Questa funzione viene chiamata automaticamente da Chainlink VRF quando il valore random è pronto
    */

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        address minter = requestToSender[requestId];
        uint256 newTokenId = tokenCounter;

        //Probabilità rarità: 0–84 = UNCOMMON (85%), 85–99 = COMMON (15%)
        uint256 rand = randomWords[0] % 100;
        Rarity rarity = rand < 85 ? Rarity.UNCOMMON : Rarity.COMMON;

        //Assegna attributi
        string memory attr1;
        string memory attr2;
        string memory baseName = string(abi.encodePacked("Omino #", uint2str(newTokenId)));

        if (rarity == Rarity.UNCOMMON) {
            attr1 = "Cappello"; // 1 accessorio
            attr2 = "";         // slot vuoto
        } else {
            attr1 = "Occhiali"; // 2 accessori
            attr2 = "Sciarpa";
        }

        tokenToAttributes[newTokenId] = Standalone({
            name: baseName,
            attribute1: attr1,
            attribute2: attr2,
            rarity: rarity
        });

        _safeMint(minter, newTokenId);
        _setTokenURI(newTokenId, baseName); 

        tokenCounter++;
    }

    // Utils, una funzione che trasforma int in stringhe, senza usare librerie esterne
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) return "0";
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}
