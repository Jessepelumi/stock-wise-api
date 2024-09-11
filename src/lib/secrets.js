import {
  SSMClient,
  GetParameterCommand,
  PutParameterCommand,
} from "@aws-sdk/client-ssm";

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

export async function putDatabaseUrl(stage = "dev", dbUrlVal) {
  const paramStage = stage.toLowerCase();
  if (paramStage === "prod") {
    console.warn("Cannot update 'prod' environment's database URL");
    return;
  }
  if (!dbUrlVal) {
    console.warn("No database URL value provided");
    return;
  }

  try {
    const DATABASE_URL_SSM_PARAM = `/stock-wise-api/${paramStage}/database-url`;

    const command = new PutParameterCommand({
      Name: DATABASE_URL_SSM_PARAM,
      Value: dbUrlVal,
      Type: "SecureString",
      Overwrite: true,
    });

    const response = await ssmClient.send(command);

    console.log(`Database URL updated for stage: ${paramStage}`);
    return response;
  } catch (error) {
    console.error("Error updating database URL:", error);
    throw error;
  }
}
