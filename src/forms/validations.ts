export interface RoleErrors {
  role_name?: string;
  short_description?: string;
}

export const validateRole = (values: {
  role_name?: string;
  short_description?: string;
}): RoleErrors => {
  const errors: RoleErrors = {};
  if (!values.role_name) {
    errors.role_name = "Role name is required";
  } else if (!/^[a-zA-Z0-9_]+$/.test(values.role_name)) {
    errors.role_name =
      "Role name should be alphanumeric and may contain underscores";
  } else if (values.role_name.length < 2 || values.role_name.length > 16) {
    errors.role_name = "Role name must be between 2 and 16 characters";
  }

  if (
    values.short_description &&
    (values.short_description.length < 2 ||
      values.short_description.length > 50)
  ) {
    errors.short_description =
      "Short description must be between 2 and 50 characters";
  }

  return errors;
};

export interface UserErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  role_name?: string;
}

export const validateUser = (values: {
  first_name?: string;
  last_name?: string;
  email?: string;
  role_name?: string;
}): UserErrors => {
  const errors: UserErrors = {};

  if (!values.first_name) {
    errors.first_name = "First name is required";
  } else if (!/^[a-zA-Z]+$/.test(values.first_name)) {
    errors.first_name = "First name should contain only alphabetic characters";
  } else if (values.first_name.length < 2 || values.first_name.length > 20) {
    errors.first_name = "First name must be between 2 and 20 characters";
  }

  if (!values.last_name) {
    errors.last_name = "Last name is required";
  } else if (!/^[a-zA-Z]+$/.test(values.last_name)) {
    errors.last_name = "Last name should contain only alphabetic characters";
  } else if (values.last_name.length < 2 || values.last_name.length > 20) {
    errors.last_name = "Last name must be between 2 and 20 characters";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  if (!values.role_name) {
    errors.role_name = "Role name is required";
  }

  return errors;
};
