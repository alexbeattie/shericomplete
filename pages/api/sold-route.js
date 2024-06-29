// pages/api/sold-route.js
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

const fetchClosedListings = async () => {
  const mainAgents = ['Sheri Skora', 'Kristin Leon', 'Kelli Mullen', 'Kristin Kuntz', 'Connie Redman'];
  const coAgents = ['kelli Welch'];
  const status = 'Closed';
  const dateToSearchBefore = '2021-01-01T15:10:07.903Z'; // Adjust as needed

  let allListings = [];

  const fetchByListAgent = async () => {
    const queries = mainAgents.flatMap(agent => [
      ...mainAgents.map(coAgent => ({
        TableName: 'Listings',
        IndexName: 'ListAgentFullName-index',
        KeyConditionExpression: 'ListAgentFullName = :agent',
        FilterExpression: 'StandardStatus = :status AND CoListAgentFullName = :coAgent',
        ExpressionAttributeValues: {
          ':agent': agent,
          ':status': status,
          ':coAgent': coAgent,
        },
      })),
      ...coAgents.map(coAgent => ({
        TableName: 'Listings',
        IndexName: 'ListAgentFullName-index',
        KeyConditionExpression: 'ListAgentFullName = :agent',
        FilterExpression: 'StandardStatus = :status AND CoListAgentFullName = :coAgent',
        ExpressionAttributeValues: {
          ':agent': agent,
          ':status': status,
          ':coAgent': coAgent,
        },
      }))
    ]);
    const results = await Promise.all(queries.map(params => docClient.send(new QueryCommand(params))));
    return results.flatMap(result =>
      result.Items ? result.Items.filter(item =>
        new Date(item.ModificationTimestamp) > new Date(dateToSearchBefore)
      ) : []
    );
  };

  const fetchByCoListAgent = async () => {
    let listings = [];
    for (const agent of mainAgents) {
      for (const coAgent of [...mainAgents, ...coAgents]) {
        if (agent !== coAgent) {
          const params = {
            TableName: 'Listings',
            IndexName: 'CoListAgentFullName-ListAgentFullName-index',
            KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
            FilterExpression: 'StandardStatus = :status',
            ExpressionAttributeValues: {
              ':coAgent': coAgent,
              ':agent': agent,
              ':status': status,
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

  // Fetch all types of listings
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

  // Convert back to array, sort by CloseDate or SoldDate, and add the status property
  return Object.values(groupedByProperty)
    .sort((a, b) => new Date(b.CloseDate || b.SoldDate) - new Date(a.CloseDate || a.SoldDate))
    .map(item => ({
      ...item,
      status: item.StandardStatus.toLowerCase()
    }));
};

// Export the default function to handle API requests
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const listings = await fetchClosedListings();
      res.status(200).json({ Items: listings });
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      res.status(500).json({ error: 'Failed to fetch closed listings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}