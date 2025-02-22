import { AppBar, Toolbar, Typography, Avatar, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLoginDialog } from '../contexts/LoginDialogContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';



export default function Header() {
  const { openLoginDialog } = useLoginDialog();
  const { user, isLoading, setUser } = useAuth();
  const [openLogout, setOpenLogout] = useState(false);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
  
    if (response.ok) {
      setUser(null);
      setOpenLogout(false);
      window.location.reload();
    }
  };


  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Cake Fans
        </Typography>
        
        {!isLoading && user ? (
          <Avatar sx={{ bgcolor: 'secondary.main' }} onClick={() => setOpenLogout(true)}>
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <IconButton 
            color="inherit" 
            onClick={openLoginDialog}
          >
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>
      <Dialog open={openLogout} onClose={() => setOpenLogout(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          Are you sure you want to log out?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogout(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}