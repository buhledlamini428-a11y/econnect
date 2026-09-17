import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { LISTING_TYPE_LIST } from "../constants/listingTypes";

export default function PostListing() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [type, setType] = useState("JOB");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "", description: "", categoryId: "", price: "", priceType: "fixed",
    employmentType: "", vacancies: "", durationValue: "", durationUnit: "hours",
    condition: "new", region: user?.region || "", city: user?.city || "",
  });
  const [photoUrls, setPhotoUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories", { params: { type } }).then((res) => setCategories(res.data.categories));
  }, [type]);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePhotoSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (photoUrls.length + files.length > 6) {
      setError("You can upload up to 6 photos");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const data = new FormData();
      files.forEach((f) => data.append("photos", f));
      const res = await api.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPhotoUrls((prev) => [...prev, ...res.data.urls]);
    } catch (err) {
      setError(err.response?.data?.error || "Photo upload failed");
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file
    }
  }

  function removePhoto(url) {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        type, title: form.title, description: form.description,
        categoryId: form.categoryId || undefined,
        price: form.price ? Number(form.price) : undefined,
        priceType: form.priceType,
        region: form.region, city: form.city,
        photos: photoUrls.length > 0 ? photoUrls : undefined,
      };
      if (type === "JOB") {
        payload.employmentType = form.employmentType || undefined;
        payload.vacancies = form.vacancies ? Number(form.vacancies) : undefined;
      }
      if (type === "TASK" || type === "SERVICE") {
        payload.durationValue = form.durationValue ? Number(form.durationValue) : undefined;
        payload.durationUnit = form.durationUnit;
      }
      if (type === "PRODUCT") payload.condition = form.condition;

         const res = await api.post("/listings", payload);
      showToast("Listing posted!");
      navigate(`/listing/${res.data.listing.id}`);
    } catch (err) {
      showToast("Could not create listing", "error");
      setError(err.response?.data?.error || "Could not create listing");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ivory page-scroll">
            <TopBar title="Post a listing" subtitle="Reach people near you in minutes" />
      <form onSubmit={handleSubmit} className="px-4 py-4 space-y-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
          {LISTING_TYPE_LIST.map((t) => (
            <button type="button" key={t.value} onClick={() => setType(t.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                type === t.value ? "bg-teal text-white shadow-sm" : "bg-white border border-black/10 text-ink/70 hover:border-teal/30"
              }`}>
              <span>{t.icon}</span> {t.singular}
            </button>
          ))}
        </div>

        <input placeholder="Title" value={form.title} onChange={(e) => update("title", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />
        <textarea placeholder="Description" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" required />

        <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}
          className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white">
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Photo upload */}
        <div>
          <label className="text-sm font-medium text-ink/70 block mb-1">Photos (up to 6)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {photoUrls.map((url) => (
              <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-black/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-0.5 right-0.5 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="inline-block bg-white border border-dashed border-black/20 text-ink/60 text-sm px-4 py-2.5 rounded-xl cursor-pointer">
            {uploading ? "Uploading..." : "+ Add photos"}
            <input
              type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple
              onChange={handlePhotoSelect} disabled={uploading} className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-2">
          <input placeholder="Price (SZL) — optional" type="number" value={form.price} onChange={(e) => update("price", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
          <select value={form.priceType} onChange={(e) => update("priceType", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white">
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </div>

        {type === "JOB" && (
          <>
            <select value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white">
              <option value="">Employment type</option>
              {["full_time", "part_time", "temporary", "casual", "contract", "remote", "local", "apprenticeship", "internship", "volunteer"].map((t) => (
                <option key={t} value={t}>{t.replace("_", " ")}</option>
              ))}
            </select>
            <input placeholder="Number of vacancies" type="number" value={form.vacancies} onChange={(e) => update("vacancies", e.target.value)}
              className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white" />
          </>
        )}

        {(type === "TASK" || type === "SERVICE") && (
          <div className="flex gap-2">
            <input placeholder="Duration" type="number" value={form.durationValue} onChange={(e) => update("durationValue", e.target.value)}
              className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
            <select value={form.durationUnit} onChange={(e) => update("durationUnit", e.target.value)}
              className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white">
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
        )}

        {type === "PRODUCT" && (
          <select value={form.condition} onChange={(e) => update("condition", e.target.value)}
            className="w-full border border-black/10 rounded-xl px-4 py-3 bg-white">
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        )}

        <div className="flex gap-2">
          <input placeholder="Region" value={form.region} onChange={(e) => update("region", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
          <input placeholder="City/Town" value={form.city} onChange={(e) => update("city", e.target.value)}
            className="w-1/2 border border-black/10 rounded-xl px-4 py-3 bg-white" />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading || uploading} className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl2 disabled:opacity-60">
          {loading ? "Posting..." : "Post listing"}
        </button>
      </form>
      <BottomNav />
    </div>
  );
}