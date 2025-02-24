import { Card, CardContent, Box, Skeleton } from '@mui/material';

export const CakeSkeleton = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" sx={{ fontSize: '1.25rem' }} />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </Box>
    </CardContent>
  </Card>
);
