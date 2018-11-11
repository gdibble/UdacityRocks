pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {
    /// @author Gabriel Dibble <gdibble@gmail.com>


    /// @dev STAR STRUCTURE:
    /// @return {Object}
    struct Star {
        string name;
        string dec;
        string mag;
        string ra;
        string story;
        bytes32 unique_hash;
    }


    /// @dev INTERNALS:
    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(bytes32 => bool) public notary;
    string public starName;
    string public starOwner;
    uint256 tokenId;

    /// @notice isBlank (helper)
    /// @dev Check if value is blank
    /// @param _value String to check
    /// @return {Boolean}
    function isBlank(string _value) internal pure returns (bool) {
        return keccak256(abi.encodePacked("")) != keccak256(abi.encodePacked(_value));
    }


    /// @dev EXECUTABLE UNITS:

    /// @notice checkIfStarExist
    /// @dev Check if a star exists in the notary
    /// @param _dec Declination
    /// @param _mag Appareng magnitude
    /// @param _ra Right Ascension
    /// @return {Boolean}
    function checkIfStarExist(string _dec, string _mag, string _ra) public view returns (bool) {
        require(isBlank(_dec), "Invalid argument: dec required");
        require(isBlank(_mag), "Invalid argument: mag required");
        require(isBlank(_ra), "Invalid argument: ra required");

        return notary[keccak256(abi.encodePacked(_dec, _mag, _ra))];
    }


    /// @notice createStar
    /// @dev Create a star in the notary
    /// @param _name Star name
    /// @param _dec Declination
    /// @param _mag Apparent magnitude
    /// @param _ra Right Ascension
    /// @param _story Star story
    function createStar(string _name, string _dec, string _mag, string _ra, string _story) public {
        require(isBlank(_name), "Invalid argument: `name` required");
        require(isBlank(_dec), "Invalid argument: `dec` required");
        require(isBlank(_mag), "Invalid argument: `mag` required");
        require(isBlank(_ra), "Invalid argument: `ra` required");
        require(isBlank(_story), "Invalid argument: `story` required");

        bytes32 starHash = keccak256(abi.encodePacked(_dec,_mag,_ra));
        require(!notary[starHash], string(abi.encodePacked(_name, " has already been created")));

        tokenId++;                                                              // done w/ validity.
        Star memory newStar = Star(_name, _dec, _mag, _ra, _story, starHash);

        tokenIdToStarInfo[tokenId] = newStar;
        notary[starHash] = true;

        mint(tokenId);
    }


    /// @notice putStarUpForSale
    /// @dev Put a star up for sale
    /// @param _tokenId Star token id
    /// @param _price Price to be paid for star
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender, "Invalid ownership");
        require(_price > 0, "Invalid star price");

        starsForSale[_tokenId] = _price;
    }


    /// @notice mint
    /// @dev Mint a new star token
    /// @param _tokenId Star token id
    function mint(uint256 _tokenId) public {
        super._mint(msg.sender, _tokenId);  // User `_mint` via ERC721
    }


    /// @notice buyStar
    /// @dev Buy a star
    /// @param _tokenId Star token id
    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "Invalid tokenId");

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost, "Insufficient ether to purchase star");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if (msg.value > starCost)
            msg.sender.transfer(msg.value - starCost);
    }


    /// @notice getStarSalePrice
    /// @dev Get the sale price of a star
    /// @param _tokenId Star token id
    /// @return {string}
    function getStarSalePrice(uint256 _tokenId) public view returns (uint256) {
        return starsForSale[_tokenId];
    }


    /// @notice allStarsForSale
    /// @dev Get all stars for sale
    /// @return {Array}
    function allStarsForSale() public view returns(uint256[]) {
        uint256[] starTokenId;
        uint i = 1;
        while (isBlank(tokenIdToStarInfo[i].story)) {
            if (starsForSale[i] > 0)
                starTokenId.push(i);
            i++;
        }

        return starTokenId;
    }


    /// @notice tokenIdToStarInfo
    /// @dev Get star info
    /// @param _tokenId Star token id
    /// @return {Array}
    function tokenIdToStarInfo(uint256 _tokenId) public view returns(string, string, string, string, string) {
        Star memory star = tokenIdToStarInfo[_tokenId];

        return(star.name, star.story, star.ra, star.dec, star.mag);
    }
}
