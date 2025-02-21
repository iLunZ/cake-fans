import { AppBar, Toolbar, Typography, Avatar, IconButton } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useLoginDialog } from '../contexts/LoginDialogContext'

export default function Header({ user }: { user?: { name: string } }) {
  const { openLoginDialog } = useLoginDialog()

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">
          Cake Fans
        </Typography>
        
        {user ? (
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
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
    </AppBar>
  )
}