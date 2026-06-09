# PictwoChat_Backend
<img src="assets/PictwoChat Banner.png" alt="PictwoChat Banner"/>

A small chatting app inspired by Nintendo DS Pictochat.

## Setup
### Prerequisites
- Node.js (recommended 24+)
- MongoDB instance (Atlas for example)

### .env
Copy the `.env.example` file, rename it to `.env`, and add the required keys, such as the MongoDB settings, the JWT secret and the Frontend URL for CORS.

### Running
1. Run `npm install` to install dependencies.
2. Run `npm run dev` to run a local dev instance. Server will restart if any change is detected.

## Testing
Tests are ran using the vitest library and can be found in the `./tests` folder.  
Those can be run using the `npm run test` command.

## Hierarchy
```py
📁 <root>
├── 📁 schema               # GraphQL schema files 
├── 📁 src                  
│   ├── 📄 resolvers.js     # File containing all resolvers references
│   └── 📁 resolvers        # Resolvers for each app element
├── 📄 index.js             # Main entry point of the app
└── 📄 README.md            # The file you are literally looking at right now.
```