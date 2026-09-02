import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between px-6 py-10">
      <div className="mt-10">
        <img src="/logo.png" alt="E-connect" className="h-14 w-auto mb-6" />
        <h1 className="font-display font-extrabold text-3xl text-ink leading-tight">
          Find work. Offer services.<br /> Buy & sell locally.
        </h1>
        <p className="text-ink/60 mt-3">
          E-connect links people across Eswatini for jobs, short tasks, services, and everyday buying and selling — built on trust.
        </p>
      </div>
      <div className="space-y-3">
        <Link to="/register" className="block w-full text-center bg-teal text-white font-semibold py-3.5 rounded-xl2">
          Create an account
        </Link>
        <Link to="/login" className="block w-full text-center border border-teal text-teal font-semibold py-3.5 rounded-xl2">
          Log in
        </Link>
      </div>
    </div>
  );
}