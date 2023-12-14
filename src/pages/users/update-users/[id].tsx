import React, { useEffect, useState } from "react";
import GenericUpdateForm from "../../../forms/GenericUpdateForm";
import axios, { AxiosResponse } from "axios";
import { validateUser } from "../../../forms/validations";
import { userFields } from "../../../forms/fieldForm";
import { roleOptions } from "../../../forms/fieldForm";
import { useRouter } from "next/router";
import { User } from "@/common/types";
import { UserFormValues,RoleFormValues } from "@/common/types";
interface UserData {
  data: User;
}

interface UserFieldsItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "select";
}

const UpdateUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const onSubmit = async (
    values: UserFormValues | RoleFormValues
  ): Promise<{ data: { status_code: number; message: string } }> => {
    try {
      // Send a POST request to create a new role
      const response: AxiosResponse = await axios.put(`/api/users?id=${id}`, values);
      if (response.data.status_code === 400) {
        return response;
      }
      if (response.data.status_code >= 200 && response.data.status_code <= 299) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        router.push("/users");
        return { data: response.data };
      }
      return { data: { status_code: 500, message: "Unknown error occurred" } };
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      axios.get<UserData>(`/api/users/?id=${id}`).then((response) => {
        const userData: User = response.data.data; // Extract the data from the response
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, [id]);

  const textFields: UserFieldsItem[] = userFields as UserFieldsItem[];

  return (
    <>
      {user && (
        <GenericUpdateForm
          onSubmit={onSubmit}
          initialValues={{
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role_name: user.role_name,
          }}
          textFields={textFields}
          validate={validateUser}
          roleOptions={roleOptions}
          pageRedirect={"/users"}
        />
      )}
    </>
  );
};

export default UpdateUser;
