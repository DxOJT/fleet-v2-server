import { GraphQLClient } from "graphql-request";
import './dotenv';

export const client = new GraphQLClient(process.env.HASURA_HTTP_URL, {
  headers: { "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET },
});
