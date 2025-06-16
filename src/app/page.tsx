import { Suspense } from 'react';
import Snapshot from './snapshot';


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
      <Snapshot/>
    </Suspense>
  );
}
