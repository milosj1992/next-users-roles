import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Link from "next/link"; // Import Link from next/link

function NavigationMenu ()  {
  return (
    <AppBar component="nav">
      <Box
        display={"flex"}
        padding={{ xs: "0", sm: "0 6rem" }}
        justifyContent={{ xs: "center", sm: "normal" }}
      >
        <Toolbar disableGutters style={{ display: "flex", gap: "8px" }}>
          {" "}
          <Link href="/" passHref>
            <Button variant="contained" color="inherit">
              Home
            </Button>
          </Link>
          <Link href="/roles" passHref>
            <Button variant="contained" color="inherit">
              Roles
            </Button>
          </Link>
          <Link href="/users" passHref>
            <Button variant="contained" color="inherit">
              Users
            </Button>
          </Link>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default NavigationMenu;
