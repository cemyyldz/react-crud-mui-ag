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

import { fetchUsers, deleteUserById } from '../api/userService';
import UserFormDrawer from '../components/UserFormDrawer';
import '../index.css'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import CustomDialogTitle from '../components/custom/CustomDialogTitle';
import {CommonTextFieldSx} from '../components/custom/CommonTextFieldSx';



function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (gridApi) {
        gridApi.paginationGoToFirstPage();
      }
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm, gridApi]);

  const handleAddClick = () => {
    setEditId(null);      
    setSelectedUser(null); 
    setOpen(true);         
  };



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

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    try {
      await deleteUserById(idToDelete);
      toast.success("Kullanıcı başarıyla silindi!");
      getUsers();

    } catch (error) {
      console.log("Silinemedi", error);
      toast.error("Silme işlemi başarısız oldu!");
    } finally {
      setOpenDeleteDialog(false);
      setIdToDelete(null);
    }
  };

  const handleEdit = (row) => {

    setSelectedUser(row);

    setEditId(row.id);
    setOpen(true);

  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSuccess = () => {
    getUsers(); 
  };




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
      headerClass: 'header-center',

      cellRenderer: (params) => {
        return (
          <Box display="flex" gap={1} width="100%" height="100%" justifyContent="center" alignItems="center" >
            <Button
              variant='outlined'
              color='primary'
              size='small'
              startIcon={!isMobile ? <EditIcon /> : null}
              onClick={() => handleEdit(params.data)}
              sx={{
                minWidth: isMobile ? 35 : 64, padding: isMobile ? 1 : '6px 10px', aspectRatio: isMobile ? '1/1' : 'auto',
                color: '#4085a3',
                borderColor: '#4085a3',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'none',
                fontWeight: 600,

                '&:hover': {
                  borderColor: '#4085a3',
                  backgroundColor: 'rgba(64, 133, 163, 0.08)',
                }
              }}
            >
              {isMobile ? <EditIcon fontSize='small' /> : 'Düzenle'}
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={!isMobile ? <DeleteIcon /> : null}
              onClick={() => handleDeleteClick(params.data.id)}
              sx={{
                minWidth: isMobile ? 35 : 64, padding: isMobile ? 1 : '6px 10px', aspectRatio: isMobile ? '1/1' : 'auto',
                fontFamily: "'Montserrat', sans-serif",
                textTransform: 'none',
                fontWeight: 600,
              }}
            >{isMobile ? <DeleteIcon fontSize='small' /> : 'Sil'}</Button>
          </Box>
        );
      }
    }

  ];


  return (
    <Container maxWidth="xl" sx={{ marginTop: 4 }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          color: '#161d20',
          letterSpacing: '-1px',

        }}>
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}
          sx={{
            width: {
              xs: "100%", sm: "auto",
              backgroundColor: '#161d20',
              color: '#ffffff',
              textTransform: 'none',
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              '&:hover': {
                backgroundColor: '#2b3234',
              }
            }
          }}>
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
            width: { xs: "100%", sm: 300 },
            ...CommonTextFieldSx
          }}
        />
      </Box>

      <div className="ag-theme-quartz" style={{ height: 'calc(100vh - 300px)', width: '100%' }} >
        <AgGridReact
          rowData={users}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={isMobile ? 12 : 20}
          paginationPageSizeSelector={[12, 20, 40, 100]}
          quickFilterText={debouncedSearchTerm}

          onGridReady={(params) => {
            setGridApi(params.api);
            if (!isMobile) {
              params.api.sizeColumnsToFit();
            }
          }}
          onRowClicked={(event) => {
            if (event.event.target.closest("button")) {
              return;
            }
            navigate(`/user/${event.data.id}`);
          }}
          rowStyle={{ cursor: 'pointer' }}
        />
      </div>

      <UserFormDrawer
        open={open}
        onClose={() => setOpen(false)}
        editId={editId}
        initialData={selectedUser} 
        onSuccess={handleSuccess}
      />

      <CustomDialogTitle
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Silme İşlemi"
        text="Bu kullanıcıyı silmek istediğinize emin misiniz???"
      />


    </Container>

  );




}

export default Dashboard;