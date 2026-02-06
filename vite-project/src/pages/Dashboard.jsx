import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import {
  Container, Typography, Box, Button, TextField, InputAdornment, useTheme,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import { fetchUsers, deleteUserById, createNewUser, updateExistingUser } from '../api/userService';
import UserFormDrawer from '../components/UserFormDrawer';
import '../index.css'


function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    description: "",
    isActive: false
  });


  const getUsers = async () => {
    try {

      const data = await fetchUsers();
      setUsers(data);

    } catch (error) {
      console.log("Başarısız Veri okunamadı...", error);
    }

  };

  useEffect(() => {
    getUsers();
  }, []);





  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğinize emin misiniz ?")) {
      try {
        await deleteUserById(id);
        getUsers();
        alert("Kayıt Silindi");
      } catch (error) {
        console.log("Silinemedi", error);
        alert("Kayıt Silinemedi");
      }
    }
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
      if (editId) {
        await updateExistingUser(editId, apiPayload);
        alert(`Kullanıcı :${editId} güncellendi`)
      } else {
        await createNewUser(apiPayload);
        alert("Yeni kullanıcı eklendi :)")
      }
      getUsers();
      handleCancel();
    }
    catch (error) {
      console.log("Kayıt oluşturulurken bir hata oluştu.", error);
    }
  };


  const toggleDrawer = async (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleCancel();
    }

  };


  const handleCancel = () => {
    setEditId(null);
    setFormData({ name: "", surname: "", username: "", password: "", email: "", phone: "", description: "", isActive: false });
    setOpen(false);
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });

  };


  const handleEdit = (row) => {

    setFormData({
      name: row.name,
      surname: row.surname,
      username: row.username,
      password: row.password,
      email: row.email,
      phone: row.phone,
      description: row.description,
      isActive: row.isActive
    });

    setEditId(row.id);
    setOpen(true);

  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  }




  const columnDefs = [
    { field: 'id', headerName: 'ID', minWidth: 70, hide: isMobile, flex: isMobile ? undefined : 0.5 },
    { field: 'name', headerName: 'İsim', minWidth: 120, width: isMobile ? 120 : undefined, flex: isMobile ? undefined : 1 },
    { field: 'surname', headerName: 'Soyisim', minWidth: 120, width: isMobile ? 120 : undefined, flex: isMobile ? undefined : 1 },
    { field: 'email', headerName: 'E-mail', minWidth: 220, hide: isMobile, flex: isMobile ? undefined : 1.5 },
    { field: 'phone', headerName: 'Telefon', minWidth: 150, hide: isMobile, flex: isMobile ? undefined : 1 },
    { field: 'description', headerName: 'Açıklama', minWidth: 150, hide: isMobile, flex: isMobile ? undefined : 1.5 },
    {
      field: 'isActive',
      headerName: 'Üyelik Durumu',
      minWidth: 120,
      width: isMobile ? 120 : undefined,
      flex: isMobile ? undefined : 1,

      cellRenderer: (params) => params.value ? "Aktif" : "Pasif"

    },

    {
      field: 'id',
      headerName: 'İşlemler',
      minWidth: isMobile ? 140 : 200,
      width: isMobile ? 140 : undefined,
      flex: isMobile ? undefined : 1,

      cellRenderer: (params) => {
        return (
          <Box display="flex" gap={1}>
            <Button
              variant='outlined'
              color='primary'
              size='small'
              startIcon={!isMobile ? <EditIcon /> : null}
              onClick={() => handleEdit(params.data)}
              sx={{ minWidth: isMobile ? 35 : 64, padding: isMobile ? 1 : '4px 10px',aspectRatio: isMobile ? '1/1' : 'auto' }}
            >
              {isMobile ? <EditIcon fontSize='small'/> : 'Düzenle'}
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={!isMobile ? <DeleteIcon /> : null}
              onClick={() => handleDelete(params.data.id)}
              sx={{ minWidth: isMobile ? 35 : 64, padding: isMobile ? 1 : '4px 10px' ,aspectRatio: isMobile ? '1/1' : 'auto'}}
            >{isMobile ? <DeleteIcon fontSize='small'/> : 'Sil'}</Button>
          </Box>
        );
      }
    }

  ];


  return (
    <Container maxWidth="xl" sx={{ marginTop: 4 }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Personel Listesi
        </Typography>
      </Box>
      <Box sx={{
        mb: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        alignItems: { sm: "center" },
        justifyContent: { sm: "space-between" },
      }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}
          sx={{ width: { xs: "100%", sm: "auto" } }}>
          Kullanıcı Ekle
        </Button>
        <TextField
          label="Tabloda ara..."
          variant='outlined'
          size='small'
          value={searchTerm}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{
            width: { xs: "100%", sm: 300 }
          }}
        />
      </Box>

      <div className="ag-theme-quartz" style={{ height: 500, width: '100%', overflowX: 'auto' }} >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          quickFilterText={searchTerm}
          domLayout="autoHeight"
        />
      </div>

      <UserFormDrawer
        open={open}
        onClose={() => toggleDrawer(false)}
        editId={editId}
        formData={formData}

        onChange={handleChange}
        onSave={handleSave}
      />


    </Container>

  );




}

export default Dashboard;