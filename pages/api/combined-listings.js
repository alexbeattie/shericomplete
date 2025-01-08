// pages/api/combined-listings.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const fetchCombinedListings = async () => {
  const agents = ['Sheri Skora', 'Kristin Leon', 'Connie Redman', 'Kelli Mullen'];
  const statuses = ['Active', 'Pending'];
  const dateToSearchBefore = '2023-05-24T15:10:07.903Z'; // Adjust as needed

  let allListings = [];

  const fetchByListAgent = async () => {
    const queries = agents.map(agent => ({
      TableName: 'Listings',
      IndexName: 'ListAgentFullName-index',
      KeyConditionExpression: 'ListAgentFullName = :agent',
      FilterExpression: 'StandardStatus IN (:status1, :status2)',
      ExpressionAttributeValues: {
        ':agent': agent,
        ':status1': statuses[0],
        ':status2': statuses[1],
      },
    }));

    const results = await Promise.all(queries.map(params => docClient.send(new QueryCommand(params))));
    return results.flatMap(result =>
      result.Items ? result.Items.filter(item =>
        new Date(item.ModificationTimestamp) > new Date(dateToSearchBefore)
      ) : []
    );
  };

  const fetchByCoListAgent = async () => {
    let listings = [];
    for (const coAgent of agents) {
      for (const agent of agents) {
        if (coAgent !== agent) {
          const params = {
            TableName: 'Listings',
            IndexName: 'CoListAgentFullName-ListAgentFullName-index',
            KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
            FilterExpression: 'StandardStatus IN (:status1, :status2)',
            ExpressionAttributeValues: {
              ':coAgent': coAgent,
              ':agent': agent,
              ':status1': statuses[0],
              ':status2': statuses[1],
            },
          };
          const data = await docClient.send(new QueryCommand(params));
          if (data.Items) {
            listings = listings.concat(data.Items.filter(item =>
              new Date(item.ModificationTimestamp) > new Date(dateToSearchBefore)
            ));
          }
        }
      }
    }
    return listings;
  };

  // Fetch both types of listings
  const [listAgentListings, coListAgentListings] = await Promise.all([
    fetchByListAgent(),
    fetchByCoListAgent()
  ]);

  allListings = [...listAgentListings, ...coListAgentListings];

  // Group listings by a unique property identifier (e.g., address or MLS number)
  // and keep the most recent listing for each property
  const groupedByProperty = allListings.reduce((acc, item) => {
    const propertyKey = item.UnparsedAddress; // or use MLS number if available
    if (!acc[propertyKey] || new Date(item.ModificationTimestamp) > new Date(acc[propertyKey].ModificationTimestamp)) {
      acc[propertyKey] = item;
    }
    return acc;
  }, {});

  // Convert back to array, sort by ListPrice, and add the status property
  return Object.values(groupedByProperty)
    .sort((a, b) => b.ListPrice - a.ListPrice)
    .map(item => ({
      ...item,
      status: item.StandardStatus.toLowerCase()
    }));
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const listings = await fetchCombinedListings();
      res.status(200).json({ Items: listings });
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}