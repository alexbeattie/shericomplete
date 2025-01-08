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
    FilterExpression: '#StandardStatus IN (:statuses) AND #timestamp > :date',
    ExpressionAttributeNames: {
      '#ListAgentFullName': 'ListAgentFullName',
      '#StandardStatus': 'StandardStatus',
      '#timestamp': 'ModificationTimestamp',
    },
    ExpressionAttributeValues: {
      ':agent': agent,
      ':statuses': STATUSES,
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

    const uniqueItemsMap = new Map();
    items.forEach(item => {
      uniqueItemsMap.set(item.ListingId, item);
    });

    const uniqueItems = Array.from(uniqueItemsMap.values());
    uniqueItems.sort((a, b) => b.ListPrice - a.ListPrice);
    return uniqueItems;
  } catch (error) {
    console.error("Error fetching data from DynamoDB:", error);
    throw new Error('Error fetching data from DynamoDB');
  }
};

async function fetchSingleListing(id) {
  console.log(`Fetching single listing with id: ${id}`);
  const params = {
    TableName: 'Listings',
    KeyConditionExpression: 'ListingKey = :id',
    ExpressionAttributeValues: {
      ':id': id
    },
    ScanIndexForward: false,
    Limit: 1
  };

  const command = new QueryCommand(params);

  try {
    const data = await client.send(command);
    if (!data.Items || data.Items.length === 0) {
      console.log(`No listing found for id: ${id}`);
      throw new Error('Listing not found');
    }
    return data.Items;
  } catch (error) {
    console.error(`Error fetching listing with id ${id}:`, error);
    throw error;
  }
}

export default async function handler(req, res) {
  const { id, statuses } = req.query;
  const AGENTS = ['Sheri Skora', 'Kristin Leon', 'Connie Redman', 'Kelli Mullen', 'Abby Frick', 'Kristin Kuntz'];
  const STATUSES = statuses ? statuses.split(',') : ['Active', 'Pending', 'Closed'];
  const dateToSearchBefore = new Date().toISOString();

  console.log(`Received request with id: ${id}, statuses: ${statuses}`);

  try {
    let items;
    if (id) {
      items = await fetchSingleListing(id);
    } else {
      items = await fetchListings(AGENTS, STATUSES, dateToSearchBefore);
    }

    const mappedItems = items.map((item) => ({
      ...item,
      Latitude: item.Latitude ? parseFloat(item.Latitude) : null,
      Longitude: item.Longitude ? parseFloat(item.Longitude) : null,
    }));

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json({ Items: mappedItems });
  } catch (error) {
    console.error('Error in handler:', error);
    if (error.message === 'Listing not found') {
      res.status(404).json({ error: 'Listing not found' });
    } else if (error.name === 'ValidationException') {
      res.status(400).json({ error: 'Invalid request parameters' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}