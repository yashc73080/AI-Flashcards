'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/navigation';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button } from '@mui/material';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';

const FlashcardsPage = () => {

    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [currentFlashcards, setCurrentFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
      async function getFlashcardSets() {
        if (!user) return;
        const docRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const sets = docSnap.data().flashcardSets || [];
          setFlashcardSets(sets);
        } else {
          await setDoc(docRef, { flashcardSets: [] });
        }
      }
      getFlashcardSets();
    }, [user]);

    // const handleCardClick = async (set) => {
    //   const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), set);
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     setCurrentFlashcards(docSnap.data().flashcards);
    //   } else {
    //     setCurrentFlashcards([]);
    //   }
    //   router.push(`/flashcard?set=${encodeURIComponent(JSON.stringify(set))}`);
    //   console.log('Successfully clicked on: ', set, 'with name: ', set.name);
    // };

    const handleCardClick = (set) => {
      router.push(`/flashcard?set=${encodeURIComponent(JSON.stringify(set))}`);
    };

    const handleGeneratePageClick = () => {
      router.push('/generate');
    };

      return (
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Saved Flashcard Sets
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleGeneratePageClick}
            sx={{ mb: 4 }}
          >
            Go to Generate Page
          </Button>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcardSets.map((set, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(set.name)}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {set.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
        </Container>
      );
};

// TODO Make it possible to change how many cards are generated and then display that number on this page

export default FlashcardsPage;