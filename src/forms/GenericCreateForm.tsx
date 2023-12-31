import React, { useState } from "react";
import { Form, Field } from "react-final-form";

import { RoleFormValues, UserFormValues } from "@/common/types";
import { UserErrors, RoleErrors } from "./validations";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormHelperText, Grid, Paper, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

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
  ) => Promise<{ status_code: number; message: string }>;
  initialValues: RoleFormValues | UserFormValues; // Use a union type for initialValues as well
  validate?: (
    values: RoleFormValues | UserFormValues
  ) => UserErrors | RoleErrors;
  roleOptions: string[];
  textFields: TextFieldsItem[];
  pageRedirect: "/roles" | "/users";
}
const GenericCreateForm: React.FC<GenericFormProps> = ({
  onSubmit,
  initialValues,
  validate,
  roleOptions,
  textFields,
  pageRedirect,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();
  const handleSubmit = async (values: RoleFormValues | UserFormValues) => {
    try {
      const response = await onSubmit(values);

      if (response.status_code === 400) {
        setValidationError("Role name must be unique");
      } else {
        if (response.status_code >= 200 && response.status_code <= 299) {
          router.push(pageRedirect);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleInputChange = () => {
    // Clear the validation error when the user continues typing
    if (validationError) {
      setValidationError(null);
    }
  };
  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, pristine, submitting, form }) => (
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
                          error={
                            meta.touched && meta.error !== undefined
                              ? true
                              : item.name === "role_name" &&
                                validationError !== null
                          }
                          helperText={
                            (meta.touched && meta.error) ||
                            (item.name === "role_name" && validationError)
                          }
                          onChange={(e) => {
                            handleInputChange(); // Clear error on input change
                            input.onChange(e); // Update the input value
                          }}
                        />
                      )}
                    </Field>
                  ) : item.type === "select" ? (
                    <Field name={item.name}>
                      {({ input, meta }) => (
                        <div style={{ width: "200px" }}>
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
                {/* This Grid item remains full width */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting || pristine}
                >
                  {pageRedirect === "/users" ? "Create User" : "Create Role"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      )}
    />
  );
};

export default GenericCreateForm;
