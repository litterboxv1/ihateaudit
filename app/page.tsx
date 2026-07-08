import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-red-500/30">
      
      {/* GLOBAL NAVIGATION */}
      <nav className="flex items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6 py-4 backdrop-blur-md md:px-12">
        <div className="text-2xl font-black tracking-tight">
          I<span className="text-red-500">Hate</span>Audit
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden text-sm font-bold text-zinc-400 transition-colors hover:text-white sm:block">
            Sign In
          </Link>
          <Link href="/audit" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
            Enter Vault
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 pb-20 pt-24 text-center md:pt-32">
        <h1 className="mb-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Master CA Audit <br className="hidden md:block" />
          <span className="text-zinc-500">Without the Headache.</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-400">
          A streamlined, distraction-free vault for conquering Standards on Auditing, Professional Ethics, and advanced company audit concepts. Built for CA professionals who want to get in, learn, and get out.
        </p>

        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
          <Link href="/audit" className="w-full rounded-xl bg-white px-8 py-4 text-lg font-bold text-black transition-colors hover:bg-zinc-200 sm:w-auto">
            Start Learning Now
          </Link>
          <Link href="/login" className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-zinc-800 sm:w-auto sm:hidden">
            Sign In
          </Link>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-32 grid w-full max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-3">
          
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="mb-4 text-2xl text-red-500">🎯</div>
            <h3 className="mb-2 text-lg font-bold">Zero Fluff</h3>
            <p className="text-sm text-zinc-500">
              No overwhelming textbooks. Just the core concepts tested in the exams, stripped down to what actually matters.
            </p>
          </div>
          
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="mb-4 text-2xl text-red-500">⚡️</div>
            <h3 className="mb-2 text-lg font-bold">Frictionless Tracking</h3>
            <p className="text-sm text-zinc-500">
              Mark topics as complete and instantly see your progression bar fill up. Stay motivated and track exactly where you are.
            </p>
          </div>
          
          <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-6">
            <div className="mb-4 text-2xl text-red-500">📱</div>
            <h3 className="mb-2 text-lg font-bold">Study Anywhere</h3>
            <p className="text-sm text-zinc-500">
              Perfectly responsive UI. Whether you are deep-focusing at your desk or doing a quick review on your iPad, the layout adapts instantly.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
