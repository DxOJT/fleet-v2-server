import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { gql } from 'graphql-request';
import { client } from './client';
import { generateJWT } from './jwt';

import './dotenv';
import authenticateToken from './middlewares/auth';

const app = express.Router();

app.post('/register', authenticateToken, async (req: Request, res: Response) => {
  const { email, password, role, employee_id } = req.body as Record<string, string>;
   
  // In production app, you would check if user is already registered
  // We skip that in this tutorial for the sake of time

  // We insert the user using a mutation
  // Note that we salt and hash the password using bcrypt
  // @ts-ignore
  await client.request(
    gql`
      mutation registerUser($user: user_insert_input!) {
        insert_user_one(object: $user) {
          id
          role
          employee_id
          userEmployee {
            first_name
            middle_name
            last_name
          }
        }
      }
    `,
    {
      user: {
        email,
        password: await bcrypt.hash(password, 10),
        role,
        employee_id,
      },
    },
  );

  res.send({
    email,
    // token: generateJWT({
    //   defaultRole: user.role,
    //   allowedRoles: [user.role],
    //   otherClaims: {
    //     'X-Hasura-User-Id': user.id,
    //     employeeFirstName: user.userEmployee.first_name,
    //     employeeMiddleName: user.userEmployee.middle_name,
    //     employeeLastName: user.userEmployee.last_name,
    //     employeeId: user.employee_id,
    //   },
    // }),
  });
});

app.post('/updateUser', authenticateToken, async (req: Request, res: Response) => {
  const { password, userId } = req.body as Record<string, string>;
   
  // In production app, you would check if user is already registered
  // We skip that in this tutorial for the sake of time

  // We insert the user using a mutation
  // Note that we salt and hash the password using bcrypt
  // @ts-ignore
  await client.request(
    gql`
      mutation MyMutation($id: uuid!, $password: String!) {
        update_user_by_pk(pk_columns: {id: $id}, _set: {password: $password}) {
          password
          email
          employee_id
          id
          role
        }
      }
    `,
    {
      id: userId,
      password: await bcrypt.hash(password, 10),
    },
  );

  res.send({
    userId,
  });
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as Record<string, string>;
  console.log(req.body);

  //@ts-ignore
  let { user } = await client.request(
    gql`
      query getUserByEmail($email: String!) {
        user(where: { email: { _eq: $email } }) {
          id
          password
          role
          employee_id
          userEmployee {
            first_name
            middle_name
            last_name
          }
        }
      }
    `,
    {
      email,
    },
  );

  // Since we filtered on a non-primary key we got an array back
  user = user[0];

  if (!user) {
    res.sendStatus(401);
    return;
  }

  // Check if password matches the hashed version
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    res.send({
      token: generateJWT({
        defaultRole: user.role,
        allowedRoles: [user.role],
        otherClaims: {
          'X-Hasura-User-Id': user.id,
          employeeFirstName: user.userEmployee.first_name,
          employeeMiddleName: user.userEmployee.middle_name,
          employeeLastName: user.userEmployee.last_name,
          employeeId: user.employee_id,
        },
      }),
    });
  } else {
    res.sendStatus(401);
  }
});
export default app;
