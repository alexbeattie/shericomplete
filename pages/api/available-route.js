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
  const getQueryParams = (coAgent, agent) => ({
    TableName: 'Listings',
    IndexName: 'CoListAgentFullName-ListAgentFullName-index',
    KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
    FilterExpression: 'StandardStatus IN (:status1, :status2) AND StandardStatus <> :closedStatus AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':coAgent': coAgent,
      ':agent': agent,
      ':status1': STATUSES[0],
      ':status2': STATUSES[1],
      ':closedStatus': 'Closed',
      ':date': dateToSearchBefore,
    },
  });
  const getSingleAgentQueryParams = (agent) => ({
    TableName: 'Listings',
    IndexName: 'CoListAgentFullName-ListAgentFullName-index',
    KeyConditionExpression: 'CoListAgentFullName = :agent OR ListAgentFullName = :agent',
    FilterExpression: 'StandardStatus IN (:status1, :status2) AND StandardStatus <> :closedStatus AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':status1': STATUSES[0],
      ':status2': STATUSES[1],
      ':closedStatus': 'Closed',
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
      // console.log('Sending query with params:', JSON.stringify(queryParams, null, 2));
      const data = await client.send(command);
      // console.log('Received data:', JSON.stringify(data, null, 2));
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
    const queries = [
      ...AGENTS.flatMap(coAgent =>
        AGENTS.map(agent => getQueryParams(coAgent, agent))
      ),
      // ...AGENTS.map(agent => getSingleAgentQueryParams(agent)),
    ];
    const results = await Promise.all(queries.map(params => fetchAllItems(params)));
    const items = results.reduce((acc, data) => acc.concat(data), []);
    items.sort((a, b) => b.ListPrice - a.ListPrice);
    return Array.from(new Map(items.map(item => [item.ListPrice, item])).values());
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    throw new Error('Error fetching data from DynamoDB');
  }
};

export default async function handler(req, res) {
  const AGENTS = ['Sheri Skora', 'Kristin Leon', 'Connie Redman', 'Kelli Mullen', 'Abby Frick', 'Kristin Kuntz Leon'];
  const STATUSES = ['Active', 'Pending'];
  const dateToSearchBefore = '2022-01-01T00:00:00.000Z';

  try {
    const items = await fetchListings(AGENTS, STATUSES, dateToSearchBefore);
    res.status(200).json({ Items: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}