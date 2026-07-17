import { QueryClient } from '@tanstack/react-query';
import { createConfig, http } from '@wagmi/core';
import { walletConnect } from '@wagmi/connectors';
import { mainnet, polygon, bsc, arbitrum } from 'wagmi/chains'; // ✅ bscTestnet remove

export const queryClient = new QueryClient();

export const config = createConfig({
  appName: 'Crypto Transaction App',
  connectors: [
    walletConnect({
      projectId: 'b00311bb20f1d71b977b474eac2b7dcd',
    }),
  ],
  chains: [mainnet, polygon, bsc, arbitrum], // ✅ bscTestnet remove
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    // ✅ bscTestnet transport bhi remove
  },
});


// import { QueryClient } from '@tanstack/react-query';
// import { createConfig, http } from '@wagmi/core';
// import { walletConnect } from '@wagmi/connectors';
// import { mainnet, polygon, bsc, arbitrum, bscTestnet } from 'wagmi/chains'; // ✅ bscTestnet add kiya

// export const queryClient = new QueryClient();

// export const config = createConfig({
//   appName: 'Crypto Transaction App',
//   connectors: [
//     walletConnect({
//       projectId: 'b00311bb20f1d71b977b474eac2b7dcd',
//     }),
//   ],
//   chains: [mainnet, polygon, bsc, arbitrum, bscTestnet], // ✅ bscTestnet add kiya
//   transports: {
//     [mainnet.id]: http(),
//     [polygon.id]: http(),
//     [bsc.id]: http(),
//     [arbitrum.id]: http(),
//     [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'), // ✅ BNB Testnet RPC
//   },
// });