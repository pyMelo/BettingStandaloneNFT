//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// fixare I TRAIT

contract BettingStandalone is ERC721, Ownable{
    string[] private _metadataURIs;

    /*
    @available
    E' un array degli uri disponibili, quando viene mintato un token,
    l'array viene diminiuito di 1, e l'indice dell'uri viene rimosso 
    (ad es. array prima : [0,1,2,3] -> l'array diventa [0,1,3])
     */
    uint256[] private _available;
    uint256 private _counter;
    mapping(uint256=>string) private _tokenURIs;

    event Minted(
      address indexed to,
      uint256 indexed tokenId,
      string metadataURI
    );


    constructor(
        string[] memory _uris
        ) 
    ERC721("BettingStandalone","BTS")
    Ownable(msg.sender)
    {
        require(_uris.length > 0, "No URIs provided");
        _metadataURIs = _uris;
        for(uint i = 0; i < _uris.length; i++){
            // serve per popolare l'available con gli indici degli URI
            _available.push(i);
        }
    }


    function mint() external{
        require(_available.length > 0 , "Sold out");
        uint256 tokenId = _counter++;

        uint256 rnd = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % _available.length;

        uint256 metaIndex = _available[rnd];
        _tokenURIs[tokenId] = _metadataURIs[metaIndex];

        uint last = _available.length - 1;
        _available[rnd] = _available[last];
        _available.pop();
         
        _safeMint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId, _tokenURIs[tokenId]);
    }

    // to see if the token exists
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory uri = _tokenURIs[tokenId];
        require(bytes(uri).length > 0, "Token does not exist");
        return uri;
    }

    function totalMinted() external view returns (uint256) {
        return _counter;
    }

    function updateMetadataURI(uint256 index, string memory newURI) external onlyOwner {
        require(index < _metadataURIs.length, "Index out of bounds");
        _metadataURIs[index] = newURI;
    }

    function addMetadataURI(string memory newURI) external onlyOwner {
        _metadataURIs.push(newURI);
        _available.push(_metadataURIs.length - 1);
    }

    function totalSupply() external view returns (uint256){
        return _metadataURIs.length;
    }
}