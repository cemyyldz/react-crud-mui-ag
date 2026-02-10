import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import myAvatar from '../assets/benimFoto.jpg';

import { useAuth } from '../context/AuthContext';

const pages = ['Personel', 'Raporlar', 'Ayarlar'];
const settings = ['Profil', 'Hesap', 'Logout'];

function Navbar() {
  const { logout, user } = useAuth();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting == 'Logout') {
      logout();
    }
  };

  const logoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKrfWHfu7t7nVjKwfkdAYTRGdg4WI5XP5zlQ&s";

  return (
    <AppBar position="static" sx={{ backgroundColor: '#161d20' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box
            component="img"
            src={logoUrl}
            alt="Logo"
            sx={{
              display: { xs: 'none', md: 'flex' },
              mr: 1,
              height: 40,
              width: 40,
              borderRadius: '50%',
              objectFit: 'contain'
            }}
          />





          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,

              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Yönetim Paneli
          </Typography>





          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ fontFamily: "'Montserrat', sans-serif" }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="img"
            src={logoUrl}
            alt="Logo"
            sx={{
              display: { xs: 'flex', md: 'none' },
              mr: 1,
              height: 35,
              width: 35,
              borderRadius: '50%',
              objectFit: 'contain'
            }}
          />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',


            }}
          >
            Panel
          </Typography>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2, color: 'white', display: 'block', fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600, '&:hover': {
                    backgroundColor: '#2b3234'
                  }
                }}
              >
                {page}
              </Button>
            ))}
          </Box>


          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Ayarları Aç">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.name || "User"} src={myAvatar}  >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                  <Typography textAlign="center" sx={{ fontFamily: "'Montserrat', sans-serif" }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>

      </Container>

    </AppBar>

  );

}
export default Navbar;