import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { Role } from "@/common/types";

const filePath = "./public/api/roles.json";

function readDataFromFile(): Role[] {
  try {
    const file = fs.readFileSync(filePath, "utf8");
    return JSON.parse(file);
  } catch (error) {
    console.error("Error reading file:", error);
    throw new Error("Internal Server Error");
  }
}

function writeDataToFile(data: Role[]): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing file:", error);
    throw new Error("Internal Server Error");
  }
}

function findRoleById(id: number, roles: Role[]): Role | undefined {
  return roles.find((r) => r.id === id);
}

function isrole_nameUnique(role_name: string, roles: Role[], roleIdToExclude: number): boolean {
  return !roles.some((r) => r.role_name === role_name && r.id !== roleIdToExclude);
}

function calculateNextRoleId(roles: Role[]): number {
  const maxId = roles.reduce((max, role) => (role.id > max ? role.id : max), 0);
  return maxId + 1;
}
interface ApiResponse<T> {
  status_code: number;
  message: string;
  data?: T; // Make data property optional
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Role[] | Role>>
) {
  const response: ApiResponse<Role[] | Role> = {
    status_code: 200,
    message: "Success",
  };

  if (req.method === "GET") {
    if (req.query.id) {
      const id = parseInt(req.query.id as string, 10);
      const roles = readDataFromFile();
      const role = findRoleById(id, roles);

      if (role) {
        response.data = role;
      } else {
        response.status_code = 404;
        response.message = "Role not found";
      }
    } else {
      const roles = readDataFromFile();
      response.data = roles;
    }
  } else if (req.method === "POST") {
    try {
      const roles = readDataFromFile();
      const newRole: Role = req.body; // Assuming you send the role data in the request body

      if (!isrole_nameUnique(newRole.role_name, roles,newRole.id)) {
        response.status_code = 400;
        response.message = "role_name must be unique";
      } else {
        // Generate a new ID for the role
        const nextId = calculateNextRoleId(roles);

        // Rename the 'id' property to 'roleId' in newRole
        const { id: roleId, ...newRoleWithRenamedId } = newRole;
        
        // Create a new role object with the id property
        const roleWithId = { id: nextId, ...newRoleWithRenamedId };
        
        // Add the new role object to the JSON data
        roles.push(roleWithId);
        
        // Write the updated JSON data back to the file
        writeDataToFile(roles);
        response.status_code = 201;
        response.data = roleWithId; // Respond with the newly created role
        
      }
    } catch (error) {
      console.error("Error creating role:", error);
      response.status_code = 500;
      response.message = "Internal Server Error";
    }
  } else if (req.method === "PUT") {
    try {
      const roles = readDataFromFile();
      const updatedRole: Role = req.body;
      const idFromQuery = parseInt(req.query.id as string, 10); // Parse the query parameter as a number
      const roleIndex = roles.findIndex((r) => r.id === idFromQuery);

      if (roleIndex !== -1) {
        if (!isrole_nameUnique(updatedRole.role_name, roles,idFromQuery)) {
          response.status_code = 400;
          response.message = "role_name must be unique";
        } else {
          roles[roleIndex] = {
            ...roles[roleIndex], // Keep existing properties
            ...updatedRole, // Overwrite with new properties from req.body
          };
          writeDataToFile(roles);
          response.data = updatedRole; // Respond with the updated role
        }
      } else {
        response.status_code = 404;
        response.message = "Role not found";
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
