import { AppBar, Toolbar, Typography, Container } from '@mui/material'
import { useRouter } from 'next/router'

export default function Header() {
  const router = useRouter()

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Cake Fans
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}