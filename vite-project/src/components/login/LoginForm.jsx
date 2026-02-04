import { useState } from "react";
import { TextField, Button, Typography, Box, Divider, Alert } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const {login}=useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);

    const result = await login(username, password);

    if(!result.success){
      setError(result.message);
    }
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

      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Kullanıcı Adı"
        fullWidth
        size="small"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Şifre"
        type="password"
        fullWidth
        size="small"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
