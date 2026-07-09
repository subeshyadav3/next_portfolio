

import Image from 'next/image';
import '@/app/globals.css';


export default function SplashScreen() {

  return (
    <div className="splash-container">
      <Image
        src="/logo.svg"
        alt="Logo"
        width={100}
        height={100}
        className="splash-logo"
      />
    </div>
  );
}
