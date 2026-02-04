import axios from 'axios';

const API_URL = "https://697e36ac97386252a26a2c01.mockapi.io/kullanici";

export const fetchUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data.map(user =>({
    id: user.id,
    name: user.isim,
        surname: user.soyisim,
        phone: user.telefon,
        description: user.aciklama,
        email: user.email,
        isActive: user.isActive,
  }));
};

export const deleteUserById = async (id) =>{
  return await axios.delete(`${API_URL}/${id}`);
};

export const createNewUser = async (payload) => {
    return await axios.post(API_URL, payload);
};

export const updateExistingUser = async (id, payload) => {
    return await axios.put(`${API_URL}/${id}`, payload);
};
