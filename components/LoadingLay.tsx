import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Add this component
export const LoadingOverlay = () => (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 9999,
    }}
  >
    <CircularProgress />
  </Box>
);