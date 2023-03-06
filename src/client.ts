import { GraphQLClient } from "graphql-request";
import './dotenv';

export const client:any = new GraphQLClient(process.env.HASURA_HTTP_URL, {
  headers: { "x-hasura-admin-secret": process.env.HASURA_JWT_SECRET_KEY },
});
