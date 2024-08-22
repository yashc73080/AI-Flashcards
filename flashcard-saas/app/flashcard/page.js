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
  
        console.log(db);
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
          <style>
            {`
              .flip-card {
                perspective: 1000px;
              }

              .flip-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                text-align: center;
                transition: transform 0.6s;
                transform-style: preserve-3d;
              }

              .flip-card:hover .flip-card-inner {
                transform: rotateY(180deg);
              }

              .flip-card-front, .flip-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
              }

              .flip-card-front {
                background-color: #fff;
                color: black;
              }

              .flip-card-back {
                background-color: #f1f1f1;
                color: black;
                transform: rotateY(180deg);
              }
            `}
          </style>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard) => (
              <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                    <CardContent>
                      <Box className="flip-card"> 
                        <div className={`flip-card-inner ${flipped[flashcard.id] ? 'flipped' : ''}`}>
                          <div className="flip-card-front">
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div className="flip-card-back">
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