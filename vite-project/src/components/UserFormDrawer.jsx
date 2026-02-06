import { Drawer, Box, Typography, IconButton, Divider, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const UserFormDrawer = ({ open, onClose, editId, formData, onChange, onSave }) => {
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
          <Typography variant="h6">
            {editId ? "Kullanıcı Düzenle" : "Yeni Kayıt Oluştur"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <TextField label="İsim" name="name" variant="outlined" size="small" value={formData.name} onChange={onChange} />
        <TextField label="Soyisim" name="surname" variant="outlined" size="small" value={formData.surname} onChange={onChange} />
        <TextField label="Kullanıcı Adı" name="username" variant="outlined" size="small" value={formData.username} onChange={onChange} />
        <TextField label="Şifre" name="password" variant="outlined" size="small" value={formData.password} onChange={onChange} />
        <TextField label="Email" name="email" variant="outlined" size="small" value={formData.email} onChange={onChange} />
        <TextField label="Telefon" name="phone" variant="outlined" size="small" value={formData.phone} onChange={onChange} />
        <TextField label="Açıklama" name="description" variant="outlined" size="small" value={formData.description} onChange={onChange} />

        <FormControlLabel
          control={<Checkbox checked={formData.isActive} onChange={onChange} name="isActive" />}
          label="Kullanıcı Aktif mi?"
        />

        <Box display="flex" gap={2} mt={2} flexDirection={{ xs: "column", sm: "row" }}>
          <Button variant="contained" color={editId ? "warning" : "primary"} onClick={onSave} fullWidth>
            {editId ? "Güncelle" : "Ekle"}
          </Button>
          <Button variant='contained' color='inherit' onClick={onClose} fullWidth>
            Vazgeç
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default UserFormDrawer;