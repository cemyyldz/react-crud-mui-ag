import { useState , useEffect} from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users,setUsers] = useState([]);

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

}
export default App
