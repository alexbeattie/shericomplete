This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## MLS Grid NextJS project | AWS DynamoDb and Lambda

This is built specifically for StellarMLS in Florida. Their MLS doesnt allow 'streaming' data, so you have to create a replica dataset on a server via a lambda function.

I did this through AWS Lambda & Node.js which pulled the requisite data from the MLS Grid and updates accordingly. There are several gotchas that you have to be careful about through the process, such as API quirks, but it is relatively straightforward.

I chose DynamodDb bc it seemed to one of the newer and scalable db technologies. There is a bit of a learning curve to it, but if you've programmed in react/next you should be good.

There is also a bit of query language in javascript to digest, but it's not difficult depending on what kind of queries/filters you are trying to accomplish. This was for 2 agents.

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## API endpoints

I did take advantage of NextJS Api handling compatability which seemed to have worked out well.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# shericomplete

# shericomplete
