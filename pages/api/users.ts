import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/common/types";
import fs from "fs";

interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
}

interface UserData {
  users: User[];
  role_name:any;
  pagination: Pagination;
}

const filePath = "./public/api/users.json";

function readDataFromFile(): UserData {
  try {
    const file = fs.readFileSync(filePath, "utf8");
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Internal Server Error");
  }
}

function writeDataToFile(data: UserData): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
    throw new Error("Internal Server Error");
  }
}

function findUserById(id: number, users: User[]): User | undefined {
  return users.find((user) => user.id === id);
}

function calculateNextUserId(users: User[]): number {
  const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
  return maxId + 1;
}
interface ApiResponse<T> {
  status_code: number;
  message: string;
  data?: T; // Make data property optional
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[] | User>>
) {
  const response: ApiResponse<User[] | User> = {
    status_code: 200,
    message: "Success",
  };

  if (req.method === "GET") {
    if (req.query.id) {
      const id = parseInt(req.query.id as string, 10);
      const userData = readDataFromFile();
      console.log(userData)
      const user = findUserById(id, userData.users);

      if (user) {
        response.data = user;
      } else {
        response.status_code = 404;
        response.message = "User not found";
      }
    } else {
      const userData:any= readDataFromFile();
      response.data = userData;
    }
  } else if (req.method === "POST") {
    /**
     *  {
        "first_name": "Johnsadsa",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "role": "Admin"
      }
     */
    try {
      let users = readDataFromFile();
      const newUser: User = req.body; // Assuming you send the role data in the request body

      // Generate a new ID for the user
      const nextId = calculateNextUserId(users.users);

      // Create a new user object with the id property
      const userWithId = { ...newUser, id: nextId, created_at: new Date() };

      // Add the new user object to the JSON data
      users.users.push(userWithId);

      // Write the updated JSON data back to the file
      writeDataToFile(users);

      response.status_code = 201;
      response.data = userWithId; // Respond with the newly created user
    } catch (error) {
      console.error("Error creating user:", error);
      response.status_code = 500;
      response.message = "Internal Server Error";
    }
  } else if (req.method === "PUT") {
    try {
      let users = readDataFromFile();

      const updatedUser = req.body;
      let id = req.query.id;
      if (typeof id === "string") {
        const idFromQuery = parseInt(id);
        const userData = readDataFromFile();
        //const user = findUserById(id, userData.users);
        const usersIndex = users.users.findIndex((r) => r.id === idFromQuery);
        //   const usersIndex = findUserById(idFromQuery, userData.users);
        if (usersIndex !== -1) {
          let userId = userData.users[usersIndex].id;
          let userDate = userData.users[usersIndex].created_at;
          userData.users[usersIndex] = {
            id: userId,
            ...updatedUser,
            created_at: userDate,
          };
          writeDataToFile(userData);
          response.data = updatedUser; // Respond with the updated role
        } else {
          response.status_code = 404;
          response.message = "Role not found";
        }
      } else {
        response.status_code = 400;
        response.message = "Id not string";
      }
    } catch (error) {
      console.error("Error updating role:", error);
      response.status_code = 500;
      response.message = "Internal Server Error";
    }
  } else {
    response.status_code = 405;
    response.message = "Method Not Allowed";
  }
  res.json(response);
}
