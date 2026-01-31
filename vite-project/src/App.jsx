import { useState , useEffect} from 'react'
import axios from 'axios'
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([ AllCommunityModule ]);
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  const [users,setUsers] = useState([]);

  const [columnDefs] = useState([
    {field: 'id', headerName:'ID', width:70},
    {field: 'isim', headerName:'İsim', flex:1},
    {field: 'soyisim', headerName:'Soyisim', flex:1},
    {field: 'email', headerName:'E-mail', flex:1},
    {field: 'telefon', headerName:'Telefon', flex:1},
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

return (
  <Container maxWidth="lg" sx={{ marginTop: 4 }}>
    <Typography variant="h4" component="h1" gutterBottom align="center">
        Kullanıcı Yönetim Paneli
      </Typography>
      <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
        <AgGridReact
          rowData={users}          
          columnDefs={columnDefs}  
          pagination={true}       
          paginationPageSize={10} 
        />
      </div>

    </Container>
  
);

}

export default App
