'use client';

import { Button, Container, Typography, Box, Paper, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome to ApplyForMe
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 3, mb: 2 }}>
          Material UI Icons Example
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button variant="contained" startIcon={<HomeIcon />}>
            Home
          </Button>
          <Button variant="outlined" startIcon={<SettingsIcon />}>
            Settings
          </Button>
          <Button variant="text" startIcon={<PersonIcon />}>
            Profile
          </Button>
          <Button variant="contained" color="secondary" startIcon={<EmailIcon />}>
            Contact
          </Button>
        </Stack>

        <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Material UI Components
          </Typography>
          <Typography variant="body1" paragraph>
            This is a Paper component with elevation. Material UI is now properly configured
            with theme support and icons.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can now use any Material UI components and icons throughout your application.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
