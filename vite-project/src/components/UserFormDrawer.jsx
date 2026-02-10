import { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';

const commonTextFieldSx = {
  '& label.Mui-focused': {
    color: '#161d20',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#161d20',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: "'Montserrat', sans-serif",
  },
  '& .MuiInputLabel-root': {
    fontFamily: "'Montserrat', sans-serif",
  }
};




const UserFormDrawer = ({ open, onClose, editId, formData, onChange, onSave }) => {

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "İsim alanı boş bırakılamaz.";
    }

    if (!formData.surname?.trim()) {
      newErrors.surname = "Soyisim alanı boş bırakılamaz.";
    }

    if (!formData.username?.trim()) {
      newErrors.username = "Kullanıcı adı zorunludur.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email?.trim()) {
      newErrors.email = "Email alanı boş bırakılamaz.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Lütfen geçerli bir email adresi giriniz.";
    }
    if (!formData.description?.trim()) {
      newErrors.description = "Açıklama zorunludur.";
    }

    const phoneRegex = /^(0)?5\d{9}$/;
    if (!formData.phone?.trim()) {
      newErrors.phone = "Telefon numarası zorunludur.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası giriniz."
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

    if (!editId && !formData.password?.trim()) {
      newErrors.password = "Şifre giriniz";
    }
    else if (formData.password?.trim() && !passwordRegex.test(formData.password)) {
      newErrors.password = "En az bir harf ve bir rakam içermelidir.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;


  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.warning("Lütfen formdaki hataları düzeltin!");
      return;
    }
    setIsSubmitting(true);

    try {
      await onSave();
      toast.success(editId ? "Kullanıcı güncellendi!" : "Yeni kullanıcı eklendi!");
      setErrors({});
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    onChange(e);

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };



  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          maxWidth: "100%",
          height: { xs: "100vh", sm: "100%" },
        },
      }}

    >

      <Box sx={{
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
        overflowY: "auto",
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
            {editId ? "Kullanıcı Düzenle" : "Yeni Kayıt Oluştur"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <TextField label="İsim" name="name" variant="outlined" size="small" value={formData.name} onChange={handleInputChange}
          error={!!errors.name} helperText={errors.name} sx={commonTextFieldSx} />
        <TextField label="Soyisim" name="surname" variant="outlined" size="small" value={formData.surname} onChange={handleInputChange}
          error={!!errors.surname} helperText={errors.surname} sx={commonTextFieldSx} />
        <TextField label="Kullanıcı Adı" name="username" variant="outlined" size="small" value={formData.username} onChange={handleInputChange}
          error={!!errors.username}
          helperText={errors.username} sx={commonTextFieldSx} />
        <TextField
          label="Şifre"
          name="password"
          variant="outlined"
          size="small"
          value={formData.password}
          onChange={handleInputChange}
          error={!!errors.password} helperText={errors.password}
          type={showPassword ? 'text' : 'password'} sx={commonTextFieldSx}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="şifre görünürlüğünü değiştir"
                  onClick={handleClickShowPassword}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField label="Email" name="email" variant="outlined" size="small" value={formData.email} onChange={handleInputChange}
          error={!!errors.email} helperText={errors.email} sx={commonTextFieldSx} />
        <TextField label="Telefon" name="phone" variant="outlined" size="small" value={formData.phone} onChange={handleInputChange}
          error={!!errors.phone} helperText={errors.phone} sx={commonTextFieldSx} />
        <TextField label="Açıklama" name="description" variant="outlined" size="small" value={formData.description} onChange={handleInputChange}
          error={!!errors.description} helperText={errors.description} sx={commonTextFieldSx} multiline rows={3} />

        <FormControlLabel
          control={<Checkbox checked={formData.isActive} onChange={onChange} name="isActive" sx={{
            color: '#161d20',
            '&.Mui-checked': {
              color: '#161d20',
            },
          }} />}
          label={
            <Typography sx={{ fontFamily: "'Montserrat', sans-serif" }}>
              Kullanıcı Aktif mi?
            </Typography>
          }
        />

        <Box display="flex" gap={2} mt={2} flexDirection={{ xs: "column", sm: "row" }}>
          <Button variant="contained" color={editId ? "warning" : "primary"} onClick={handleSubmit} fullWidth disabled={isSubmitting} sx={{
                backgroundColor: '#161d20',
                color: '#ffffff',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                    backgroundColor: '#2b3234',
                }
            }}>
            {editId ? "Güncelle" : "Ekle"}
          </Button>
          <Button variant='contained' color='inherit' onClick={onClose} fullWidth sx={{
                color: '#161d20',
                borderColor: '#161d20',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'none',
                '&:hover': {
                    borderColor: '#161d20',
                    backgroundColor: 'rgba(22, 29, 32, 0.05)'
                }
            }}>
            Vazgeç
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserFormDrawer;