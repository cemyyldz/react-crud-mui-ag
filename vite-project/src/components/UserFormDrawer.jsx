import { useState, useEffect } from 'react';
import { Drawer, Box, Typography, IconButton, Divider, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CustomTextFieldTitle from './custom/CustomTextFieldTitle';
import { toast } from 'react-toastify';
import { CommonTextFieldSx } from './custom/CommonTextFieldSx';
import { createNewUser, updateExistingUser } from '../api/userService';




const UserFormDrawer = ({ open, onClose, editId,initialData,onSuccess }) => {

  const initialFormData = {
    name: "", surname: "", username: "", password: "",
    email: "", phone: "", description: "", isActive: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editId && initialData) {
        setFormData({
            name: initialData.name, 
            surname: initialData.surname,
            username: initialData.username,
            password: initialData.password, 
            email: initialData.email,
            phone: initialData.phone,
            description: initialData.description,
            isActive: initialData.isActive
        });
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [open, editId, initialData]);

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
  const handleSave = async () => {
    if (!validateForm()) {
        toast.warning("Lütfen formdaki hataları düzeltin!");
        return;
    }
    setIsSubmitting(true);

    const apiPayload = {
      isim: formData.name,
      soyisim: formData.surname,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      telefon: formData.phone,
      aciklama: formData.description,
      isActive: formData.isActive,
    };

    try {
      if (editId) {
        await updateExistingUser(editId, apiPayload);
        toast.success("Kullanıcı güncellendi!");
      } else {
        await createNewUser(apiPayload);
        toast.success("Yeni kullanıcı eklendi!");
      }
      if (onSuccess) onSuccess();
      onClose();
    }
    catch (error) {
      console.log("Kayıt oluşturulurken bir hata oluştu.", error);
      toast.error("İşlem başarısız oldu.");
      throw error;
    }finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
    if (errors[e.target.name]) {
       setErrors({ ...errors, [e.target.name]: null });
    }

  };

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);


  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 550 },
          maxWidth: "100%",
          height: "auto",
          maxHeight: "90vh",


          margin: "auto",
          top: "5vh",
          right: { sm: "20px" },


          borderRadius: "20px",
          backgroundColor: "#f8f9fa",
        },
      }}

    >

      <Box sx={{
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
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
        <CustomTextFieldTitle>
          İsim
        </CustomTextFieldTitle>

        <TextField
          name="name"
          size="small"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          placeholder={
            'John'
          }
          error={!!errors.name}
          helperText={errors.name}
          sx={CommonTextFieldSx}
        />

        <CustomTextFieldTitle>
          Soyisim
        </CustomTextFieldTitle>
        <TextField name="surname" size="small" fullWidth value={formData.surname} onChange={handleChange}
          placeholder={
            'Doe'
          }
          error={!!errors.surname} helperText={errors.surname} sx={CommonTextFieldSx} />




        <CustomTextFieldTitle>Kullanıcı Adı</CustomTextFieldTitle>
        <TextField name="username" variant="outlined" size="small" value={formData.username} onChange={handleChange} placeholder={'johndoe'}
          error={!!errors.username}
          helperText={errors.username} sx={CommonTextFieldSx} />



        <CustomTextFieldTitle>
          Şifre
        </CustomTextFieldTitle>
        <TextField
          name="password"
          variant="outlined"
          size="small"
          value={formData.password}
          onChange={handleChange}
          placeholder={'********'}
          error={!!errors.password} helperText={errors.password}
          type={showPassword ? 'text' : 'password'} sx={CommonTextFieldSx}
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


        <CustomTextFieldTitle>Email</CustomTextFieldTitle>
        <TextField name="email" variant="outlined" size="small" value={formData.email} onChange={handleChange}
          error={!!errors.email} helperText={errors.email}
          placeholder={'johndoe@gmail.com'} sx={CommonTextFieldSx} />

        <CustomTextFieldTitle>Telefon</CustomTextFieldTitle>
        <TextField name="phone" variant="outlined" size="small" value={formData.phone} onChange={handleChange}
          placeholder={'05322359476'}
          error={!!errors.phone} helperText={errors.phone} sx={CommonTextFieldSx} />

        <CustomTextFieldTitle>Açıklama</CustomTextFieldTitle>
        <TextField name="description" variant="outlined" size="small" value={formData.description} onChange={handleChange}
          placeholder='Grizzle Techte çalışıyorum.'
          error={!!errors.description} helperText={errors.description} sx={CommonTextFieldSx} multiline rows={3} />



        <FormControlLabel
          control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" sx={{
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
          <Button variant="contained" color={editId ? "warning" : "primary"} onClick={handleSave} fullWidth disabled={isSubmitting} sx={{
            backgroundColor: editId ? '#4085a3' : '#161d20',
            color: '#ffffff',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: editId ? '#346b82' : '#2b3234',
            }
          }}>
            {editId ? "Güncelle" : "Ekle"}
          </Button>
          <Button variant='outlined' color='inherit' onClick={onClose} fullWidth sx={{
            color: '#161d20',
            borderColor: '#161d20',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'none',
            '&:hover': {
              borderColor: '#161d20',
              backgroundColor: 'rgba(22, 29, 32, 0.05)'
            },

          }}>
            Vazgeç
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserFormDrawer;