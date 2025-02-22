import { Container, Typography, Grid, Card, CardMedia, CardContent, Box, Pagination, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';



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

const cakeValidationSchema = yup.object({
  name: yup.string().required('Cake name is required'),
  imageUrl: yup.string().required('Image URL is required').url('Must be a valid URL'),
  comment: yup.string()
    .required('Comment is required')
    .min(5, 'Comment must be at least 5 characters')
    .max(200, 'Comment must not exceed 200 characters'),
  yumFactor: yup.number()
    .required('Yum factor is required')
    .min(1, 'Yum factor must be between 1 and 5')
    .max(5, 'Yum factor must be between 1 and 5')
});

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<CakesResponse['metadata']>();
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
    limit: 6
  });
  const [open, setOpen] = useState(false);
  const [cakeData, setCakeData] = useState({
    name: '',
    imageUrl: '',
    comment: '',
    yumFactor: 1
  });
  const [errors, setErrors] = useState<{
    name?: string;
    imageUrl?: string;
    comment?: string;
    yumFactor?: string;
  }>({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchCakes = async () => {
    const queryString = new URLSearchParams({
      page: query.page.toString(),
      limit: query.limit.toString()
    }).toString();
    const response = await fetch(`/api/cakes?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: CakesResponse = await response.json();
    setCakes(data.cakes);
    setMetadata(data.metadata);
    setLoading(false);
  };
  useEffect(() => {
    fetchCakes();
  }, [query]);
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setQuery(prev => ({ ...prev, page }));
  };

  const handlePost = () => {
    if(!user) {
      setToastMessage('You must be logged in to post a cake');
      setOpenToast(true);
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const validatedData = await cakeValidationSchema.validate(cakeData, {
        abortEarly: false,
      });
  
      const response = await fetch('/api/cakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setToastMessage(JSON.stringify(data.message));
        setOpenToast(true);
        return;
      }
      setOpen(false);
      setToastMessage('Cake added successfully');
      setOpenToast(true);
      setCakeData({
        name: '',
        imageUrl: '',
        comment: '',
        yumFactor: 1
      });
      // Refresh cakes list
      await fetchCakes();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors = err.inner.reduce((acc, error) => ({
          ...acc,
          [error.path!]: error.message
        }), {});
        setErrors(newErrors);
      }
    }
  };
  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }
  return (
    <>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
              sx={{ mt: 2 }}
            >
              Add New Cake
            </Button>
          </Box>
        ):(
          <Grid container spacing={3}>
            {cakes.map((cake) => (
              <Grid item key={cake.id} xs={12} sm={6} md={4}>
                <Card 
                  onClick={() => router.push(`/${cake.id}`)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover, &:active': {
                      transform: 'scale(1.03)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      cursor: 'pointer'
                    }
                  }}
                >
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
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => {handlePost();}}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Cake</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Cake Name"
              value={cakeData.name}
              onChange={(e) => setCakeData({ ...cakeData, name: e.target.value })}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              fullWidth
              label="Image URL"
              value={cakeData.imageUrl}
              onChange={(e) => setCakeData({ ...cakeData, imageUrl: e.target.value })}
              margin="normal"
              required
              error={!!errors.imageUrl}
              helperText={errors.imageUrl}
            />
            <TextField
              fullWidth
              label="Comment"
              value={cakeData.comment}
              onChange={(e) => setCakeData({ ...cakeData, comment: e.target.value })}
              margin="normal"
              multiline
              rows={4}
              required
              error={!!errors.comment}
              helperText={errors.comment}
            />
            <TextField
              fullWidth
              label="Yum Factor (1-5)"
              type="number"
              value={cakeData.yumFactor}
              onChange={(e) => setCakeData({ ...cakeData, yumFactor: parseInt(e.target.value) })}
              margin="normal"
              required
              error={!!errors.yumFactor}
              helperText={errors.yumFactor}
              InputProps={{
                inputProps: { min: 1, max: 5 }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}
        message={toastMessage}
      />
    </>
  );
}