import { Box, Typography } from '@mui/material';

const FeatureItem = ({ icon, title, description }) => {
  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        border: '1px solid #ccc',
        transition: 'all 0.3s',
        '&:hover': {
          backgroundColor: '#4d5ec1',
        },
      }}
    >
      {icon}
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1">
        {description}
      </Typography>
    </Box>
  );
};

export default FeatureItem;