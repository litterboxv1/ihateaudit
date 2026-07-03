import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6 selection:bg-red-500/30">
      <div className="z-10 w-full max-w-4xl flex-col items-center justify-center text-center font-sans">
        
        {/* Main Title */}
        <h1 className="mb-6 text-6xl font-black tracking-tight text-white sm:text-8xl">
          IHate<span className="text-red-600">Audit</span>
        </h1>
        
        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-zinc-400 sm:text-xl">
          Because Audit hates you too!
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/audit" 
            className="flex items-center justify-center rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-red-500 active:scale-95"
          >
            Get Started
          </Link>
        </div>

      </div>
    </main>
  );
}
