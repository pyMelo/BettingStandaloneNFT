// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient}      from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract BettingStandalone is ERC721, VRFConsumerBaseV2Plus {
    using VRFV2PlusClient for VRFV2PlusClient.RandomWordsRequest;

    /*–––––– VRF parameters ––––––*/
    bytes32 public keyHash;             // “gas lane”
    uint256  public subscriptionId;      // la tua subscription già funded
    uint16  public requestConfirmations; 
    uint32  public callbackGasLimit;
    uint32  public numWords;

    /*–––––– NFT state ––––––*/
    uint256 public counter;
    mapping(uint256 => address) private requestToSender;

    /*–––––– Events ––––––*/
    event Requested(uint256 indexed requestId, address indexed requester);
    event Minted   (address indexed to, uint256 indexed tokenId, uint8 rarity, uint8 trait);

    constructor(
        uint256 _subscriptionId,
        address _vrfCoordinator,
        bytes32 _keyHash
    )
        ERC721("BettingNFT","BFT")
        VRFConsumerBaseV2Plus(_vrfCoordinator)
    {
        subscriptionId       = _subscriptionId;
        keyHash              = _keyHash;
        requestConfirmations = 3;
        callbackGasLimit     = 50_000;
        numWords             = 1;
    }

    /// @notice Chiedi un numero random per mintare un NFT
    function requestMint() external returns (uint256 requestId) {
        VRFV2PlusClient.RandomWordsRequest memory req = VRFV2PlusClient.RandomWordsRequest({
            keyHash:              keyHash,
            subId:                subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit:     callbackGasLimit,
            numWords:             numWords,
            extraArgs:            VRFV2PlusClient._argsToBytes(
                                      VRFV2PlusClient.ExtraArgsV1({ nativePayment: false })
                                  )
        });
        requestId = s_vrfCoordinator.requestRandomWords(req);
        requestToSender[requestId] = msg.sender;
        emit Requested(requestId, msg.sender);
    }

    /// @dev Callback interno: mint in base al randomWord
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        address to      = requestToSender[requestId];
        uint256 tokenId = counter++;

        uint8 rarity = (randomWords[0] % 100 < 85) ? 1 : 0;
        uint8 trait  = (rarity == 1) ? 0 : 1;

        _safeMint(to, tokenId);
        emit Minted(to, tokenId, rarity, trait);
    }

    /// @dev Base URI per i metadata
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://your_base_uri/";
    }
}
