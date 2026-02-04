import { TextField, Button, Typography, Box, Divider } from "@mui/material";

function LoginForm({ onLogin }) {

  const handleSubmit = () => {
    onLogin();
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      
      <Typography
        variant="h4"
        textAlign="center"
        fontWeight="bold"
      >
        Hoş Geldiniz
      </Typography>

      <Divider />

      <TextField
        label="Kullanıcı Adı"
        fullWidth
        size="small"
      />

      <TextField
        label="Şifre"
        type="password"
        fullWidth
        size="small"
      />

      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ mt: 1 }}
        onClick={handleSubmit}
      >
        Giriş Yap
      </Button>

    </Box>
  );
}

export default LoginForm;
