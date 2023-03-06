import { GraphQLClient } from "graphql-request";
import './dotenv';

export const client:any = new GraphQLClient("http://3.1.204.87:8080/v1/graphql", {
  headers: { "x-hasura-admin-secret": "t3&Ya#4OWtZJWvV70Zth71ZbFBW#tE7qURhhF&6D#UZT0zvjGT" },
});
