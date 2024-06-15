import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1',
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});


const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = (req, res) => {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

    const params = {
      TableName: 'ContactFormSubmissions',
      Item: {
        id: uuidv4(),
        name,
        email,
        message,
        createdAt: new Date().toISOString(),
      },
    };

    try {
      await dynamoDb.put(params).promise();
      res.status(200).json({ message: 'Submission successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Could not submit data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
