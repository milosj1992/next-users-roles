import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import { useRouter } from "next/router";

import { RoleFormValues, UserFormValues } from "@/common/types";
import { UserErrors, RoleErrors } from "./validations";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormHelperText, Grid, Paper, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

interface TextFieldsItem {
  id: string;
  name: string;
  label: string;
  type: "text" | "select";
  text?: string;
}

interface GenericFormProps {
  onSubmit: (
    values: RoleFormValues | UserFormValues
  ) => Promise<{ data: { status_code: number; message: string } }>;
  initialValues: RoleFormValues | UserFormValues;
  validate?: (
    values: RoleFormValues | UserFormValues
  ) => UserErrors | RoleErrors;
  roleOptions: string[];
  textFields: TextFieldsItem[];
  pageRedirect: "/roles" | "/users";
}
const GenericUpdateForm: React.FC<GenericFormProps> = ({
  onSubmit,
  initialValues,
  validate,
  roleOptions,
  textFields,
  pageRedirect,
}) => {
  const router = useRouter();
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (values: RoleFormValues | UserFormValues) => {
    try {
      setTimeout(async () => {
        const response = await onSubmit(values);

        if (
          response.data.status_code >= 200 &&
          response.data.status_code <= 299
        ) {
          router.push(pageRedirect);
          // Delay for 2000 milliseconds (2 seconds), you can adjust this value as needed
        }
        else if(response.data.status_code===400){
          setValidationError("Role name must be unique");
        }
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Paper style={{ padding: 16 }}>
            <Grid container alignItems="flex-start" spacing={2}>
              {textFields.map((item) => (
                <Grid item xs={12} key={item.id}>
                  {item.type !== "select" ? (
                    <Field name={item.name}>
                      {({ input, meta }) => (
                        <TextField
                          {...input}
                          label={item.label}
                          type={item.text}
                          fullWidth
                          error={meta.touched && meta.error !== undefined ||item.name==="role_name" && validationError !==null}
                          helperText={meta.touched && meta.error ||item.name==="role_name" && validationError}
                             />
                      )}
                    </Field>
                  ) : item.type === "select" ? (
                    <Field name={item.name}>
                      {({ input, meta }) => (
                        <div style={{ width: "200px" }}>
                          {" "}
                          {/* Adjust the width as needed */}
                          <Select
                            {...input}
                            fullWidth
                            displayEmpty
                            error={meta.touched && meta.error !== undefined}
                          >
                     

                            <MenuItem value="">
                              <em
                                style={{
                                  color:
                                    meta.touched && meta.error
                                      ? "#f44336"
                                      : "inherit",
                                }}
                              >
                                Select a {item.label}
                              </em>
                            </MenuItem>
                            {roleOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText
                            style={{ color: "#f44336", marginLeft: "14px" }}
                          >
                            {meta.touched && meta.error}
                          </FormHelperText>
                        </div>
                      )}
                    </Field>
                  ) : null}
                </Grid>
              ))}
              <Grid item xs={12}>
                {" "}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting || pristine}
                >
                  {pageRedirect === "/users" ? "Update User" : "Update Role"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      )}
    />
  );
};

export default GenericUpdateForm;
