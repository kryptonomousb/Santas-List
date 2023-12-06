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
- `✔ EXPLOIT: CHECKLIST POC Anyone can add/ change the Nice List Not just SANTA (60ms)`
- `✔ EXPLOIT: Collect Present POC - BYPASS already collected and collect another (95ms)`
- `✔ EXPLOIT:  No LIMIT POC - NFT / TOKEN MINT forever (2821ms)`
