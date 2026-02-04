import { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { Container, Typography, Box, Button, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

import { fetchUsers, deleteUserById, createNewUser, updateExistingUser } from './api/userService';
import UserFormDrawer from './components/UserFormDrawer';


function App() {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    surname: "",
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
    setFormData({ name: "", surname: "", email: "", phone: "", description: "", isActive: false });
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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'İsim', flex: 1 },
    { field: 'surname', headerName: 'Soyisim', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'phone', headerName: 'Telefon', flex: 1 },
    { field: 'description', headerName: 'Açıklama', flex: 1 },
    {
      field: 'isActive',
      headerName: 'Üyelik Durumu',
      width: 100,
      cellRenderer: (params) => params.value ? "Aktif" : "Pasif"

    },

    {
      field: 'id',
      headerName: 'İşlemler',
      width: 220,
      cellRenderer: (params) => {
        return (
          <Box display="flex" gap={1}>
            <Button
              variant='outlined'
              color='primary'
              size='small'
              startIcon={<EditIcon />}
              onClick={() => handleEdit(params.data)}
            >
              Düzenle
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(params.data.id)}
            >Sil</Button>
          </Box>
        );
      }
    }

  ];


  return (
    <Container maxWidth sx={{ marginTop: 4 }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" >
          Personel Listesi
        </Typography>
      </Box>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} >
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
            width: 300, '& .MuiOutlinedInput-root': {
              color: '#dca2a2',
              '& fieldset': {
                borderColor: '#f02929',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#fff',
            }
          }}
        />
      </Box>

      <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]}
          quickFilterText={searchTerm}
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

export default App
