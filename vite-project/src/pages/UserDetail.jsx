import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Card, CardContent, Button, Box, CircularProgress,
  Divider,
  Avatar
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "../context/AuthContext";
import { fetchUserById, updateExistingUser } from "../api/userService";
import UserFormDrawer from "../components/UserFormDrawer";
function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", surname: "", username: "", password: "",
    email: "", phone: "", description: "", isActive: false
  });

  const getData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 20));
      setLoading(true);
      const data = await fetchUserById(id);
      setProfileData(data);
    } catch (error) {
      console.log("Kullanıcı detayı alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {

    getData();
  }, [id]);

  const handleEditClick = () => {
    setFormData({
      name: profileData.isim,
      surname: profileData.soyisim,
      username: profileData.username,
      password: profileData.password,
      email: profileData.email,
      phone: profileData.telefon,
      description: profileData.aciklama,
      isActive: profileData.isActive
    });
    setOpen(true);
  };


  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };


  const handleSave = async () => {
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

      await updateExistingUser(id, apiPayload);


      setOpen(false);
      getData();

    } catch (error) {
      console.log("Güncelleme hatası:", error);
    }
  };
  if (loading){
    return null;
  }
  if (!profileData) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>Kullanıcı bulunamadı.</Typography>;
  }

  const isOwner = String(currentUser?.id) === String(profileData.id);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Listeye Dön
      </Button>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>

          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24 }}
            >
              {profileData.isim?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4">
                {profileData.isim} {profileData.soyisim}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{profileData.username}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box display="flex" flexDirection="column" gap={2}>
            <Typography><strong>Email:</strong> {profileData.email}</Typography>
            <Typography><strong>Telefon:</strong> {profileData.telefon}</Typography>
            <Typography>
              <strong>Durum:</strong>
              <span style={{
                color: profileData.isActive ? 'green' : 'red',
                marginLeft: 8,
                fontWeight: 'bold'
              }}>
                {profileData.isActive ? "Aktif Üye" : "Pasif Üye"}
              </span>
            </Typography>
            <Typography>
              <strong>Açıklama:</strong> <br />
              {profileData.aciklama || "Açıklama girilmemiş."}
            </Typography>
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end">
            {isOwner ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditClick}
              >
                Bilgilerimi Düzenle
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                Bu profili sadece sahibi düzenleyebilir.
              </Typography>
            )}
          </Box>

        </CardContent>
      </Card>
      <UserFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        editId={id}
        formData={formData}
        onChange={handleChange}
        onSave={handleSave}
      />
    </Container>
  );

}
export default UserDetail;