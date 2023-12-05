import React, { useEffect, useState } from "react";
import {
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { Box, Grid, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Role } from "@/common/types";

const Roles = () => {
  const [roles, setRoles] = useState<Role[]>([]); // Specify the type of roles as an array of Role
  const router = useRouter();

  useEffect(() => {
    // Fetch roles data from the API
    axios.get("/api/roles").then((response) => {
    const rolesData: Role[] = response?.data?.data;

    // Sort the roles array by Role name
    const sortedRoles = rolesData.sort((a, b) => a?.role_name?.localeCompare(b?.role_name));

    setRoles(sortedRoles);
    });
  }, []);

  const handleEditClick = (role: Role) => {
    router.push(`/roles/update-role/${role.id}`);
  };

  const handleCreateClick = () => {
    router.push("/roles/create-role");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
       Role List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={()=>handleCreateClick()} 
        style={{ marginBottom: "16px" }}
      >
        Create Role
      </Button>
      <Grid container spacing={2}>
  {roles.map((role) => (
    <Grid item xs={12} sm={6} md={4} key={role.id}>
      <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
        <Grid container spacing={1} alignItems="center" height={'100%'}>
          <Grid item xs={12} sm={8}>
            <Typography variant="body2">Role: {role.role_name}</Typography>
            <Typography variant="body2">Description: {role.short_description}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{ textAlign: 'center' }}>
            <IconButton onClick={() => handleEditClick(role)}>
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  ))}
</Grid>
    </Box>
  );
};

export default Roles;
