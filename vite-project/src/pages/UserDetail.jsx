import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Card, CardContent, Button, Box,CircularProgress,
  Divider,
  Avatar } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "../context/AuthContext";
import { fetchUserById } from "../api/userService";

function UserDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        setProfileData(data);
      } catch (error) {
        console.log("Kullanıcı detayı alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
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
                <strong>Açıklama:</strong> <br/>
                {profileData.aciklama || "Açıklama girilmemiş."}
            </Typography>
          </Box>

          <Box mt={4} display="flex" justifyContent="flex-end">
            {isOwner ? (
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
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
    </Container>
  );

}
export default UserDetail;