import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import ChatBotBubble from "../ChatBotBubble/ChatBotBubble";
import FindInPageIcon from '@mui/icons-material/FindInPage';

const ChatLayout = () => (
  <Box sx={{ minHeight: "100%" }}>
    <Box
      sx={{
        background: "linear-gradient(to top, #008080, #006666)",
        color: "#fff",
        padding: "15px",
        display: "flex",
        justifyContent: "left",
      }}
    >
      {/* Header content goes here. Replace with your logo or text */}
      <FindInPageIcon sx={{ fontSize: 40, marginRight: "0 10px 0 40px" }} />
      <Typography variant="h4">Doc GPT</Typography>
      {/* You can add additional header elements here, like user info or buttons */}
    </Box>
    <Container sx={{ padding: "40px 0" }}>
      <Grid container spacing={3}>
        {/* Content area. Replace with your actual content components */}
        <Grid item xs={12}>
            <ChatBotBubble />
        </Grid>
      </Grid>
    </Container>
    <Box
      sx={{
        background: "linear-gradient(to top, #008080, #006666)",
        color: "#fff",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        bottom: 0,        
        width: "auto"
      }}
    >
      {/* Footer content goes here. You can add copyright information or links */}
      <Typography variant="body2">© 2023 Doc GPT</Typography>
    </Box>
  </Box>
);

export default ChatLayout;
