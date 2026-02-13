import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Card, CardContent, Button, Box, CircularProgress,
  Divider,
  Avatar,Grid
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from "../context/AuthContext";
import { fetchUserById } from "../api/userService";
import UserFormDrawer from "../components/UserFormDrawer";
import CustomTextFieldTitle from '../components/custom/CustomTextFieldTitle';

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const getData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 20));
      setLoading(true);
      const data = await fetchUserById(id);
      console.log(data);
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
    
    setOpen(true);
  };

  const handleSuccess = () => {
    getData();
  };


  if (loading) {
    return null;
  }
  if (!profileData) {
    return <Typography sx={{ mt: 4, textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>Kullanıcı bulunamadı.</Typography>;
  }

  const isOwner = String(currentUser?.id) === String(profileData.id);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3, color: '#161d20',
          borderColor: '#161d20',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
          borderRadius: '10px',
          border: '1px solid',
          '&:hover': {
            borderColor: '#161d20',
            backgroundColor: 'rgba(22, 29, 32, 0.05)'
          }
        }}
      >
        Listeye Dön
      </Button>

      <Card elevation={0} sx={{
        borderRadius: '24px',
        border: '1px solid #e0e0e0',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center" gap={3} mb={4}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                backgroundColor: '#4085a3',
                fontSize: 40,
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                boxShadow: '0px 4px 12px rgba(22, 29, 32, 0.2)'
              }}
            >
              {profileData.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="h4" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: '#161d20' }}>
                {profileData.name} {profileData.surname}
              </Typography>
              <Typography variant="h6" sx={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500, color: '#161d20' }}>
                @{profileData.username}
              </Typography>




              <Box display="inline-flex" alignItems="center" gap={0.5} mt={1} sx={{
                bgcolor: profileData.isActive ? 'rgba(46, 125, 50, 0.1)' : 'rgba(211, 47, 47, 0.1)',
                color: profileData.isActive ? '#2e7d32' : '#d32f2f',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600
              }}>
                {profileData.isActive ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />}
                {profileData.isActive ? "Aktif Üye" : "Pasif Üye"}

              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />


          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <EmailIcon sx={{ color: '#4085a3' }} />
                <CustomTextFieldTitle height={24}>
                  Email Adresi
                </CustomTextFieldTitle>
              </Box>
              <Typography variant="body1" sx={{ fontFamily: "'Montserrat', sans-serif", color: '#555', ml: 4.5 }}>
                {profileData.email}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <PhoneIcon sx={{ color: '#4085a3' }} />
                <CustomTextFieldTitle height={24}>
                  Telefon Numarası
                </CustomTextFieldTitle>
              </Box>
              <Typography variant="body1" sx={{ fontFamily: "'Montserrat', sans-serif", color: '#555', ml: 4.5 }}>
                {profileData.phone}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <InfoIcon sx={{ color: '#4085a3' }} />
                <CustomTextFieldTitle height={24}>
                  Hakkında
                </CustomTextFieldTitle>
              </Box>
              <Typography variant="body1" sx={{ fontFamily: "'Montserrat', sans-serif", color: '#555', ml: 4.5 }}>
                {profileData.description || "Henüz bir açıklama girilmemiş."}
              </Typography>
            </Grid>

          </Grid>



          <Box mt={5} display="flex" justifyContent="flex-end">
            {isOwner ? (
              <Button
                variant="contained"

                startIcon={<EditIcon />}
                onClick={handleEditClick}
                sx={{
                  backgroundColor: '#4085a3',
                  color: '#fff',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#346b82',
                    boxShadow: '0px 4px 12px rgba(64, 133, 163, 0.2)'
                  }
                }}
              >
                Bilgilerimi Düzenle
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontFamily: "'Montserrat', sans-serif" }}>
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
        initialData={profileData}

        onSuccess={handleSuccess}
      />
    </Container>
  );

}
export default UserDetail;