# README - API - MedVet

This is the backend of the MedVet. It provides the server logic for the application and is configured to run it.

## Prerequisites

Before you begin, you'll need to have the following installed on your machine:

- NodeJs: [Node Installation](https://nodejs.org/en/download/current)

## Environment Setup

1. Clone this repository on your machine:

   ```bash
   git clone https://github.com/rafaelsoutoo/API-med-vet
   ```

2. Navigate to the backend directory:

   ```bash
   cd API-med-vet
   ```

3. Create a `.env` file based on the provided `.env.example` template and configure the necessary environment variables such as `DATABASE_URL`, `NODE_ENV` and `JWT_SECRET`.

   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file with the appropriate settings for your environment.

`mongodb+srv://username:<password>@<database-name>.msilvm8.mongodb.net/<database-name>?retryWrites=true&w=majority&appName=<database-name>`

Remember to change the fields

- username;
- password;
- database-name;

with data from your database, you can see your data in your mongoAtlas login

## Running the Backend

Once the environment is set up, you can start the backend using Docker Compose.

1. In the root directory of the project, run the following command:

```bash
  npm install
```

```bash
  npx prisma generate
```

```bash
  npm run dev.
```

2. After successful initialization, you'll see messages indicating that the backend is running. You can access it at `http://localhost:3333`.

## Stopping the Backend

To stop the backend execution, you can press `Ctrl + C` in the terminal where API is running:

This will shut down the backend.
