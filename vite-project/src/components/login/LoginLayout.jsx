import { Box, Paper } from "@mui/material";

function LoginLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "gray",
        borderRadius: "20px"
      }}
    >
      <Paper elevation={24} sx={{
        p: 4,
        width: {
          xs: "100%", 
          sm: 320,    
          md: 400
        },
        borderRadius: {
          xs: "15px",
          sm: "30px",
          md: "50px"
        }
      }}>
        {children}
      </Paper>
    </Box>
  );
}

export default LoginLayout;
