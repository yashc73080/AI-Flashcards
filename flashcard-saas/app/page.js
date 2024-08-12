'use client';

import GeneratePage from "./generate/page";
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();

  // if (pathname === '/generate') {
	// 	return <GeneratePage />;
	// }

  return <GeneratePage />;
}

export default Page;