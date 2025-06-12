import { Suspense } from 'react';
import Home from './home';



export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <video
          src="/images/dance.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: '60px', height: '60px' }}
        />
      </div>
    }>
      <Home/>
    </Suspense>
  );
}
