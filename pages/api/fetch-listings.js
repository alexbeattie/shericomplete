// pages/api/fetch-listings.js
const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

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
          ExpressionAttributeValues: marshall({
            ':coAgent': coAgent,
            ':agent': agent,
            ':status1': statuses[0],
            ':status2': statuses[1],
            ':status3': statuses[2],
          }),
        };

        try {
          const data = await client.send(new QueryCommand(params));
          if (data.Items) {
            listings = listings.concat(data.Items.map(item => unmarshall(item)));
          }
        } catch (err) {
          console.error(`Error querying for ${coAgent} and ${agent}:`, err);
          console.log("Full error response:", err);
        }
      }
    }
  }

  // Group listings by ListPrice and keep only the most recently modified item
  const groupedByPrice = listings.reduce((acc, item) => {
    if (!acc[item.ListPrice] || new Date(item.ModificationTimestamp) > new Date(acc[item.ListPrice].ModificationTimestamp)) {
      acc[item.ListPrice] = item;
    }
    return acc;
  }, {});

  // Convert the grouped object back to an array and sort by ListPrice
  const mostRecentListings = Object.values(groupedByPrice).sort((a, b) => b.ListPrice - a.ListPrice);

  return mostRecentListings;
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