import { GetServerSideProps } from 'next';
import { Container, Typography, Box, Card, CardMedia, Divider, Stack, Breadcrumbs, Link, Fab, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, IconButton } from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CommentIcon from '@mui/icons-material/Comment';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';


const commentValidationSchema = yup.object({
  comment: yup.string()
    .required('Comment is required')
    .min(5, 'Comment must be at least 5 characters')
    .max(200, 'Comment must not exceed 200 characters'),
  yumFactor: yup.number()
    .required('Yum factor is required')
    .min(1, 'Yum factor must be between 1 and 5')
    .max(5, 'Yum factor must be between 1 and 5')
});

type Comment = {
  id: number
  comment: string
  createdAt: string
  yumFactor: number
  user: {
    id: number
    name: string
  }
}
type Cake = {
  id: number
  name: string
  imageUrl: string
  user: {
    id: number
    name: string
  }
  comments: [Comment]
  createdAt: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  console.log('----id', id);
  if(isNaN(Number(id))) {
    return {
      notFound: true
    };
  }
  const apiUrl = process.env.NODE_ENV === 'development' ? process.env.NEXT_PUBLIC_API_URL : 'https://cake-fans.vercel.app';
  const response = await fetch(`${apiUrl}/api/cakes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 404) {
    return {
      notFound: true // This will trigger the 404 page
    };
  }
  const cake = await response.json();

  return {
    props: {
      cake
    }
  };
};

export default function CakeDetail({ cake }: { cake: Cake }) {
  const [open, setOpen] = useState(false);
  const [commentData, setCommentData] = useState({
    comment: '',
    yumFactor: 1
  });
  const [errors, setErrors] = useState<{comment?: string; yumFactor?: string}>({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setCommentData({
        comment: '',
        yumFactor: 1
      });
      setErrors({});
    }
  }, [open]);
  const handleDelete = async () => {
    const response = await fetch(`/api/cakes/${cake.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (response.ok) {
      setToastMessage('Cake deleted successfully');
      setOpenToast(true);
      router.push('/');
    } else {
      setToastMessage(data.message);
      setOpenToast(true);
    }
  };
  const handleSubmit = async () => {
    try {
      await commentValidationSchema.validate(commentData, { abortEarly: false });
      // TODO: API call to submit comment
      const response = await fetch(`/api/comment/${cake.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setToastMessage(data.message);
        setOpenToast(true);
        return;
      }
      setOpen(false);
      setToastMessage('Comment added successfully');
      setOpenToast(true);
      setCommentData({
        comment: '',
        yumFactor: 1
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
  return (
    <>
      <Head>
        <title>{cake.name} - Cake Fans</title>
        <meta name="description" content={`Come on! Look at this delicious ${cake.name} shared by ${cake.user.name}`} />
        <meta property="og:image" content={cake.imageUrl} />
      </Head>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          sx={{ mb: 3 }}
        >
          <Link 
            href="/"
            underline="hover" 
            color="inherit"
            sx={{ cursor: 'pointer' }}
          >
            Home
          </Link>
          <Typography
            color="text.primary"
            sx={{ 
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {cake.name}
          </Typography>
        </Breadcrumbs>
        <Card>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="400"
              image={cake.imageUrl}
              alt={cake.name}
              sx={{ objectFit: 'cover' }}
            />
            {user && user.id === cake.user.id && (
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
                onClick={() => setOpenConfirm(true)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom align="center">
              {cake.name}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Posted by {cake.user.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date(cake.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>

            <Stack spacing={2}>
              {cake.comments.map(comment => (
                <Box key={comment.id} sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {[...Array(comment.yumFactor)].map((_, index) => (
                      <StarIcon key={index} sx={{ color: '#FFD700', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    {comment.comment}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {comment.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Card>
      </Container>
      <Fab 
        color="primary" 
        aria-label="add comment"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <CommentIcon />
      </Fab>
      <Dialog maxWidth="sm" fullWidth open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Comment"
            value={commentData.comment}
            onChange={(e) => setCommentData({ ...commentData, comment: e.target.value })}
            error={!!errors.comment}
            helperText={errors.comment}
            margin="normal"
          />
          <TextField
            fullWidth
            type="number"
            label="Yum Factor (1-5)"
            value={commentData.yumFactor}
            onChange={(e) => setCommentData({ ...commentData, yumFactor: parseInt(e.target.value) })}
            error={!!errors.yumFactor}
            helperText={errors.yumFactor}
            InputProps={{ inputProps: { min: 1, max: 5 } }}
            margin="normal"
          />
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
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Delete Cake</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this cake? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}