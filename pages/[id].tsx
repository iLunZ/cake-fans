import { GetServerSideProps } from 'next'
import { Container, Typography, Box, Card, CardMedia, Divider, Stack, Breadcrumbs, Link } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

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
  const { id } = context.params!
  console.log('----id', id)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cakes/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const cake = await response.json()

  return {
    props: {
      cake
    }
  }
}
export default function CakeDetail({ cake }: { cake: Cake }) {
  return (
    <>
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
          <CardMedia
            component="img"
            height="400"
            image={cake.imageUrl}
            alt={cake.name}
            sx={{ objectFit: 'cover' }}
          />
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
                    {comment.yumFactor}
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
    </>
  )
}