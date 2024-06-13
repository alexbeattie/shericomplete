// pages/api/fetch-listings.js

const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const agents = ['Sheri Skora', 'Kristin Leon', 'Carrie Redman'];
const statuses = ['Active', 'Closed', 'Pending'];

const fetchListings = async () => {
  let listings = [];

  // Loop through each combination of agents for CoListAgent and ListAgent
  for (const coAgent of agents) {
    for (const agent of agents) {
      if (coAgent !== agent) {
        const params = {
          TableName: 'Listings',
          IndexName: 'CoListAgentFullName-ListAgentFullName-index',
          KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
          FilterExpression: 'StandardStatus IN (:status1, :status2, :status3)',
          ExpressionAttributeValues: {
            ':coAgent': { S: coAgent },
            ':agent': { S: agent },
            ':status1': { S: statuses[0] },
            ':status2': { S: statuses[1] },
            ':status3': { S: statuses[2] },
          }
        };

        try {
          const data = await client.send(new QueryCommand(params));
          if (data.Items) {
            listings = listings.concat(data.Items);
          }
        } catch (err) {
          console.error(`Error querying for ${coAgent} and ${agent}:`, err);
          console.log("Full error response:", err);
        }
      }
    }
  }

  return listings;
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const listings = await fetchListings();
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
