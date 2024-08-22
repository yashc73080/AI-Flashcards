// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Dialog, DialogContent, DialogTitle, 
//     DialogContentText, DialogActions, } from '@mui/material';
// import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
// import { getAuth, signInWithCustomToken } from 'firebase/auth'
// import { db, auth } from '../../firebase';
// import { useUser, useAuth } from "@clerk/nextjs";

// const GeneratePage = () => {

//     const { user } = useUser();
//     const { userId, getToken } = useAuth();
//     const [text, setText] = useState('')
//     const [flashcards, setFlashcards] = useState([])
//     const [setName, setSetName] = useState('')
//     const [dialogOpen, setDialogOpen] = useState(false)
//     const [errorMessage, setErrorMessage] = useState('');
//     const router = useRouter();


//     const handleSubmit = async () => {
//         // API Call
//         if (!text.trim()) {
//             alert('Please enter some text to generate flashcards.')
//             return
//         }
        
//         try {
//             const response = await fetch('/api/generate', {
//             method: 'POST',
//             body: text,
//             })
        
//             if (!response.ok) {
//             throw new Error('Failed to generate flashcards')
//             }
        
//             const data = await response.json()
//             setFlashcards(data)
//         } catch (error) {
//             console.error('Error generating flashcards:', error)
//             alert('An error occurred while generating flashcards. Please try again.')
//         }
//     }

//     const handleOpenDialog = () => setDialogOpen(true)
//     const handleCloseDialog = () => setDialogOpen(false)

//     const saveFlashcards = async () => {
//         if (!setName.trim()) {
//           alert("Please enter a name for your flashcard set.");
//           return;
//         }
      
//         try {
//           const token = await getToken({ template: "integration_firebase" });
//           const userCredentials = await signInWithCustomToken(auth, token || "");
      
//           const userDocRef = doc(collection(db, "users"), userId);
//           const userDocSnap = await getDoc(userDocRef);
      
//           if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             const updatedSets = [...(userData.flashcardSets || []), { name: setName }];
//             await setDoc(userDocRef, { flashcardSets: updatedSets }, { merge: true });
//           } else {
//             await setDoc(userDocRef, { flashcardSets: [{ name: setName }] });
//           }
      
//           const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
//           await setDoc(setDocRef, { flashcards });
      
//           console.log("Flashcards saved successfully!");
//           setErrorMessage("Flashcards saved successfully!");
//           handleCloseDialog();
//           setSetName("");
//         } 
//         catch (error) {
//           console.error("Error saving flashcards:", error);
//           setErrorMessage("An error occurred while saving flashcards. Please try again.");
//         }
//       };

//       const handleViewSavedSets = () => {
//         router.push('/flashcards');
//       };
      

//     return (
//         <Container maxWidth="md">
//             <Box sx={{ my: 4 }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                 Generate Flashcards
//                 </Typography>
//                 <TextField
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     label="Enter text"
//                     fullWidth
//                     multiline
//                     rows={4}
//                     variant="outlined"
//                     sx={{
//                         mb: 2,
//                         '& .MuiOutlinedInput-root': {
//                             '& fieldset': {
//                                 borderColor: 'lightblue',
//                             },
//                             '&:hover fieldset': {
//                                 borderColor: 'lightblue',
//                             },
//                             '&.Mui-focused fieldset': {
//                                 borderColor: 'lightblue',
//                             },
//                         },
//                     }}
//                     InputProps={{
//                         style: {
//                             color: 'white',
//                         },
//                     }}
//                 />
//                 <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit}
//                 fullWidth
//                 >
//                 Generate Flashcards
//                 </Button>
//                 {flashcards.length === 0 && (
//                     <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
//                         <Button variant="contained" color="secondary" onClick={handleViewSavedSets} sx={{ ml: 2 }}>
//                             View Saved Sets
//                         </Button>
//                     </Box>
//                 )}
//             </Box>
            
//             {flashcards.length > 0 && (
//                 <Box sx={{ mt: 4 }}>
//                     <Typography variant="h5" component="h2" gutterBottom>
//                         Generated Flashcards
//                     </Typography>
//                     <Grid container spacing={2}>
//                         {flashcards.map((flashcard, index) => (
//                             <Grid item xs={12} sm={6} md={4} key={index}>
//                                 <Card>
//                                     <CardContent>
//                                         <Typography variant="h6">Front:</Typography>
//                                         <Typography>{flashcard.front}</Typography>
//                                         <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
//                                         <Typography>{flashcard.back}</Typography>
//                                     </CardContent>
//                                 </Card>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 </Box>
//                 )}

//             {flashcards.length > 0 && (
//                 <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
//                     <Button variant="contained" color="primary" onClick={handleOpenDialog}>
//                         Save Flashcards
//                     </Button>
//                     <Button variant="contained" color="secondary" onClick={handleViewSavedSets} sx={{ ml: 2 }}>
//                         View Saved Sets
//                     </Button>
//                 </Box>
//             )}

//             <Dialog open={dialogOpen} onClose={handleCloseDialog}>
//                 <DialogTitle>Save Flashcard Set</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         Please enter a name for your flashcard set.
//                     </DialogContentText>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Set Name"
//                         type="text"
//                         fullWidth
//                         value={setName}
//                         onChange={(e) => setSetName(e.target.value)}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleCloseDialog}>Cancel</Button>
//                     <Button onClick={() => saveFlashcards(user)} color="primary">
//                         Save
//                     </Button>
//                 </DialogActions>
//             </Dialog>

//             {errorMessage && (
//                 <Dialog open={!!errorMessage} onClose={() => setErrorMessage('')}>
//                     <DialogContent>
//                         <DialogContentText>{errorMessage}</DialogContentText>
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setErrorMessage('')} color="primary">
//                         OK
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             )}

//         </Container>
//     );
// };

// export default GeneratePage;

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Dialog, DialogContent, DialogTitle, 
    DialogContentText, DialogActions, IconButton, } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { db, auth } from '../../firebase';
import { useUser, useAuth } from "@clerk/nextjs";

const GeneratePage = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { userId, getToken } = useAuth();
    const [text, setText] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [setName, setSetName] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [generationCount, setGenerationCount] = useState(0);
    const [isPro, setIsPro] = useState(false);
    const [savedSets, setSavedSets] = useState(0);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
        } else if (user) {
            fetchUserData();
        }
    }, [user, isLoaded, isSignedIn, router]);

    const fetchUserData = async () => {
        if (!user) return;

        const userDocRef = doc(collection(db, 'users'), userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setGenerationCount(userData.generationCount || 0);
            setIsPro(userData.subscription?.status === 'pro');
            setSavedSets(userData.savedSets || 0);
        }
    };

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.');
            return;
        }

        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate flashcards');
            }

            const data = await response.json();
            setFlashcards(data);
            await fetchUserData(); // Refresh user data after generation
        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert(`An error occurred while generating flashcards: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        if (!isPro && savedSets >= 1) {
            alert("You've reached the limit for saved sets. Upgrade to Pro to save more.");
        } else {
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => setDialogOpen(false);

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert("Please enter a name for your flashcard set.");
            return;
        }

        if (!isSignedIn) {
            router.push('/sign-in');
            return;
        }

        setLoading(true);

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

            console.log("Flashcards saved successfully!");
            setErrorMessage("Flashcards saved successfully!");
            handleCloseDialog();
            setSetName("");
            await fetchUserData(); // Refresh user data after saving
        } 
        catch (error) {
            console.error("Error saving flashcards:", error);
            setErrorMessage("An error occurred while saving flashcards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewSavedSets = () => {
        router.push('/flashcards');
    };

    const handleGoHome = () => {
        router.push('/landingpage');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Generate Flashcards
                    </Typography>
                    <IconButton color="primary" onClick={handleGoHome}>
                        <HomeIcon />
                    </IconButton>
                </Box>
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
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                </Button>
                {flashcards.length === 0 && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="secondary" onClick={handleViewSavedSets} sx={{ ml: 2 }}>
                            View Saved Sets
                        </Button>
                    </Box>
                )}
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
                    <Button variant="contained" color="primary" onClick={handleOpenDialog} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Flashcards'}
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleViewSavedSets} sx={{ ml: 2 }}>
                        View Saved Sets
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

            {errorMessage && (
                <Dialog open={!!errorMessage} onClose={() => setErrorMessage('')}>
                    <DialogContent>
                        <DialogContentText>{errorMessage}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setErrorMessage('')} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default GeneratePage;
