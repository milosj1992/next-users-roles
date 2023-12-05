import React from "react";
import axios, { AxiosResponse } from "axios"; // Import AxiosResponse

import GenericForm from "@/forms/GenericCreateForm";
import { validateRole } from "@/forms/validations";
import { roleFields } from "@/forms/fieldForm";
import { roleOptions } from "@/forms/fieldForm";
import { RoleFormValues, UserFormValues } from "@/common/types";

// Define the type for the form values

interface RoleFieldsItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "select"; // Use string literal type for type property
}

const CreateRole: React.FC = () => {
  // Define the onSubmit function with the correct return type
  const onSubmit = async (
    values: UserFormValues | RoleFormValues
  ): Promise<{ status_code: number; message: string }> => {
    try {
      let forSend;
      // Send a POST request to create a new role
      if ("short_description" in values) {
        forSend = {
          role_name: values.role_name,
          short_description: values.short_description,
        };
      }
      const response: AxiosResponse = await axios.post("/api/roles", forSend);
      return response.data; // Return the response data with the expected structure
    } catch (error) {
      console.error("Error creating role:", error);
      throw error; // Rethrow the error for error handling
    }
  };
  const textFields: RoleFieldsItem[] = roleFields as RoleFieldsItem[];

  return (
    <GenericForm
      onSubmit={onSubmit}
      initialValues={{
        role_name: "",
        short_description: "",
      }}
      validate={validateRole}
      textFields={textFields}
      roleOptions={roleOptions}
      pageRedirect={"/roles"}
    />
  );
};

export default CreateRole;
