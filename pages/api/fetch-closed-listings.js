// pages/api/fetch-closed-listings.js

const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const agents = ['Sheri Skora', 'Kristin Leon', 'Connie Redman']; // Ensure these names are correct
const status = 'Closed';  // We are only interested in 'Closed' listings

const fetchClosedListings = async (startKeys) => {
  let allItems = [];
  let combinedLastEvaluatedKeys = {};

  // Set to keep track of pairs already processed
  const processedPairs = new Set();

  for (let i = 0; i < agents.length; i++) {
    for (let j = 0; j < agents.length; j++) {
      if (i !== j) {
        const coAgent = agents[i];
        const agent = agents[j];

        const pairKey = `${coAgent}-${agent}`;
        const reversePairKey = `${agent}-${coAgent}`;

        // Check forward combination
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);

          let lastEvaluatedKey = startKeys ? startKeys[pairKey] : null;
          const params = {
            TableName: 'Listings',
            IndexName: 'CoListAgentFullName-ListAgentFullName-index', // Ensure you have this GSI
            KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
            FilterExpression: 'StandardStatus = :status',
            ExpressionAttributeValues: {
              ':status': { S: status },
              ':coAgent': { S: coAgent },
              ':agent': { S: agent },
            },
            ExclusiveStartKey: lastEvaluatedKey,
          };

          try {
            const data = await client.send(new QueryCommand(params));
            if (data.Items) {
              allItems = allItems.concat(data.Items);
            }
            if (data.LastEvaluatedKey) {
              combinedLastEvaluatedKeys[pairKey] = data.LastEvaluatedKey;
            }
          } catch (err) {
            console.error('Error querying:', err);
            throw err;
          }
        }

        // Check reverse combination
        if (!processedPairs.has(reversePairKey)) {
          processedPairs.add(reversePairKey);

          let lastEvaluatedKey = startKeys ? startKeys[reversePairKey] : null;
          const params = {
            TableName: 'Listings',
            IndexName: 'CoListAgentFullName-ListAgentFullName-index', // Ensure you have this GSI
            KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
            FilterExpression: 'StandardStatus = :status',
            ExpressionAttributeValues: {
              ':status': { S: status },
              ':coAgent': { S: agent }, // Notice the reverse here
              ':agent': { S: coAgent }, // Notice the reverse here
            },
            ExclusiveStartKey: lastEvaluatedKey,
          };

          try {
            const data = await client.send(new QueryCommand(params));
            if (data.Items) {
              allItems = allItems.concat(data.Items);
            }
            if (data.LastEvaluatedKey) {
              combinedLastEvaluatedKeys[reversePairKey] = data.LastEvaluatedKey;
            }
          } catch (err) {
            console.error('Error querying:', err);
            throw err;
          }
        }
      }
    }
  }

  console.log('Returning items with combinedLastEvaluatedKeys:', combinedLastEvaluatedKeys);

  return {
    items: allItems,
    lastEvaluatedKey: Object.keys(combinedLastEvaluatedKeys).length > 0 ? combinedLastEvaluatedKeys : null,
  };
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { startKey } = req.query;
      const startKeyParsed = startKey ? JSON.parse(decodeURIComponent(startKey)) : undefined;
      const { items, lastEvaluatedKey } = await fetchClosedListings(startKeyParsed);

      res.status(200).json({ items, lastEvaluatedKey });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
