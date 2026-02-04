import { createContext, useState, useContext } from "react";
import { fetchUsers } from "../api/userService";


const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  const login = async (username,password) => {
    try{
      const users = await fetchUsers();

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if(foundUser){
      setUser(foundUser);
      return { success : true}
    }
    else {
      return { success : false,message:"Kullanıcı adı veya şifre hatalı!"};
    }





    }catch(error){
      console.log("Giriş hatası",error);
      return{success: false,message: "Sunucu hatası"};

    }



    };
    const logout = () => {
      setUser(null);

    };

    const values = {
      user,
      isAuthenticated: !!user,
      login,
      logout,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
    
  };

  export const useAuth = () => useContext(AuthContext);

