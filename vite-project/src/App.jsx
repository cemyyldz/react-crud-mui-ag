import { useState , useEffect} from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
import { Container, Typography, Box, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function App() {
  const [users,setUsers] = useState([]);

  const [formData, setFormData]= useState({
    isim:"",
    soyisim:"",
    email:"",
    telefon:"",
    aciklama:"",
    isActive:false
  });
  const [editId,setEditId] = useState(null);

  const handleDelete = async (id) => {
  try{
    await axios.delete(`https://697e36ac97386252a26a2c01.mockapi.io/kullanici/${id}`);
    getUsers();
    alert("Kayıt Silindi");
  } catch(error){
    console.log("Silinemedi",error);
    alert("Kayıt Silinemedi");
  }
 };

  const columnDefs = [
    {field: 'id', headerName:'ID', width:70},
    {field: 'isim', headerName:'İsim', flex:1},
    {field: 'soyisim', headerName:'Soyisim', flex:1},
    {field: 'email', headerName:'E-mail', flex:1},
    {field: 'telefon', headerName:'Telefon', flex:1},
    {field: 'aciklama', headerName:'Açıklama', flex:1},
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


    setUsers(response.data);

    console.log("Başarılı,Veriler : ",response.data);
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

const handleEdit = (row) => {

  setFormData({
    isim: row.isim,
    soyisim: row.soyisim,
    email: row.email,
    telefon: row.telefon,
    aciklama: row.aciklama,
    isActive: row.isActive
  });

  setEditId(row.id);

};

const handleCancel = () => {
  setEditId(null);
  setFormData({isim:"",soyisim:"",email:"",telefon:"",aciklama:"",isActive:false});
};


 const handleSave = async () => {

  try{
    if(editId){
      await axios.put(`https://697e36ac97386252a26a2c01.mockapi.io/kullanici/${editId}`,formData);
      alert(`Kullanıcı :${editId} güncellendi`)
    }else{
      await axios.post("https://697e36ac97386252a26a2c01.mockapi.io/kullanici",formData);
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
          name="isim" 
          variant="outlined" 
          size="small" 
          value={formData.isim} 
          onChange={handleChange} 
        />
        <TextField 
          label="Soyisim" 
          name="soyisim" 
          variant="outlined" 
          size="small" 
          value={formData.soyisim} 
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
          name="telefon" 
          variant="outlined" 
          size="small" 
          value={formData.telefon} 
          onChange={handleChange} 
        />
        <TextField 
          label="Açıklama" 
          name="aciklama" 
          variant="outlined" 
          size="small" 
          value={formData.aciklama} 
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


      <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={users}          
          columnDefs={columnDefs}  
          pagination={true}       
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20, 50]} 
        />
      </div>

    </Container>
  
);

}

export default App
