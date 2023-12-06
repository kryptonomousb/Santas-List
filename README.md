<p align="center">
<img src="https://res.cloudinary.com/droqoz7lg/image/upload/v1700748703/image_720_transformed_720_djb9ly.png" width="400" alt="SantasList">
<br/>

# KRYPTONOMOUS-B Findings

- [About](#about)
  - [SantasList](#santaslist)
    - [List Checking](#list-checking)
    - [Collecting Presents](#collecting-presents)
  - [SantaToken](#santatoken)
  - [TokenUri.sol](#tokenurisol)

# Tools Used:  HardHat TypeScript

Test File is located -  ./test/SantaTest.ts


## POC Testing

```
- npx hardhat test test/SantaTest.ts
```

The codebase is broken up into 3 contracts:
- `SantasList.sol` 
- `SantaToken.sol` 
- `TokenUri.sol`


## FINDINGS

 Santas List Contract
     ✔ Checking Deployment and who is Santa
     ✔ Setting user1 to nice list and checking permissions Only SANTA
    `✔ EXPLOIT: CHECKLIST POC Anyone can add/ change the Nice List Not just SANTA (60ms)`
     ✔ CheckList twice, can not have list different then once and permissions Only Santa  (96ms)
     ✔ Cannot collect presents earlier than  Xmas
     ✔ Collect Present - NICE LIST
     ✔ Collect Present - Cannot collect present if already collected
    `✔ EXPLOIT: Collect Present POC - BYPASS already collected and collect another (95ms)`
     ✔ Collect Present: Cannot collect present if you are NAUGHTY
     ✔ Collect Present: EXTRA NICE receive Token + NFT (65ms)
     ✔ Buy Present - Anyone that has SantaTokens (39ms)
     ✔ MINT Token:  Only SantaList Contract
     ✔ Burn Token: Only SantaList Contract
    `✔ EXPLOIT:  No LIMIT POC - NFT / TOKEN MINT forever (2821ms)`


  14 passing (7s)