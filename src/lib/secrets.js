import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const AWS_REGION = "us-east-2";
const STAGE = process.env.STAGE || "prod";

const ssmClient = new SSMClient({ region: AWS_REGION });

export async function getDatabaseUrl() {
  try {
    const DATABASE_URL_SSM_PARAM = `/stock-wise-api/${STAGE}/database-url`;

    const command = new GetParameterCommand({
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    });

    const paramStoreData = await ssmClient.send(command);

    return paramStoreData.Parameter.Value;
  } catch (error) {
    console.error("Error fetching database URL:", error);
    throw error;
  }
}
