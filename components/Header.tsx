import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useLoginDialog } from '../contexts/LoginDialogContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import UserDrawer from './UserDrawer';

export default function Header() {
  const { openLoginDialog } = useLoginDialog();
  const { user, isLoading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Cake Fans
        </Typography>
        
        {!isLoading && user ? (
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton
            data-testid="header-login-button"
            color="inherit" 
            onClick={openLoginDialog}
          >
            <AccountCircleIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
      >
        <UserDrawer />
      </Drawer>
    </AppBar>
  );
}