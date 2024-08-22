'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSearchParams } from 'next/navigation';
import { doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box } from '@mui/material';

const FlashcardPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    const setParam = searchParams.get('set');
    const [set, setSet] = useState(null);

    useEffect(() => {
      if (setParam) {
        try {
          const parsedSet = JSON.parse(decodeURIComponent(setParam));
          setSet(parsedSet);
        } catch (error) {
          console.error('Error parsing set from URL:', error);
        }
      }
    }, [setParam]);
  

    useEffect(() => {
      async function getFlashcards() {
        if (!set || !user) return;
  
        const docRef = doc(collection(db, 'users', user.id, 'flashcardSets', set.name));
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setFlashcards(docSnap.data().flashcards);
        } else {
          setFlashcards([]);
        }
      }
      getFlashcards();
    }, [set, user]);

    const handleCardClick = (id) => {
      setFlipped((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    return (
        <Container maxWidth="md">
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box sx={{ /* Styling for flip animation */ }}> 
                        <div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
    );
};

export default FlashcardPage;