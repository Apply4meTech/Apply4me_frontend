'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, AppBar, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth, logout } from '../../store/authSlice';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

export default function EmployeeLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const profileMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        const userData = JSON.parse(user);
        if (userData.isEmployee && !isAuthenticated) {
          dispatch(initializeAuth());
        }
      }
      setIsInitialized(true);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (isInitialized) {
      if (!isAuthenticated || !user?.isEmployee) {
        router.push('/employee/login');
      }
    }
  }, [isInitialized, isAuthenticated, user, router]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    router.push('/employee/profile');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    dispatch(logout());
    router.push('/employee/login');
  };

  if (!isInitialized || !isAuthenticated || !user?.isEmployee) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 600 }}>
            Employee Dashboard
          </Typography>

          <Box onClick={handleProfileMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, borderRadius: '8px', '&:hover': { bgcolor: '#f1f5f9' } }}>
            <Avatar sx={{ bgcolor: '#2463eb', width: 36, height: 36, fontSize: '0.875rem' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'E'}
            </Avatar>
          </Box>

          <Menu anchorEl={anchorEl} open={profileMenuOpen} onClose={handleProfileMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 200, borderRadius: '12px' } }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{user?.name || 'Employee'}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email || 'employee@example.com'}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon sx={{ minWidth: 36 }}><PersonIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}><LogoutIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflow: 'auto' }}>
        {children}
      </Box>
    </Box>
  );
}

