export const roleFields = [
  { id: "1", name: "role_name", label: "Role Name", type: "text" },
  { id: "2", name: "short_description", label: "Short Description", type: "text" },
];

export const userFields = [
  { id: "1", name: "first_name", label: "First Name", type: "text" },
  { id: "2", name: "last_name", label: "Last Name", type: "text" },
  { id: "3", name: "email", label: "Email", type: "email" },
  { id: "4", name: "role_name", label: "Role Name", type: "select" },
];

export const roleOptions = ["Admin", "Guest", "User"];
