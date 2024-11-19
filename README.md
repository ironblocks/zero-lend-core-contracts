# 🛡️ Zerolend + Venn Firewall Integration Demo

This repository demonstrates the integration of Venn Firewall with the Zerolend protocol.

## 🚀 Quick Start

1. Clone this repository
2. Install dependencies:
   ```bash
   npm i
   ```

3. Set up your environment variables (see [Environment Setup](#️-environment-setup))

4. Follow the deployment and execution flow below

## 🔄 Deployment and Execution Flow

### 1. Deploy Contracts
```bash
./setup-test-env.sh
npx hardhat deploy --network holesky
```
This deploys the ZeroLend contracts to the network.

### 2. Set up Venn CLI and Environment
```bash
# Install Venn CLI globally
npm i -g @vennbuild/cli
```
Set up your environment variables and create venn.config.json (see [Environment Setup](#️-environment-setup)) and ([Venn Configuration](#-venn-configuration))

### 3. Enable Venn Policy
```bash
venn enable --network holesky
```
Add the generated policy address to your venn.config.json under the "ApprovedCalls" field.

### 4. Execute Transactions

Use the Venn dApp SDK to execute transactions. See the [Venn Documentation](https://docs.venn.build/docs/dapp-sdk/overview) for more information.


## 📁 Modified Files with Venn Integration

The following files have been customized to incorporate Venn Firewall:

- `contracts/protocol/configuration/ACLManager.sol`
- `contracts/protocol/configuration/PoolAddressesProvider.sol`
- `contracts/protocol/configuration/PoolAddressesProviderRegistry.sol`
- `contrracts/protocol/libraries/aave-upgradeability/BaseImmutableAdminUpgradeabilityProxy.sol`
- `contracts/protocol/pool/Pool.sol`
- `contracts/protocol/pool/PoolConfigurator.sol`
- `contracts/protocol/tokenization/AToken.sol`
- `contracts/protocol/tokenization/DelegationAwareAToken.sol`
- `contracts/protocol/tokenization/StableDebtToken.sol`
- `contracts/protocol/tokenization/VariableDebtToken.sol`
- `contracts/protocol/tokenization/base/DebtTokenBase.sol`
- `contracts/protocol/tokenization/base/IncentivizedERC20.sol`

## 🔗 Example Transactions (Holesky Testnet)

View example transactions demonstrating different scenarios of the integration on Holesky testnet:

### Failed Transactions
1. **Attempt without Venn dApp SDK**  
   Transaction fails when trying to interact directly without the SDK  
   [View on Etherscan](https://holesky.etherscan.io/tx/0xa440f33f1a318d653c2c1acb56b1a707c530468227b0fea6e1e67f876454ee4b)

2. **Attempt with SDK but no approved calls**  
   Transaction fails when using SDK but without proper call approvals  
   [View on Etherscan](https://holesky.etherscan.io/tx/0x972bc0d89ce65c3989a5abf73b9405c7751ece9a52e11e5e5626bc2fb9cb4f52)

### Successful Transactions
1. **Call Approval**  
   Successfully approving calls for the integration  
   [View on Etherscan](https://holesky.etherscan.io/tx/0x7266fa701cfbf82caf91a5442b87881b2d1407e9edb9b35d66d997946956b75e)

2. **Supply Through Venn dApp SDK**  
   Successful supply operation using properly configured Venn dApp SDK  
   [View on Etherscan](https://holesky.etherscan.io/tx/0x9cbed3befd6c2e2d98372f56b7c616840ceba32edbef457a5e3ca21271d7b7ef)

> **Note**: Successful transactions are only possible when:
> - Necessary calls are properly approved
> - Transactions are sent through the Venn dApp SDK

## ⚙️ Environment Setup

Create a `.env` file in the `contracts` directory with the following:

```env
# Network
PRIVATE_KEY=your_private_key
USER_PRIVATE_KEY=your_user_private_key // for signing orders
RPC_URL=your_holesky_rpc_url
VENN_NODE_URL=venn_node_url
VENN_PRIVATE_KEY=your_venn_api_key // should be the same as deployer private key

```

## 🔐 Venn Configuration

Create a `venn.config.json` file containing firewall configurations for:

```json
{
  "networks": {
    "holesky": {
        "Contract1": "...", // Contract1 address
        "Contract2": "..." // Contract2 address
    },
    "ApprovedCalls": "..." // address of the deployed policy
  }
}
```

## 📚 Resources

- [Venn Firewall Documentation](https://docs.venn.build)
- [Zerolend Documentation](https://docs.zerolend.xyz)

## ⚠️ Important Notes

- This is a demonstration project - test thoroughly before production use
- Ensure proper environment variables are set
- Monitor Venn Firewall logs for security alerts
- All transactions are executed through Venn's secure infrastructure

## 📧 Contact

For any questions or support, reach out to our integrator on telegram - [@x0b501e7e](https://t.me/x0b501e7e)
