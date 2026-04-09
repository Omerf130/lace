# lace-models

A Next.js starter with TypeScript, Module SCSS, and MongoDB Atlas.

## Stack

| Tool | Purpose |
|------|---------|
| [Next.js 15](https://nextjs.org/) (App Router) | Framework |
| TypeScript | Type safety |
| SCSS Modules | Component-scoped styles |
| [Mongoose](https://mongoosejs.com/) | MongoDB ODM |
| MongoDB Atlas | Database |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your MongoDB Atlas URI:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/lace-models?retryWrites=true&w=majority
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API route handlers
│   │   └── health/       # DB health check endpoint
│   ├── globals.scss      # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable React components
├── lib/
│   └── mongodb.ts        # MongoDB connection utility (cached)
├── models/               # Mongoose models
├── styles/
│   ├── variables.scss    # Design tokens (colors, spacing, typography…)
│   └── mixins.scss       # SCSS utility mixins
└── types/
    └── index.ts          # Shared TypeScript types
```

## Using SCSS Modules

Every component can have a co-located `.module.scss` file:

```tsx
import styles from "./Button.module.scss";

export function Button({ children }: { children: React.ReactNode }) {
  return <button className={styles.button}>{children}</button>;
}
```

Import shared variables in any module file:

```scss
@use "@/styles/variables" as *;
@use "@/styles/mixins" as *;

.button {
  background: $color-primary;
  padding: $space-2 $space-4;
  border-radius: $border-radius-md;
}
```

## Adding a Mongoose Model

Create a file in `src/models/`, for example `src/models/Example.ts`:

```ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IExample {
  name: string;
  createdAt: Date;
}

const ExampleSchema = new Schema<IExample>(
  { name: { type: String, required: true } },
  { timestamps: true }
);

export const Example = models.Example ?? model<IExample>("Example", ExampleSchema);
```

## API Health Check

```
GET /api/health
```

Returns `{ "success": true, "data": { "db": "connected" } }` when the database connection is healthy.
