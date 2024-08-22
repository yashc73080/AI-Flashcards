'use client';

import { AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { loadStripe } from '@stripe/stripe-js';
import PricingPlan from './pricingplan';
import FeatureItem from './featureitem';

const LandingPage = () => {

    const handleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: { origin: 'http://localhost:3000' },
        })
        const checkoutSessionJson = await checkoutSession.json()
      
        const stripe = await loadStripe()
        const {error} = await stripe.redirectToCheckout({
          sessionId: checkoutSessionJson.id,
        })
      
        if (error) {
          console.warn(error.message)
        }
      }

    return (
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        Flashcard SaaS
                    </Typography>
                    <Box>
                        <SignedOut>
                            <Button color="inherit" href="/sign-in">
                                Sign In
                            </Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box sx={{textAlign: 'center', my: 4}}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to Flashcard SaaS
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    The easiest way to create flashcards from your text.
                </Typography>
                    <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
                    Get Started
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    sx={{mt: 2}}
                    onClick={() => {
                        const pricingSection = document.getElementById('pricing-section');
                        if (pricingSection) {
                            pricingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                >
                    Learn More
                </Button>
            </Box>

            <Box sx={{ my: 6, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Features
                </Typography>
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
                    {/* Feature items */}
                    <Grid item>
                    <FeatureItem
                        icon={<i className="fas fa-magic"></i>}
                        title="Easy to Use"
                        description="Create flashcards with just a few clicks"
                    />
                    </Grid>
                    <Grid item>
                        <FeatureItem
                            icon={<i className="fas fa-sync"></i>}
                            title="Sync Across Devices"
                            description="Access your flashcards from anywhere"
                        />
                    </Grid>
                    <Grid item>
                        <FeatureItem
                            icon={<i className="fas fa-chart-line"></i>}
                            title="Personalized Learning"
                            description="Adaptive algorithms to optimize your learning"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box id="pricing-section" sx={{ my: 6, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Pricing
                </Typography>
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 1 }}>
                    {/* Pricing plans */}
                    <Grid item>
                        <PricingPlan
                            plan={{
                            name: 'Free',
                            price: 0,
                            description: 'Get started with our free plan',
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <PricingPlan
                            plan={{
                            name: 'Pro',
                            price: 1.99,
                            description: 'Unlock advanced features',
                            }}
                        />
                    </Grid>
                        <Grid item>
                        <PricingPlan
                            plan={{
                            name: 'Plus',
                            price: 4.99,
                            description: 'Enjoy our premium plan',
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

        </Box>
    );
};

export default LandingPage;