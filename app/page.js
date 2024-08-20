'use client';

import LandingPage from "./landingpage/page";
import GeneratePage from "./generate/page";
import FlashcardsPage from "./flashcards/page";
import FlashcardPage from "./flashcard/page";
import resultPage from "./result/page";
import signInPage from "./sign-in/page";
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();
  
  if (pathname === '/generate') {
    return <GeneratePage />;
  }

  if (pathname === '/flashcards') {
		return <FlashcardsPage />;
	}

  if (pathname === '/flashcard') {
		return <FlashcardPage />;
	}

  if (pathname === '/result') {
    return <resultPage />;
  }

  if (pathname === '/sign-in') {
    return <signInPage />;
  }

  return <LandingPage />;
  
};

export default Page;