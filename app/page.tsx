import { initDatabase } from '@/lib/db';
import TabSystem from '@/components/TabSystem';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR for components that use localStorage
const GlobalStats = dynamic(() => import('@/components/GlobalStats'), { ssr: false });

// Initialize the database file if it doesn't exist
initDatabase()
  .catch(error => console.error('Failed to initialize database:', error));

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-4">
        <div className="flex justify-center mb-2" style={{ background: 'rgb(26, 26, 26)' }}>
          <img 
            src="/images/detective-duck.png"
            alt="Fat Duck Gaming Detective Logo"
            className="w-36 h-auto mb-2"
            style={{ background: 'rgb(26, 26, 26)' }}
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary-500">
          CheckFDG Inventory Calculator
        </h1>
        <p className="text-lg text-dark-200 mb-4">
          Calculate the total value of your inventory items instantly
        </p>
        
        <GlobalStats />
      </div>
      
      <TabSystem />
    </div>
  );
} 