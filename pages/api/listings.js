// pages/api/listings.js
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
  const getQueryParams = (agent, STATUSES, dateToSearchBefore) => ({
    TableName: 'Listings',
    IndexName: 'ListAgentFullName-index',
    KeyConditionExpression: '#ListAgentFullName = :agent',
    FilterExpression: '#StandardStatus IN (:status1, :status2) AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#ListAgentFullName': 'ListAgentFullName',
      '#StandardStatus': 'StandardStatus',
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':status1': STATUSES[0],
      ':status2': STATUSES[1],
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

      try {
        const data = await client.send(command);
        if (data && data.Items) {
          items = items.concat(data.Items);
          currentLastEvaluatedKey = data.LastEvaluatedKey;
        } else {
          currentLastEvaluatedKey = null;
        }
      } catch (error) {
        console.error('Error executing query:', error);
        throw error;
      }
    } while (currentLastEvaluatedKey);

    return items;
  };

  try {
    const queries = AGENTS.map(agent => getQueryParams(agent, STATUSES, dateToSearchBefore));
    const results = await Promise.all(queries.map(params => fetchAllItems(params)));
    const items = results.reduce((acc, data) => acc.concat(data), []);
    items.sort((a, b) => new Date(b.ModificationTimestamp) - new Date(a.ModificationTimestamp));
    return items.slice(0, 3); // Return the 3 most recently modified items
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    throw new Error('Error fetching data from DynamoDB');
  }
};

export default async function handler(req, res) {
  const AGENTS = ['Sheri Skora', 'Kristin Leon', 'Connie Redman', 'Kelli Mullen', 'Abby Frick', 'Kristin Kuntz Leon'];
  const STATUSES = ['Active', 'Pending'];
  const dateToSearchBefore = '2023-05-24T15:10:07.903Z'; // Replace with your desired date

  try {
    const items = await fetchListings(AGENTS, STATUSES, dateToSearchBefore);
    res.status(200).json({ Items: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
