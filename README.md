# CyberGame Hub - Blockchain Gaming Platform

A hackathon-ready blockchain gaming platform featuring NFT integration, built with React, TypeScript, and Web3 technologies.

## Project Overview

CyberGame Hub is a cyberpunk-themed blockchain gaming platform that combines casual gaming with NFT rewards. Players can participate in games like CyberFlip to win NFT rewards and trade them in the integrated NFT marketplace.

## Technical Architecture

### Frontend Architecture
- React with TypeScript for UI components
- Shadcn/UI for styled components
- Web3.js for blockchain interactions
- TanStack Query for state management
- Wouter for routing

### Backend Architecture
- Express.js server
- PostgreSQL database with Drizzle ORM
- WebSocket integration for real-time updates

### Blockchain Integration
- MetaMask wallet connection
- Smart contract interaction for NFT minting
- Cross-chain NFT transfers using GMP SDK

## Features and Pages

### Home Page (/)
- Wallet connection interface
- Navigation to Games and NFT Gallery
- SDK implementation details
- How to play guide

### Game Page (/game)
- CyberFlip game implementation
- Analog Watch SDK integration for precise timing
- NFT reward system
- Real-time game state management

### NFT Gallery (/nft)
- Global NFT marketplace
- Personal NFT collection
- NFT creation interface
- Cross-chain transfer capabilities

## Integration of Analog GMP and Analog Watch

### Analog GMP
We have integrated the Analog GMP (General Message Passing) SDK to facilitate cross-chain messaging and asset bridging within our application. This allows for seamless interactions between different blockchain networks, enabling users to send messages and transfer assets across chains.

**Usage**:
- **Cross-Chain Messaging**: The `sendCrossChainMessage` function allows the application to send messages to a specified destination on a different blockchain network.
- **Asset Bridging**: The GMP SDK enables the transfer of assets, such as NFTs, across different blockchains, enhancing the trading experience.

### Analog Watch
The Analog Watch SDK has been implemented to provide real-time data indexing and querying capabilities. This allows our application to fetch and display data from multiple smart contracts efficiently.

**Usage**:
- **Data Fetching**: The `fetchDataFromWatch` function retrieves data from a specified view in the Watch service, allowing the application to present up-to-date information to users.
- **Event Data Support**: The Watch SDK supports listening for events emitted by smart contracts, enabling responsive and interactive user experiences.

By leveraging both Analog GMP and Analog Watch, our project enhances its functionality, providing users with a robust and seamless experience in managing and trading NFTs across different blockchain networks.

## SDK Integrations

### Analog Watch SDK
- Implementation: Used in CyberFlip.tsx
- Features:
  - Timer synchronization
  - High-precision intervals
  - Animation frame management
- Purpose: Ensures fair and accurate game timing

### GMP SDK (General Message Passing)
- Implementation: Used in NFTGallery.tsx
- Features:
  - Cross-chain messaging
  - Asset bridging
  - Transaction verification
- Purpose: Enables seamless NFT trading across different blockchain networks

## Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - DATABASE_URL
   - Other PostgreSQL configurations
4. Run development server:
   ```bash
   npm run dev
   ```

## Technology Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- Shadcn/UI
- Web3.js
- TanStack Query

### Backend
- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- WebSocket

### Blockchain
- Ethereum
- MetaMask
- Smart Contracts
- GMP SDK
- Analog Watch SDK

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and configurations
│   │   └── hooks/        # Custom React hooks
├── server/
│   ├── routes/          # API endpoints
│   └── db/             # Database configurations
└── contracts/          # Smart contracts (if applicable)
```

## Contributing

This project was created for hackathon purposes. Feel free to fork and modify according to your needs.

## License

MIT License
