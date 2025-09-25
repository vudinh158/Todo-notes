import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {
  const [form, setForm] = useState({ title: "", dueAt: "" });
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [query, setQuery] = useState({ status: "all", page: 1, limit: 5 });

  const fetchList = async () => {
    const params = {
      page: query.page,
      limit: query.limit,
    };
    if (query.status !== "all") params.status = query.status;
    const res = await api.get("/todos", { params });
    setData(res.data);
  };

  useEffect(() => { fetchList(); }, [query.page, query.status, query.limit]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api.post("/todos", form);
    setForm({ title: "", dueAt: "" });
    setQuery({ ...query, page: 1 });
  };

  const onToggle = async (id, completed) => {
    await api.put(`/todos/${id}`, { completed: !completed });
    fetchList();
  };

  const onDelete = async (id) => {
    await api.delete(`/todos/${id}`);
    fetchList();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Todo List</h1>

      <form onSubmit={onCreate} className="flex gap-2">
        <input
          className="border px-3 py-2 flex-1 rounded"
          placeholder="New task..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={form.dueAt}
          onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
        />
        <button className="px-4 py-2 rounded bg-black text-white">Add</button>
      </form>

      <div className="flex items-center gap-2">
        <label>Status:</label>
        <select
          className="border px-2 py-1 rounded"
          value={query.status}
          onChange={(e) => setQuery({ ...query, status: e.target.value, page: 1 })}
        >
          <option value="all">All</option>
          <option value="false">Active</option>
          <option value="true">Completed</option>
        </select>
      </div>

      <ul className="space-y-2">
        {data.items.map((t) => (
          <li key={t._id} className="border rounded p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => onToggle(t._id, t.completed)}
              />
              <span className={t.completed ? "line-through opacity-60" : ""}>{t.title}</span>
            </div>
            <button onClick={() => onDelete(t._id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          className="border px-3 py-1 rounded"
          disabled={data.page <= 1}
          onClick={() => setQuery({ ...query, page: data.page - 1 })}
        >
          Prev
        </button>
        <span>Page {data.page} / {data.pages}</span>
        <button
          className="border px-3 py-1 rounded"
          disabled={data.page >= data.pages}
          onClick={() => setQuery({ ...query, page: data.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
