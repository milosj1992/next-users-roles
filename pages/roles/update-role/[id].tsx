import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import GenericUpdateForm from "@/forms/GenericUpdateForm";
import axios from "axios";

import { validateRole } from "@/forms/validations";
import { roleFields } from "@/forms/fieldForm";
import { roleOptions } from "@/forms/fieldForm";
import { Role } from "@/common/types";
import { UserFormValues,RoleFormValues } from "@/common/types";

interface RoleData{
  data:Role
}

interface RoleFieldsItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "select"; // Use string literal type for type property
}

const UpdateRole: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const onSubmit = async (
    values: RoleFormValues | UserFormValues
  ): Promise<{ data: { status_code: number; message: string } }> => {
    try {
      // Send a POST request to create a new role
      const response = await axios.put(`/api/roles?id=${id}`, values);

      if (response.data.status_code === 400) {
        return { data: response.data };
      }
      if (response.data.status_code >= 200 && response.data.status_code <= 299) {
        router.push("/roles");
        return { data: response.data };
      }
      return { data: { status_code: 500, message: "Unknown error occurred" } };
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  };
  useEffect(() => {
    if (id) {
      axios.get<RoleData>(`/api/roles?id=${id}`).then((response) => {
        setRole(response.data.data);
      });
    }
  }, [id]);
  const textFields: RoleFieldsItem[] = roleFields as RoleFieldsItem[];

  return (
    <div>
      <h1>Update Role</h1>
      {role && (
        <GenericUpdateForm
          onSubmit={onSubmit}
          initialValues={{
            role_name:role.role_name,
            short_description:role.short_description
          }}
          textFields={textFields}
          validate={validateRole}
          roleOptions={roleOptions}
          pageRedirect={"/roles"}
        />
      )}
    </div>
  );
};

export default UpdateRole;
