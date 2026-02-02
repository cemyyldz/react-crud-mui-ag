import { useState , useEffect} from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
import { Container, Typography, Box, Button, TextField, Checkbox, FormControlLabel, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';

function App() {
  const [users,setUsers] = useState([]);

  const [formData, setFormData]= useState({
    name:"",
    surname:"",
    email:"",
    phone:"",
    description:"",
    isActive:false
  });
  const [editId,setEditId] = useState(null);

  const [searchTerm,setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if(window.confirm("Silmek istediğinize emin misiniz ?")){
  try{
    await axios.delete(`https://697e36ac97386252a26a2c01.mockapi.io/kullanici/${id}`);
    getUsers();
    alert("Kayıt Silindi");
  } catch(error){
    console.log("Silinemedi",error);
    alert("Kayıt Silinemedi");
  }
  }
 };

  const columnDefs = [
    {field: 'id', headerName:'ID', width:70},
    {field: 'name', headerName:'İsim', flex:1},
    {field: 'surname', headerName:'Soyisim', flex:1},
    {field: 'email', headerName:'E-mail', flex:1},
    {field: 'phone', headerName:'Telefon', flex:1},
    {field: 'description', headerName:'Açıklama', flex:1},
    {field: 'isActive',
      headerName:'Üyelik Durumu',
      width:100,
      cellRenderer:(params) => params.value ? "Aktif" : "Pasif" 

    },

    {
      field: 'id',
      headerName:'İşlemler',
      width:220,
      cellRenderer:(params) => {
        return (
          <Box display="flex" gap={1}>
          <Button 
          variant='outlined'
          color='primary'
          size='small'
          startIcon={<EditIcon/>}
          onClick={()=>handleEdit(params.data)}
          >
            Düzenle
          </Button>
          <Button
          variant='outlined'
          color='error'
          size='small'
          startIcon={<DeleteIcon />}
          onClick={()=> handleDelete(params.data.id)}
          >Sil</Button>
          </Box>
        );
      }
    }

  ];

  const getUsers = async () => {
    try{
      
    const response = await axios.get("https://697e36ac97386252a26a2c01.mockapi.io/kullanici");

    const formattedData = response.data.map(user =>({
      id: user.id,
      name: user.isim,
      surname: user.soyisim,
      phone: user.telefon,
      description: user.aciklama,
      email: user.email,
      isActive: user.isActive,
    }));
    console.log(formattedData);


    setUsers(formattedData);

    }catch(error){
      console.log("Başarısız Veri okunamadı...",error);
    }
    
  };

 useEffect(()=>{
  getUsers();
 },[]);

 const handleChange = (e) => {
  const value = e.target.type ==='checkbox' ? e.target.checked : e.target.value;

  setFormData({
    ...formData,
    [e.target.name]: value
  });

 };

 const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
 }

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

};

const handleCancel = () => {
  setEditId(null);
  setFormData({name:"",surname:"",email:"",phone:"",description:"",isActive:false});
};


 const handleSave = async () => {
  const apiPayload ={
    isim: formData.name,
    soyisim: formData.surname,
    email: formData.email,
    telefon: formData.phone,
    aciklama: formData.description,
    isActive: formData.isActive,
  };

  try{
    if(editId){
      await axios.put(`https://697e36ac97386252a26a2c01.mockapi.io/kullanici/${editId}`,apiPayload);
      alert(`Kullanıcı :${editId} güncellendi`)
    }else{
      await axios.post("https://697e36ac97386252a26a2c01.mockapi.io/kullanici",apiPayload);
      alert("Yeni kullanıcı eklendi :)")
    }
    getUsers();
    handleCancel();
  }
  catch(error){
    console.log("Kayıt oluşturulurken bir hata oluştu.",error);
  }
 };



return (
<Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {editId ? "Kayıt Düzenle" : "Personel Listesi"}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, flexWrap: 'wrap',backgroundColor: editId ? '#fff3e0' : '#e3f2fd', padding: 2, borderRadius: 2, border: editId ? '1px solid orange' : 'none' }}>
        <TextField 
          label="İsim" 
          name="name" 
          variant="outlined" 
          size="small" 
          value={formData.name} 
          onChange={handleChange} 
        />
        <TextField 
          label="Soyisim" 
          name="surname" 
          variant="outlined" 
          size="small" 
          value={formData.surname} 
          onChange={handleChange} 
        />
        <TextField 
          label="Email" 
          name="email" 
          variant="outlined" 
          size="small" 
          value={formData.email} 
          onChange={handleChange} 
        />
        <TextField 
          label="Telefon" 
          name="phone" 
          variant="outlined" 
          size="small" 
          value={formData.phone} 
          onChange={handleChange} 
        />
        <TextField 
          label="Açıklama" 
          name="description" 
          variant="outlined" 
          size="small" 
          value={formData.description} 
          onChange={handleChange} 
        />
        <FormControlLabel
            control={<Checkbox checked={formData.isActive} onChange={handleChange} name="isActive" />}
            label="Aktif"
          />
        <Button variant="contained" color={editId ? "warning" : "primary"}  onClick={handleSave} >
         {editId ? "Güncelle" : "Ekle"} 
        </Button>
        {
          editId && (
            <Button variant='contained' color='inherit' onClick={handleCancel}>
              Vazgeç
            </Button>
          )
        }
      </Box>
      <Box sx={{marginBottom: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <TextField
        label="Tabloda ara..."
        variant='outlined'
        size='small'
        value={searchTerm}
        onChange={handleSearchChange}
        slotProps={{
          input:{
            startAdornment:(
              <InputAdornment position='start'>
                <SearchIcon/>
              </InputAdornment>
          ),
        }}}
        sx={{width: 300,'& .MuiOutlinedInput-root': {
      color: '#fff',
      '& fieldset': {
        borderColor: '#fff',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#fff',
    }}}
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

    </Container>
  
);

}

export default App
