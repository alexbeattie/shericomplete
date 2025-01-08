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

const fetchListings = async (agents, statuses, dateToSearchBefore) => {
  const fetchByListAgent = async () => {
    const queries = agents.flatMap(agent =>
      statuses.map(status => ({
        TableName: 'Listings',
        IndexName: 'ListAgentFullName-index',
        KeyConditionExpression: 'ListAgentFullName = :agent',
        FilterExpression: 'StandardStatus = :status AND ModificationTimestamp > :date',
        ExpressionAttributeValues: {
          ':agent': agent,
          ':status': status,
          ':date': dateToSearchBefore,
        },
      }))
    );
    const results = await Promise.all(queries.map(params => docClient.send(new QueryCommand(params))));
    return results.flatMap(result => result.Items || []);
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
            FilterExpression: 'StandardStatus IN (:statuses) AND ModificationTimestamp > :date',
            ExpressionAttributeValues: {
              ':coAgent': coAgent,
              ':agent': agent,
              ':statuses': statuses,
              ':date': dateToSearchBefore,
            },
          };
          const data = await docClient.send(new QueryCommand(params));
          if (data.Items) {
            listings = listings.concat(data.Items);
          }
        }
      }
    }
    return listings;
  };

  const [listAgentListings, coListAgentListings] = await Promise.all([
    fetchByListAgent(),
    fetchByCoListAgent()
  ]);

  const allListings = [...listAgentListings, ...coListAgentListings];

  const groupedByProperty = allListings.reduce((acc, item) => {
    const propertyKey = item.UnparsedAddress;
    if (!acc[propertyKey] || new Date(item.ModificationTimestamp) > new Date(acc[propertyKey].ModificationTimestamp)) {
      acc[propertyKey] = item;
    }
    return acc;
  }, {});

  return Object.values(groupedByProperty)
    .sort((a, b) => b.ListPrice - a.ListPrice)
    .map(item => ({
      ...item,
      status: item.StandardStatus.toLowerCase(),
      Latitude: item.Latitude ? parseFloat(item.Latitude) : null,
      Longitude: item.Longitude ? parseFloat(item.Longitude) : null,
    }));
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { agents, statuses, date } = req.query;

    const AGENTS = agents ? agents.split(',') : ['Sheri Skora', 'Kristin Leon', 'Connie Redman', 'Kelli Mullen', 'Kristin Kuntz'];
    const STATUSES = statuses ? statuses.split(',') : ['Active', 'Pending', 'Closed'];
    const dateToSearchBefore = date || '2023-01-01T15:10:07.903Z';

    try {
      const listings = await fetchListings(AGENTS, STATUSES, dateToSearchBefore);
      res.setHeader('Cache-Control', 'no-cache, no-store');
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