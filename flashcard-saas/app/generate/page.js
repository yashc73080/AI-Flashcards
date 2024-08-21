'use client';

import { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Dialog, DialogContent, DialogTitle, 
    DialogContentText, DialogActions, } from '@mui/material';
import { doc, setDoc, getDoc, writeBatch, collection } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { db, auth } from '../../firebase';
import { useUser, useAuth } from "@clerk/nextjs";

const GeneratePage = () => {

    const { user } = useUser();
    const { userId, getToken } = useAuth();
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleSubmit = async () => {
        // API Call
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }
        
        try {
            const response = await fetch('/api/generate', {
            method: 'POST',
            body: text,
            })
        
            if (!response.ok) {
            throw new Error('Failed to generate flashcards')
            }
        
            const data = await response.json()
            setFlashcards(data)
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        }
    }

    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    // const saveFlashcards = async () => {
    //     if (!setName.trim()) {
    //       alert('Please enter a name for your flashcard set.')
    //       return
    //     }
      
    //     try {
    //         const userDocRef = doc(collection(db, 'users'), user.id)
    //         const userDocSnap = await getDoc(userDocRef)
    //         const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      
    //     //   const batch = writeBatch(db)
      
    //       if (userDocSnap.exists()) {
    //         const userData = userDocSnap.data()
    //         const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
    //         await setDoc(userDocRef, { flashcardSets: updatedSets }, { merge: true });
    //         // batch.update(userDocRef, { flashcardSets: updatedSets })
    //       } else {
    //         // batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
    //         await setDoc(userDocRef, { flashcardSets: [{ name: setName }] });
    //       }

    //       await setDoc(setDocRef, { flashcards });
      
    //     //   batch.set(setDocRef, { flashcards })
      
    //     //   await batch.commit()
      
    //       alert('Flashcards saved successfully!')
    //       handleCloseDialog()
    //       setSetName('')
    //     } 
    //     catch (error) {
    //       console.error('Error saving flashcards:', error)
    //       alert('An error occurred while saving flashcards. Please try again.')
    //     }
    // }

    const saveFlashcards = async () => {
        if (!setName.trim()) {
          alert("Please enter a name for your flashcard set.");
          return;
        }
      
        try {
          const token = await getToken({ template: "integration_firebase" });
          const userCredentials = await signInWithCustomToken(auth, token || "");
      
          const userDocRef = doc(collection(db, "users"), userId);
          const userDocSnap = await getDoc(userDocRef);
      
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
            await setDoc(userDocRef, { flashcardSets: updatedSets }, { merge: true });
          } else {
            await setDoc(userDocRef, { flashcardSets: [{ name: setName }] });
          }
      
          const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
          await setDoc(setDocRef, { flashcards });
      
          alert("Flashcards saved successfully!");
          handleCloseDialog();
          setSetName("");
        } 
        catch (error) {
          console.error("Error saving flashcards:", error);
          alert("An error occurred while saving flashcards. Please try again.");
        }
      };
      

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                Generate Flashcards
                </Typography>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label="Enter text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'lightblue',
                            },
                            '&:hover fieldset': {
                                borderColor: 'lightblue',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'lightblue',
                            },
                        },
                    }}
                    InputProps={{
                        style: {
                            color: 'white',
                        },
                    }}
                />
                <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                >
                Generate Flashcards
                </Button>
            </Box>
            
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Generated Flashcards
                    </Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Front:</Typography>
                                        <Typography>{flashcard.front}</Typography>
                                        <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                                        <Typography>{flashcard.back}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                )}

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                        Save Flashcards
                    </Button>
                </Box>
            )}

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Save Flashcard Set</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcard set.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Set Name"
                        type="text"
                        fullWidth
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={() => saveFlashcards(user)} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    );
};

export default GeneratePage;