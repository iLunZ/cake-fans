import { 
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// interface UserDrawerProps {
//   user: {
//     name: string;
//     email: string;
//   } | null;
//   onLogoutClick: () => void;
// }

export default function UserDrawer() {
  const [openLogout, setOpenLogout] = useState(false);
  const { user, setUser } = useAuth();
  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include'
    });
  
    if (response.ok) {
      setUser(null);
      window.location.reload();
    }
  };
  return (
    <>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
            <ListItem>
            <ListItemIcon>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.name.charAt(0).toUpperCase()}
                </Avatar>
            </ListItemIcon>
            <ListItemText primary={user?.name} secondary={user?.email} />
            </ListItem>
            <ListItemButton onClick={()=> setOpenLogout(true)}>
              <ListItemIcon>
                  <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
        </List>
      </Box>
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
    </>
  );
}