import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/welcome"), 1200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="h-screen bg-teal-dark flex flex-col items-center justify-center text-white">
            <img src="/logo1.png" alt="Netta" className="w-24 h-24 object-contain mb-4" />
      <h1 className="font-display font-bold text-2xl">Netta</h1> 
      <p className="text-white/60 text-sm mt-1">Jobs · Services · Marketplace · Eswatini</p>
    </div>
  );
}