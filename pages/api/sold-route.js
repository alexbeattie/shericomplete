import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const fetchListings = async (AGENTS, STATUSES, dateToSearchBefore) => {
  const getQueryParams = (agent) => ({
    TableName: 'Listings',
    IndexName: 'ListAgentFullName-index',
    KeyConditionExpression: 'ListAgentFullName = :agent',
    FilterExpression: 'StandardStatus = :closedStatus AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':closedStatus': STATUSES[0],
      ':date': dateToSearchBefore,
    },
  });

  const getCoAgentQueryParams = (agent) => ({
    TableName: 'Listings',
    IndexName: 'CoListAgentFullName-ListAgentFullName-index',
    KeyConditionExpression: 'CoListAgentFullName = :agent',
    FilterExpression: 'StandardStatus = :closedStatus AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':closedStatus': STATUSES[0],
      ':date': dateToSearchBefore,
    },
  });

  const fetchAllItems = async (params, lastEvaluatedKey = null) => {
    let items = [];
    let currentLastEvaluatedKey = lastEvaluatedKey;
    do {
      const queryParams = { ...params };
      if (currentLastEvaluatedKey) {
        queryParams.ExclusiveStartKey = currentLastEvaluatedKey;
      }
      const command = new QueryCommand(queryParams);
      const data = await client.send(command);
      if (data && data.Items) {
        items = items.concat(data.Items);
        currentLastEvaluatedKey = data.LastEvaluatedKey;
      } else {
        currentLastEvaluatedKey = null;
      }
    } while (currentLastEvaluatedKey);
    return items;
  };

  try {
    const agentQueries = AGENTS.map(agent => fetchAllItems(getQueryParams(agent)));
    const coAgentQueries = AGENTS.map(agent => fetchAllItems(getCoAgentQueryParams(agent)));
    const results = await Promise.all([...agentQueries, ...coAgentQueries]);

    const items = results.reduce((acc, data) => acc.concat(data), []);
    items.sort((a, b) => b.ListPrice - a.ListPrice);

    // Remove duplicates by ListPrice
    return Array.from(new Map(items.map(item => [item.ListingKey, item])).values());
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    throw new Error('Error fetching data from DynamoDB');
  }
};

export default async function handler(req, res) {
  const AGENTS = ['Sheri Skora', 'Kristin Leon', 'Kelli Mullen', 'Abby Frick', 'Kristin Kuntz Leon'];
  const STATUSES = ['Closed'];
  const dateToSearchBefore = '2022-01-01T00:00:00.000Z';

  try {
    const items = await fetchListings(AGENTS, STATUSES, dateToSearchBefore);
    res.status(200).json({ Items: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
