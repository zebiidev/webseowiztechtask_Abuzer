'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

interface Idea {
  _id: string;
  title: string;
  description: string;
  image?: string;
  createdAt?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadIdeas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ideas`);
      if (!response.ok) throw new Error('Unable to load ideas');
      const data = await response.json();
      setIdeas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ideas');
    }
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch(`${API_URL}/api/ideas`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Submission failed');
      }

      setTitle('');
      setDescription('');
      setImage(null);
      const fileInput = document.getElementById('image') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      await loadIdeas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Idea Board</p>
            <h1 className="mt-2 text-3xl font-semibold">Share your next big idea</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-0"
                placeholder="Enter idea title"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                placeholder="Describe your idea"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Image Upload</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(event: ChangeEvent<HTMLInputElement>) => setImage(event.target.files?.[0] || null)}
                className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {loading ? 'Submitting...' : 'Submit Idea'}
            </button>
          </form>

          {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Ideas</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{ideas.length} items</span>
          </div>
          {ideas.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No ideas yet. Submit the first one.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {ideas.map((idea) => (
                <article key={idea._id} className="overflow-hidden rounded-2xl border border-slate-200">
                  {idea.image ? <img src={idea.image} alt={idea.title} className="h-48 w-full object-cover" /> : null}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{idea.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{idea.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
