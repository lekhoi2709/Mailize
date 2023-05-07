# Mailize

## Installation

Clone this repo then open the terminal. Move to express and mailize and install all dependencies in both folders:

```bash
npm install
```

- In mailize folder
  create a .env.local file

```bash
#./.env.local

NEXTAUTH_SECRET=#anything
NEXTAUTH_URL=http://localhost:3000/
NEXT_PUBLIC_DATABASE_URL=http://localhost:8080
```

Then run `npm run dev` to start the frontend in development

- In express folder

create a .env file

```bash
#./.env

NODE_ENV="development"
SECRET=#anything
MONGO_URL="mongodb://localhost:27017"
```

Then run `npm run dev` to start backend API in development

Finally go to `http://localhost:3000` to use the app
