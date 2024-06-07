// pages/api/available-route.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const fetchListings = async (AGENTS, STATUSES) => {
  const getQueryParams = (field, agent, status) => ({
    TableName: 'Listings',
    IndexName: 'StandardStatus-ModificationTimestamp-index',
    KeyConditionExpression: '#status = :status',
    FilterExpression: `${field} = :agent`,
    ExpressionAttributeNames: {
      '#status': 'StandardStatus',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':status': status,
    },
    ProjectionExpression: 'ListingKey, ModificationTimestamp, StandardStatus, ListAgentFullName, CoListAgentFullName, Media, UnparsedAddress, Latitude, Longitude, ListPrice, PublicRemarks, BathroomsFull',
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

  const queries = AGENTS.flatMap(agent =>
    STATUSES.flatMap(status => [
      getQueryParams('ListAgentFullName', agent, status),
      getQueryParams('CoListAgentFullName', agent, status),
    ])
  );

  try {
    const results = await Promise.all(
      queries.map(params => fetchAllItems(params))
    );

    const items = results.reduce((acc, data) => acc.concat(data), []);
    items.sort((a, b) => b.ListPrice - a.ListPrice);
    return Array.from(new Map(items.map(item => [item.ListingKey, item])).values());
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    throw new Error('Error fetching data from DynamoDB');
  }
};

export default async function handler(req, res) {
  const AGENTS = ['Sheri Skora', 'Kristin Kuntz', 'Kristin Leon'];
  const STATUSES = ['Active', 'Pending'];

  try {
    const items = await fetchListings(AGENTS, STATUSES);
    res.status(200).json({ Items: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
