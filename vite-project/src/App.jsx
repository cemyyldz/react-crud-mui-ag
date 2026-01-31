import { useState , useEffect} from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
import { Container, Typography, Box, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';

function App() {
  const [users,setUsers] = useState([]);

  const [formData, setFormData]= useState([{
    isim:"",
    soyisim:"",
    email:"",
    telefon:"",
    aciklama:"",
    isActive:false
  }]);

  const [columnDefs] = useState([
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

    }
  ]);

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

 const handleSave = async () => {

  try{
    await axios.post("https://697e36ac97386252a26a2c01.mockapi.io/kullanici",formData);
    getUsers;
    setFormData({isim:"",
    soyisim:"",
    email:"",
    telefon:"",
    aciklama:"",
    isActive:false});
    alert("Kayıt Başarılıdırr.")
  }
  catch(error){
    console.log("Kayıt oluşturulurken bir hata oluştu.",error);
  }
 };

return (
<Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Personel Listesi
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 4, flexWrap: 'wrap',backgroundColor:'primary.light' }}>
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
        <Button variant="contained" color="primary"  onClick={handleSave} >
          EKLE
        </Button>
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
