import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
        backgroundAttachment: 'fixed',
        color: 'white',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          fontWeight: 700,
          fontFamily: 'Roboto, sans-serif',
          marginBottom: 4,
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        Welcome to UMIS
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontSize: '1.2rem',
          marginBottom: 6,
          maxWidth: '400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
        }}
      >
        A comprehensive management system for universities. Manage memos, approvals, and more with ease.
      </Typography>

      <Box display="flex" gap={3}>
        <Button
          onClick={() => navigate('/login')}
          variant="contained"
          color="primary"
          size="large"
          sx={{
            paddingX: 5,
            paddingY: 2,
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: '#1976d2',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Login
        </Button>
        <Button
          onClick={() => navigate('/register')}
          variant="contained"
          color="success"
          size="large"
          sx={{
            paddingX: 5,
            paddingY: 2,
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: '#388e3c',
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
