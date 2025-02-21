import { Container, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';

const cakes = [
  { id: 1, name: 'Chocolate Cake', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg' },
  { id: 2, name: 'Strawberry Cheesecake', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg' },
  { id: 3, name: 'Red Velvet', image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg' },
  { id: 4, name: 'Carrot Cake', image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg' },
  { id: 5, name: 'Black Forest', image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg' },
  { id: 6, name: 'Vanilla Bean', image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg' },
];

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Delicious Cakes 🎂
      </Typography>
      
      <Grid container spacing={3}>
        {cakes.map((cake) => (
          <Grid item key={cake.id} xs={12} sm={6} md={4}>
            <Card sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover, &:active': {
                transform: 'scale(1.03)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                cursor: 'pointer'
              }
            }}>
              <CardMedia
                component="img"
                height="200"
                image={cake.image}
                alt={cake.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" align="center">
                  {cake.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}