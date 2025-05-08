'use client';

export default function Footer() {
  return (
    <footer className="bg-dark-800 text-dark-300 mt-auto py-2 text-sm border-t border-dark-700">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs">
          Use subject to the <a href="https://fatduckgaming.com/server-docs/rules/rules-overview" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">FDG Rules</a> and broader principles of fair use. {new Date().getFullYear()} | Made with <span className="text-red-500">❤️</span> from Bandit
        </p>
      </div>
    </footer>
  );
} 