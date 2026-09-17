import TopBar from "../components/TopBar";

export default function AboutNetta() {
  return (
    <div className="min-h-screen bg-ivory page-scroll">
      <TopBar title="About Netta" subtitle="Connection, opportunity, and trust" showBack />
      <div className="px-5 py-6 space-y-4">
        <img src="/logo.png" alt="Netta" className="h-16 w-auto mx-auto mb-2" />
        <p className="text-ink/70 text-sm leading-relaxed">
          Netta is a local jobs, services, tasks, buying and selling platform built for Eswatini. We connect people who need work
          or services with people who can provide them — without the noise of a typical social media app.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed">
          Whether you're looking for a job, offering a skill, selling something you no longer need, or trying to find someone
          reliable for a quick task, Netta is built to make that connection simple, safe, and local.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed">
          Every user builds a Trust Score over time based on real activity, verified identity, and reviews from others in the
          community — because trust is the foundation everything else on Netta is built on.
        </p>
        <p className="text-ink/40 text-xs text-center pt-4">Version 1.1.1 · Made for Eswatini 🇸🇿</p>
      </div>
    </div>
  );
}