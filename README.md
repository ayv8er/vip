# Magic

# Getting Started
- [Demo Codesandbox App]()
- Clone and run locally

# Index
- [Magic Auth (Client + Server SDK)](#magic-auth)
- [Non-Custodial Wallets](#non-custodial-wallets)
- [NFT Mint and Delivery](#nft-mint-and-delivery)
- [Migration](#migration)

# Magic Auth
- [1 minute Video demo of white-labeled email login flow; custom email provider and custom email template](https://www.loom.com/share/f0507ab003b4461492d395cb43aa5512?sid=006f2b68-61f3-4637-b2b6-87da140f3e55)
- [1 minute video demo of Google + email implemented; autolinking resolves both logins to same wallet](https://www.loom.com/share/7dc4e3036b8b443ab2b8b89914f820ab?sid=2a1ab823-b90d-4782-823a-a1aca7f82e44)
## Magic Client-Side Web SDK
- Estimated time to replace Auth0 auth from client for Magic's client-side SDK is about 2 days.
- [Client-Side Web SDK Docs](https://magic.link/docs/api/client-side-sdks/web)
### Instantiate client-side Magic object
```javascript
import { Magic } from 'magic-sdk';

const magicClient = new Magic(<magic_publishable_api_key>, {
  network: {
    rpcUrl: "https://polygon-rpc.com/",
    chainId: 137,
  }
});
```
### Log user in via email and retrieve user metadata
```javascript
const didToken = await magicClient.auth.loginWithEmailOTP({ email });
const userData = await magicClient.user.getInfo();

userData = {
  issuer: string, // this is your unique user ID
  email: string,
  phoneNumber: string,
  publicAddress: string,
  walletType: string,
  isMfaEnabled: boolean, // secure your users' assets
  recoveryFactor: array, // let your users recover account with phone number in case their email is compromised
};
```
## Magic Server-Side Node SDK Docs
- Estimated time to replace Auth0 calls from server for Magic's server-side SDK is 1 day.
- [Server-Side Node SDK Docs](https://magic.link/docs/api/server-side-sdks/node)
### Instantiate server-side Magic object
```javascript
const { Magic } = require('@magic-sdk/admin');

const serverMagic = await Magic.init(<magic_publishable_api_key>);
```
### Validate DID Token of logged in user from client and retrieve user metadata on server
```javascript
const authHeader = req.headers.authorization;
const didToken = serverMagic.utils.parseAuthorizationHeader(authHeader);
serverMagic.token.validate(didToken);
const userData = await magic.users.getMetadataByToken(didToken);

userData = {
  issuer: string,
  email: string, // safely store email to DB without sending in request
  publicAddress: string, // safely store public key to DB without sending in request
  phoneNumber: string | null,
  oauthProvider: string | null,
  wallets: object,
};
```
# Non-Custodial Wallets
## Delegated Key Management System (DKMS)
- [Whitepaper](https://magic-whitepaper-key-based-authentication-system.s3.us-west-2.amazonaws.com/Magic+Whitepaper.pdf)
- DKMS Diagram
![Screenshot 2024-02-14 at 18 22 14](https://github.com/ayv8er/vip/assets/84942969/0137f8b6-0526-47a3-ac7d-9ca9eb20133c)
# NFT Mint and Delivery
- [1 minute video demo of mint and delivery call just after login](https://www.loom.com/share/918b49ed9ec84d9abae239afa835c1bd?sid=f52392d9-8a10-42fb-b85f-d8205b8da647)
- Estimated time to configure smart contract to Magic's Mint and Delivery API is 2 days.
- [NFT Mint and Delivery API Docs](https://magic.link/docs/nfts/features/minting-and-delivery)
### Call to one Magic endpoint mints and delivers on-demand
- Minter tool integrates with any payment provider
- Supports ERC-721 or ERC-1155
- Use webhooks or receive events in real-time
- Poll endpoint to get status of minting requests
```javascript
await fetch("<https://nft-api.magic.link/v1/nft/721/start_mint>", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-Magic-Secret-Key": <sk_live_xxxxxxx>,
    },
    body: JSON.stringify({
        contract_id: <contract_id>,
        quantity: int,
        destination_address: str,
    })
});
```
# Migration
## Call Crossmint's NFT transfer endpoint anytime after user authentication
```javascript
await fetch(“https://staging.crossmint.com/api/v1-alpha1/wallets/transfer", {
    method: “POST”,
    headers: {
        "Content-Type": "application/json",
        "X-API-Key": <CROSSMINT_API_KEY>, 
    },
    body: JSON.stringify({
        chain: str,
        contractAddress: str,
        from: str,
        quantity: str,
        to: <MAGIC_WALLET_ADDRESS>,
        tokenId: str,
    })
});
```
