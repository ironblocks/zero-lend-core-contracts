import path from 'path';
import { HardhatUserConfig } from 'hardhat/types';
// @ts-ignore
import { accounts } from './test-wallets.js';
import { COVERAGE_CHAINID, HARDHAT_CHAINID } from './helpers/constants';
import { buildForkConfig } from './helper-hardhat-config';

require('dotenv').config();

import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-deploy';
import '@tenderly/hardhat-tenderly';
import 'hardhat-contract-sizer';
import 'hardhat-dependency-compiler';
import '@nomicfoundation/hardhat-chai-matchers';
import { ZERO_ADDRESS } from './helpers/constants';
import { DEFAULT_NAMED_ACCOUNTS, eEthereumNetwork } from '@aave/deploy-v3';

const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const HARDFORK = 'london';

const hardhatConfig = {
  gasReporter: {
    enabled: true,
  },
  paths: {
    sources: './contracts',
    tests: './test-suites',
    cache: './cache',
    artifacts: './artifacts',
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    disambiguatePaths: false,
  },
  solidity: {
    // Docs for the compiler https://docs.soliditylang.org/en/v0.8.10/using-the-compiler.html
    version: '0.8.12',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
      // evmVersion: 'london',
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
    bail: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
    forkNetwork: '1', //Network id of the network we want to fork
  },
  networks: {
    zkSyncTestnet: {
      url: 'https://testnet.era.zksync.dev',
      ethNetwork: 'goerli',
      zksync: true,
    },
    holesky: {
      url: process.env.ALCHEMY_KEY 
        ? `https://eth-holesky.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
        : process.env.INFURA_KEY 
        ? `https://holesky.infura.io/v3/${process.env.INFURA_KEY}`
        : 'https://ethereum-holesky.publicnode.com',  // fallback to public RPC
      chainId: 17000,
      accounts: process.env.MNEMONIC ? {
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        initialIndex: 3,
        count: 20
      } : [],
      verify: true
    },
    coverage: {
      url: 'http://localhost:8555',
      chainId: COVERAGE_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      zksync: false,
    },
    hardhat: {
      hardfork: HARDFORK,
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      zksync: false,
      chainId: HARDHAT_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      forking: buildForkConfig(),
      allowUnlimitedContractSize: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
    },
    ganache: {
      url: 'http://localhost:7545',
      chainId: 1337,
      accounts: {
        mnemonic: 'unlock frequent fatigue injury hour there october hundred silk much stem receive',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
      zksync: false,
    },
  },
  verify : {
    etherscan: {
      apiKey: {
        holesky: process.env.ETHERSCAN_API_KEY,
      },
    },
  },
  etherscan: {
    apiKey: {
      holesky: process.env.ETHERSCAN_API_KEY,
    }
  },
  defaultNetwork: 'zkSyncTestnet',
  namedAccounts: {
    ...DEFAULT_NAMED_ACCOUNTS,
  },
  external: {
    contracts: [
      {
        artifacts: './temp-artifacts',
        deploy: 'node_modules/@aave/deploy-v3/dist/deploy',
      },
    ],
  },
  deploymentDefaults: {
    verify: true,
    autoMine: true,
    waitConfirmations: 1,
  },
};

export default hardhatConfig;
