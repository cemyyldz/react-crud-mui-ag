import { useState } from "react";
import { TextField, Button, Typography, Box, Divider, Alert } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function LoginForm() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);


  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);



  const handleSubmit = async () => {
    setError(null);

    const result = await login(username, password);

    if (!result.success) {
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
        type={showPassword ? 'text' : 'password'}
        fullWidth
        size="small"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
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
