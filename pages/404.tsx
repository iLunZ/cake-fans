import { Container, Typography, Button, Box } from '@mui/material'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  return (
    <Container>
      <Box 
        sx={{ 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Page Not Found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => router.push('/')}
          sx={{ mt: 4 }}
        >
          Go Back Home
        </Button>
      </Box>
    </Container>
  )
}
