const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "your-region" });

const agents = ['Sheri Skora', 'Kristin Leon', 'Carrie Redman'];
const statuses = ['Active', 'Closed', 'Pending'];

const fetchListings = async () => {
  let listings = [];

  // Loop through each combination of agents for CoListAgent and ListAgent
  for (const coAgent of agents) {
    for (const agent of agents) {
      if (coAgent !== agent) {
        const params = {
          TableName: 'Listings',
          IndexName: 'CoListAgentFullName-ListAgentFullName-index',
          KeyConditionExpression: 'CoListAgentFullName = :coAgent AND ListAgentFullName = :agent',
          FilterExpression: 'StandardStatus IN (:status1, :status2, :status3)',
          ExpressionAttributeValues: {
            ':coAgent': coAgent,
            ':agent': agent,
            ':status1': statuses[0],
            ':status2': statuses[1],
            ':status3': statuses[2],
          }
        };

        try {
          const data = await client.send(new QueryCommand(params));
          if (data.Items) {
            listings = listings.concat(data.Items);
          }
        } catch (err) {
          console.error(`Error querying for ${coAgent} and ${agent}:`, err);
          console.log("Full error response:", err);
        }
      }
    }
  }

  return listings;
};

// Example usage
fetchListings().then(listings => {
  console.log("Listings retrieved:", listings);
});
