import React from "react";
import GenericCreateForm from "../../../forms/GenericCreateForm";
import axios, { AxiosResponse } from "axios";
import { validateUser } from "../../../forms/validations";
import { userFields } from "../../../forms/fieldForm";
import { roleOptions } from "../../../forms/fieldForm";
import { RoleFormValues, UserFormValues } from "@/common/types";

interface UserFieldsItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "select";
}

const CreateUser: React.FC = () => {
  const onSubmit = async (
    values: UserFormValues | RoleFormValues
  ): Promise<{ status_code: number; message: string }> => {
    try {
      let forSend;

      if ("first_name" in values) {
        // Creating a user
        forSend = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role_name: values.role_name,
        };
      }

      // Send a POST request to create a new user or role based on the interface used
      const response: AxiosResponse = await axios.post("/api/users", forSend);
      if( response.data.status_code===201){
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return response.data;

      }
      else{
        return response.data;
      }
    } catch (error) {
      console.error("Error creating user/role:", error);
      throw error;
    }
  };

  const textFields: UserFieldsItem[] = userFields as UserFieldsItem[];

  return (
    <GenericCreateForm
      onSubmit={onSubmit}
      initialValues={{
        first_name: "",
        last_name: "",
        email: "",
        role_name: "",
      }}
      textFields={textFields}
      validate={validateUser}
      roleOptions={roleOptions}
      pageRedirect={"/users"}
    />
  );
};

export default CreateUser;
