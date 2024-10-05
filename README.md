# Stable Pixel

Stable Pixel is a platform for creating generative pixel art using stable diffusion. This monorepo contains the web app and the model for generating the pixel art. The web app is built using Next.js. The model is a simple [diffusers](https://pypi.org/project/diffusers/) pipeline with additional post-processing steps.

## Table of contents

- [Stable Pixel App](#stable-pixel-app)
  - [Prerequisites](#prerequisites)
    - [Dependencies](#dependencies)
    - [Environment variables](#environment-variables)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Prerequisites](#prerequisites-1)
    - [Local development](#local-development)
    - [Deployment](#deployment)
- [Stable Pixel Model](#stable-pixel-model)
  - [Prerequisites](#prerequisites-2)
    - [Dependencies](#dependencies-1)
  - [Installation](#installation-1)
  - [Usage](#usage-1)
    - [Local development](#local-development-1)
    - [Deployment](#deployment-1)

# Stable Pixel App

## Prerequisites

### Dependencies

To run the app locally, you need to have the following tools installed:

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [OrbStack](https://www.orbstack.dev)

### Environment variables

The app uses environment variables to configure all sorts of things. You can create a `.env` file in the root of the project and add the following variables:

```bash
DATABASE_URL="postgresql://postgres:evkY6Mm1OxkXSwTs@localhost:5432/stable-pixel?pgbouncer=true&connection_limit=1"
DATABASE_DIRECT_URL="postgresql://postgres:evkY6Mm1OxkXSwTs@localhost:5432/stable-pixel"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<VALUE>"
DISCORD_CLIENT_ID="<VALUE>"
DISCORD_CLIENT_SECRET="<VALUE>"
REPLICATE_API_KEY="<VALUE>"
REPLICATE_MODEL_ID="<VALUE>"
```

## Installation

To setup your local dev environment, you need to install the dependencies:

```bash
pnpm install
```

## Usage

### Local development

We're using a PostgreSQL database for this project. Therefore, you'll need to setup the database on your local machine. You can do this conveniently using this command:

```bash
pnpm run db:up
```

To start the dev server, you can use the following command:

```bash
pnpm run dev
```

### Deployment

The app gets deployed automatically to vercel when pushing to the `main` branch.

# Stable Pixel Model

The Stable Pixel model is containerized using [cog](https://cog.run) and gets deployed to [replicate](https://replicate.com).

## Prerequisites

### Dependencies

To get started, you need to install the `cog` command line tool. You can do this by running the following command:

```bash
sh <(curl -fsSL https://cog.run/install.sh)
```

## Usage

### Local development

Now you can run predictions:

```bash
pnpm run cog:run
```

In essence, this command will dockerize the model based on the provided [cog.yaml](./cog/cog.yaml) & [predict.py](./cog/predict.py) files in order to run it locally. You can then make predictions by providing additional inputs using the `-i` flag. For more information, see the [cog documentation](https://cog.run/getting-started-own-model/).

```bash
pnpm run cog:run -i prompt="a generic man with a hat"
```

### Deployment

If you want to push the model to the replicate, you can do so by running:

```bash
pnpm run cog:push
```
