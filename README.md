This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma
### Configure database access
Create a `.env` file in the root directory of the project and add the following environment variables:
```bash
DATABASE_URL="postgresql://postgres:xxxxxxxxxxxxxxxxx"
```
### Set up database
Migrate your database with the structure outlined in your `schema.prisma` file:
```bash
npx prisma migrate dev
```
This command did three things:

 1. It created a new SQL migration file for this migration in the prisma/migrations directory.
 2. It executed the SQL migration file against the database.
 3. It ran prisma generate under the hood (which installed the @prisma/client package and         generated a tailored Prisma Client API based on models)

### When you firstly run the project locally, you need to run the following command to generate the prisma client:
```bash
npx prisma generate
```
if you make any changes to the prisma schema, you need to run the following command to update the prisma client:
```bash
npx prisma migrate dev --name xxxx # xxxx is the name of the migration
```
## Deploy on Vercel

This project is deployed on Vercel. You can view the live version [here](https://cake-fans.vercel.app/).

## What are included in this project?
### cake list
On the homepage, there is a list of cakes. Each page contains 6 cakes.
You can click on a cake card to view more details.
#### if you want to add a new cake, you can click the icon on the bottom right corner, but login is requested

### cake detail page
Once you are in a cake detail page, you will see the cake photo on the top space and followed by some post informations.

The below are the comment list you could view, and each comment has a yummy rating betwween 1 to 5, and comment content.

If you are logged in, you can add a new comment. Also, if you are the owner of the cake, you can delete the cake by clicking the delete button on the top right corner.

### Login & Logout & Sign up
You can login by clicking the login button on the top right of the header. The login box will show up.

Also, you can logout by clicking the same button once you are logged in.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
