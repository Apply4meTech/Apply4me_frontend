'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  AppBar, 
  Toolbar, 
  useMediaQuery, 
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { initializeAuth, logout } from '../../store/authSlice';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 260;

// Logo SVG Component
const LogoIcon = ({ color = '#2463eb', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill={color}/>
    <path d="M12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10ZM12 14.5C11.17 14.5 10.5 13.83 10.5 13C10.5 12.17 11.17 11.5 12 11.5C12.83 11.5 13.5 12.17 13.5 13C13.5 13.83 12.83 14.5 12 14.5Z" fill={color}/>
  </svg>
);

import ArticleIcon from '@mui/icons-material/Article';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';

const getMenuItems = (userRole) => {
  const items = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/employee/dashboard' },
    { text: 'Profile', icon: <PersonIcon />, path: '/employee/profile' },
  ];

  // Add admin menu items for super_admin
  if (userRole === 'super_admin') {
    items.push(
      { text: 'Blogs', icon: <ArticleIcon />, path: '/employee/blogs' },
      { text: 'Job Titles', icon: <WorkIcon />, path: '/employee/admin/job-titles' },
      { text: 'Plan Management', icon: <AdminPanelSettingsIcon />, path: '/employee/admin/plans' },
      { text: 'Affiliates', icon: <PeopleIcon />, path: '/employee/admin/affiliates' }
    );
  }

  return items;
};

export default function EmployeeLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
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
    if (!isInitialized) return;
    // Check localStorage - if valid employee session exists, auth may still be initializing
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.isEmployee) return; // Valid employee session, auth will sync
        } catch (_) {}
      }
    }
    if (!isAuthenticated || !user?.isEmployee) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, user, router]);

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      // First check Redux state
      if (user?.profilePicture?.url) {
        setProfilePicture(user.profilePicture.url);
        return;
      }

      // If not in Redux, fetch from API
      if (!isAuthenticated) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
        const getApiUrl = () => {
          const url = API_URL;
          return url.endsWith('/api') ? url.slice(0, -4) : url;
        };

        const response = await fetch(`${getApiUrl()}/api/employee/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success && data.employee && data.employee.profilePicture) {
          setProfilePicture(data.employee.profilePicture.url);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    if (isInitialized && isAuthenticated) {
      fetchProfilePicture();
    }
  }, [isInitialized, isAuthenticated, user?.profilePicture]);

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    dispatch(logout());
    router.push('/login');
  };

  if (!isInitialized || !isAuthenticated || !user?.isEmployee) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const sidebar = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ 
        height: '64px', 
        display: 'flex', 
        alignItems: 'center', 
        px: 3,
        borderBottom: '1px solid #e2e8f0',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogoIcon color="#2463eb" size={32} />
          <Typography sx={{ color: '#0f172a', fontSize: '1.125rem', fontWeight: 700, letterSpacing: '0.02em' }}>
            APPLY FOR ME
          </Typography>
        </Link>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, p: 2 }}>
        {getMenuItems(user?.role).map((item) => {
          const isActive = pathname === item.path || (item.path !== '/employee/dashboard' && pathname?.startsWith(item.path));
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: '8px',
                  bgcolor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2463eb' : '#64748b',
                  '&:hover': {
                    bgcolor: isActive ? '#eff6ff' : '#f1f5f9',
                    color: '#2463eb',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              bgcolor: 'white',
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: 'white',
            },
          }}
        >
          {sidebar}
        </Drawer>
      )}

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderLeft: !isMobile ? '1px solid #e2e8f0' : 'none' }}>
        {/* Top Header */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            bgcolor: 'white', 
            borderBottom: '1px solid #e2e8f0',
            height: '64px',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', height: '64px', minHeight: '64px !important' }}>
            {/* Left side - Menu button (mobile) or Page title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#64748b' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {!isMobile && (
                <Typography sx={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 600 }}>
                  {getMenuItems(user?.role).find(item => item.path === pathname || (item.path !== '/employee/dashboard' && pathname?.startsWith(item.path)))?.text || 'Dashboard'}
                </Typography>
              )}
            </Box>

            {/* Right side - Avatar with dropdown */}
            <Box 
              onClick={handleProfileMenuOpen}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                cursor: 'pointer',
                p: 0.5,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              <Avatar 
                src={profilePicture || user?.profilePicture?.url || undefined}
                sx={{ bgcolor: '#2463eb', width: 36, height: 36, fontSize: '0.875rem' }}
              >
                {!profilePicture && !user?.profilePicture?.url && (user?.name?.charAt(0)?.toUpperCase() || 'E')}
              </Avatar>
              {!isMobile && (
                <>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
                      {user?.name || 'Employee'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.2 }}>
                      {user?.email || 'employee@example.com'}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={profileMenuOpen}
              onClose={handleProfileMenuClose}
              onClick={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: '12px',
                  '& .MuiMenuItem-root': {
                    px: 2,
                    py: 1.5,
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={profilePicture || user?.profilePicture?.url || undefined}
                  sx={{ bgcolor: '#2463eb', width: 40, height: 40 }}
                >
                  {!profilePicture && !user?.profilePicture?.url && (user?.name?.charAt(0)?.toUpperCase() || 'E')}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>
                    {user?.name || 'Employee'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {user?.email || 'employee@example.com'}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
              <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

