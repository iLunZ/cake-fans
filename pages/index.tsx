import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';

type Cake = {
  id: string
  name: string
  imageUrl: string
  comment: string
  yumFactor: number
  user: {
    id: string
    name: string
  }
  createdAt: string
}

type CakesResponse = {
  cakes: Cake[]
  metadata: {
    currentPage: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

type QueryParams = {
  page: number
  limit: number
}
// const cakes = [
//   { id: 1, name: 'Chocolate Cake', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg' },
//   { id: 2, name: 'Strawberry Cheesecake', image: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg' },
//   { id: 3, name: 'Red Velvet', image: 'https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg' },
//   { id: 4, name: 'Carrot Cake', image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg' },
//   { id: 5, name: 'Black Forest', image: 'https://images.pexels.com/photos/2144112/pexels-photo-2144112.jpeg' },
//   { id: 6, name: 'Vanilla Bean', image: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg' },
// ];

export default function Home() {
  const [cakes, setCakes] = useState<Cake[]>([])
  const [loading, setLoading] = useState(true)
  const [metadata, setMetadata] = useState<CakesResponse['metadata']>()
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    limit: 10
  })
  useEffect(() => {
    const fetchCakes = async () => {
      const queryString = new URLSearchParams({
        page: query.page.toString(),
        limit: query.limit.toString()
      }).toString()
      const response = await fetch(`/api/cakes?${queryString}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data: CakesResponse = await response.json()
      setCakes(data.cakes)
      setMetadata(data.metadata)
      setLoading(false)
    }

    fetchCakes()
  }, [query])
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setQuery(prev => ({ ...prev, page }))
  }
  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    )
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Our Delicious Cakes 🎂
      </Typography>
      
      {cakes.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}>
          <Typography variant="h6" color="text.secondary">
            No cakes found 🍰
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Be the first one to share a delicious cake!
          </Typography>
        </Box>
      ):(
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
                  image={cake.imageUrl}
                  alt={cake.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" align="center">
                    {cake.name}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Posted by: {cake.user.name}
                    </Typography>
                    <Typography variant="body2">
                      {new Date(cake.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {metadata && cakes.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={metadata.totalPages}
            page={metadata.currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}