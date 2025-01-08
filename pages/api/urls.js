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

const fetchActivePendingListings = async () => {
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

  const [listAgentListings, coListAgentListings] = await Promise.all([
    fetchByListAgent(),
    fetchByCoListAgent()
  ]);

  allListings = [...listAgentListings, ...coListAgentListings];

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
      ListingKey: item.ListingKey,
      Media: item.Media,
      status: item.StandardStatus.toLowerCase()
    }));
};

const fetchClosedListings = async () => {
  const mainAgents = ['Sheri Skora', 'Kristin Leon', 'Kelli Mullen', 'Kristin Kuntz'];
  const coAgents = ['Connie Redman', 'kelli Welch'];
  const status = 'Closed';
  const dateToSearchBefore = '2021-01-01T15:10:07.903Z'; // Adjust as needed

  let allListings = [];

  const fetchByAgent = async (agent) => {
    const params = {
      TableName: 'Listings',
      IndexName: 'ListAgentFullName-index',
      KeyConditionExpression: 'ListAgentFullName = :agent',
      FilterExpression: 'StandardStatus = :status',
      ExpressionAttributeValues: {
        ':agent': agent,
        ':status': status,
      },
    };
    const data = await docClient.send(new QueryCommand(params));
    return data.Items || [];
  };

  for (const agent of mainAgents) {
    const listings = await fetchByAgent(agent);
    allListings = allListings.concat(listings);
  }

  allListings = allListings.filter(item => {
    const listAgent = item.ListAgentFullName;
    const coListAgent = item.CoListAgentFullName;

    return mainAgents.includes(listAgent) &&
      (mainAgents.includes(coListAgent) || coAgents.includes(coListAgent)) ||
      mainAgents.includes(coListAgent) && coAgents.includes(listAgent);
  });

  allListings = allListings.filter(item =>
    new Date(item.ModificationTimestamp) > new Date(dateToSearchBefore)
  );

  const groupedByProperty = allListings.reduce((acc, item) => {
    const propertyKey = item.UnparsedAddress;
    if (!acc[propertyKey] || new Date(item.ModificationTimestamp) > new Date(acc[propertyKey].ModificationTimestamp)) {
      acc[propertyKey] = item;
    }
    return acc;
  }, {});

  return Object.values(groupedByProperty)
    .sort((a, b) => new Date(b.CloseDate || b.SoldDate) - new Date(a.CloseDate || a.SoldDate))
    .map(item => ({
      ListingKey: item.ListingKey,
      Media: item.Media,
      status: item.StandardStatus.toLowerCase()
    }));
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [activePendingListings, closedListings] = await Promise.all([
        fetchActivePendingListings(),
        fetchClosedListings()
      ]);

      res.status(200).json({
        ActivePendingListings: activePendingListings,
        ClosedListings: closedListings
      });
    } catch (error) {
      console.error("Error fetching data from DynamoDB:", error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}