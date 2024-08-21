import { Box, Typography, Button } from '@mui/material';

const PricingPlan = ({ plan }) => {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        border: '1px solid #ccc',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: '#4d5ec1',
          '& .plan-name, & .plan-price': {
            color: '#000',
          },
        },
      }}
    >
      <Typography variant="h5" gutterBottom>
        {plan.name}
      </Typography>
      <Typography variant="h4" gutterBottom>
        ${plan.price}
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {plan.description}
      </Typography>
      <Button variant="contained" color="primary" fullWidth>
        Get Started
      </Button>
    </Box>
  );
};

export default PricingPlan;