import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, Typography, Link, Snackbar } from '@mui/material';
import { useState } from 'react';
import * as yup from 'yup';

const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
});

const signupValidationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  name: yup
    .string()
    .required('Name is required'),
});

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDialog({ open, onClose }: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; name?: string}>({});
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { setUser } = useAuth();
  

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await loginValidationSchema.validate({ email, password }, { abortEarly: false });
        // todo: api to login
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          setToastMessage(data.message);
          setOpenToast(true);
          return;
        }
        onClose();
        setToastMessage('Login successful');
        setOpenToast(true);
        setUser(data.user);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2);
      } else {
        await signupValidationSchema.validate({ email, password, name }, { abortEarly: false });
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();

        if (!response.ok) {
          onClose();
          setToastMessage(JSON.stringify(data.errors));
          setOpenToast(true);
          return;
        } else {
          onClose();
          setToastMessage(JSON.stringify(data.message));
          setOpenToast(true);
        }
      }
      onClose(); // callback
    } catch (err) {
      console.log('==> handleSubmit Error:', err)
      if (err instanceof yup.ValidationError) {
        const newErrors = err.inner.reduce((acc, error) => ({
          ...acc,
          [error.path!]: error.message
        }), {});
        setErrors(newErrors);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{isLogin ? 'Login' : 'Sign Up'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            {!isLogin && (
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ flexDirection: 'column', alignItems: 'center', pb: 2 }}>
          <Button onClick={handleSubmit} variant="contained" sx={{ width: '200px' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {isLogin ? "Not registered yet? " : "Already have an account? "}
            <Link component="button" onClick={toggleMode} underline="hover">
              {isLogin ? "Sign up here" : "Login here"}
            </Link>
          </Typography>
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