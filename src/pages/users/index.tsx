import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Box,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  Theme,
} from "@mui/material";

import { useRouter } from "next/router";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "@/common/types";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const userListRef = useRef<HTMLDivElement | null>(null); // Ref for the User List component

  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      const data = await axios.get("/api/users");
      const response = await data.data.data.users;

      const sortedUsers = response.sort((a: User, b: User) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setUsers(sortedUsers);
    };
    getUsers();
  }, []);

  // Calculate the index range for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    userListRef.current?.scrollIntoView();
  };

  const handleCreateClick = () => {
    router.push("/users/create-user");
  };

  const handleEditClick = (user: User) => {
    router.push(`/users/update-users/${user.id}`);
  };

  function formatDate(dateString: string | number | Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <Box ref={userListRef} width={"100%"}>
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleCreateClick()} // Replace with your create user function
        style={{ marginBottom: "16px" }}
      >
        Create User
      </Button>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {currentUsers.map((user, index) => (
          <Box
            key={index}
            width={{ xs: "100%", sm: "100%", md: "calc(50% - 8px)" }}
          >
            <Paper elevation={3} style={{ padding: "16px", height: "100%" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                style={{ height: "100%" }}
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <Box>
                  <Typography variant="h6">{user.first_name}</Typography>
                  <Typography variant="body2">
                    Last Name: {user.last_name}
                  </Typography>
                  <Typography variant="body2">
                    Role: {user.role_name}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <EditIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: isSmallScreen ? "center" : "end", // Center the buttons horizontally
          alignItems: "center", // Center the buttons vertically
          marginTop: 2,
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          // Set a fixed width for the buttons
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentUsers.length < usersPerPage}
        >
          Next Page
        </Button>
      </Box>
    </Box>
  );
};

export default Users;
