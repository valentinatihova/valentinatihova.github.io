import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const Article = lazy(() => import('./pages/Article').then((module) => ({ default: module.Article })));
const Resume = lazy(() => import('./pages/Resume').then((module) => ({ default: module.Resume })));
const FeedingSpiralMockupPage = lazy(() =>
  import('./pages/FeedingSpiralMockupPage').then((module) => ({ default: module.FeedingSpiralMockupPage })),
);

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 text-stone-50 flex items-center justify-center px-6">
          <div className="rounded-3xl border border-stone-800 bg-stone-950/60 px-6 py-5 text-center backdrop-blur-sm">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-stone-400">Loading</div>
            <div className="mt-3 font-serif text-xl text-stone-100">Loading…</div>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/lab/feeding-diary-mockup" element={<FeedingSpiralMockupPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
