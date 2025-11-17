"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Item = { id: number; name: string; image?: string | null };

export default function AdminPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState("");
    const [newImage, setNewImage] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [loaded, setLoaded] = useState(false);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Load items dari API
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/items");
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                    // Simpan ke sessionStorage untuk detail page
                    sessionStorage.setItem("adminItems", JSON.stringify(data));
                } else {
                    setItems([]);
                }
            } catch {
                setItems([]);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = () => res(String(fr.result));
            fr.onerror = rej;
            fr.readAsDataURL(file);
        });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) {
            setNewImage(null);
            return;
        }
        try {
            const b64 = await fileToBase64(f);
            setNewImage(b64);
        } catch {
            setNewImage(null);
        }
    };

    const addItem = async () => {
        const names = newItem.split(",").map(s => s.trim()).filter(Boolean);
        if (names.length === 0) return;

        for (const name of names) {
            try {
                const res = await fetch("/api/items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, image: newImage ?? null }),
                });
                if (res.ok) {
                    const created = await res.json();
                    setItems(prev => [created, ...prev]);
                    // Update sessionStorage
                    sessionStorage.setItem("adminItems", JSON.stringify([created, ...items]));
                }
            } catch (error) {
                console.error("Failed to add item:", error);
            }
        }
        setNewItem("");
        setNewImage(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const addRandom = async () => {
        const rnd = `Random ${Math.floor(Math.random() * 1000)}`;
        try {
            const res = await fetch("/api/items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: rnd, image: null }),
            });
            if (res.ok) {
                const created = await res.json();
                setItems(prev => [created, ...prev]);
                sessionStorage.setItem("adminItems", JSON.stringify([created, ...items]));
            }
        } catch (error) {
            console.error("Failed to add random item:", error);
        }
    };

    const removeItem = async (id: number) => {
        try {
            const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(prev => prev.filter(it => it.id !== id));
                sessionStorage.setItem("adminItems", JSON.stringify(items.filter(it => it.id !== id)));
            }
        } catch (error) {
            console.error("Failed to delete item:", error);
        }
        if (editingId === id) {
            setEditingId(null);
            setEditingText("");
        }
    };

    const startEdit = (id: number) => {
        const it = items.find(x => x.id === id);
        if (!it) return;
        setEditingId(id);
        setEditingText(it.name);
    };

    const saveEdit = async () => {
        if (editingId === null) return;
        const trimmed = editingText.trim();
        if (!trimmed) return;

        try {
            const res = await fetch(`/api/items/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: trimmed, image: null }),
            });
            if (res.ok) {
                const updated = await res.json();
                setItems(prev => prev.map(it => it.id === editingId ? updated : it));
                sessionStorage.setItem("adminItems", JSON.stringify(items.map(it => it.id === editingId ? updated : it)));
            }
        } catch (error) {
            console.error("Failed to update item:", error);
        }
        setEditingId(null);
        setEditingText("");
    };

    if (!loaded) {
        return (
            <main className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </main>
        );
    }

    return (
        <main className="py-5 bg-light" style={{ minHeight: "100vh" }}>
            <div className="container">
                <div className="row mb-4">
                    <div className="col d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="display-4 text-primary">Admin Dashboard</h1>
                            <p className="text-muted">Total items: <strong>{items.length}</strong></p>
                        </div>
                        <Link href="/explore" className="btn btn-sm btn-outline-secondary" style={{ boxShadow: "none", padding: "0.4rem 0.6rem", borderRadius: 6, height: "fit-content" }}>
                            🔍 Explore
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-8">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">List Items</h5>
                            </div>
                            <div className="card-body">
                                {items.length === 0 ? (
                                    <div className="alert alert-info" role="alert">
                                        📭 Belum ada item
                                    </div>
                                ) : (
                                    <div className="list-group">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="list-group-item d-flex justify-content-between align-items-center"
                                            >
                                                {editingId === item.id ? (
                                                    <div className="w-100 d-flex gap-2">
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editingText}
                                                            onChange={(e) => setEditingText(e.target.value)}
                                                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={saveEdit}
                                                            style={{ boxShadow: "none", padding: "0.35rem 0.6rem" }}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-link text-decoration-none"
                                                            onClick={() => {
                                                                setEditingId(null);
                                                                setEditingText("");
                                                            }}
                                                            style={{ padding: "0.35rem 0.6rem" }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="d-flex align-items-center">
                                                            {item.image ? (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                                                                    className="me-3"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="me-3 bg-secondary"
                                                                    style={{ width: 48, height: 48, borderRadius: 6 }}
                                                                />
                                                            )}
                                                            <Link href={`/admin/${item.id}`} className="text-decoration-none text-primary fw-500">
                                                                {item.name}
                                                            </Link>
                                                        </div>

                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={() => startEdit(item.id)}
                                                                style={{ boxShadow: "none", padding: "0.25rem 0.5rem" }}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removeItem(item.id)}
                                                                style={{ boxShadow: "none", padding: "0.25rem 0.5rem" }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Tambah Item Baru</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="itemInput" className="form-label">Nama Item</label>
                                    <input
                                        id="itemInput"
                                        type="text"
                                        className="form-control"
                                        placeholder="Contoh: Item 1, Item 2"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addItem()}
                                    />
                                    <small className="text-muted d-block mt-1">💡 Gunakan koma untuk menambah beberapa item sekaligus</small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Gambar (opsional)</label>
                                    <input ref={fileRef} type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
                                    {newImage && (
                                        <div className="mt-2">
                                            <img src={newImage} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }} />
                                            <button
                                                className="btn btn-sm btn-outline-danger mt-2"
                                                onClick={() => { setNewImage(null); if (fileRef.current) fileRef.current.value = ""; }}
                                                style={{ boxShadow: "none", padding: "0.3rem 0.5rem" }}
                                            >
                                                Hapus Gambar
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={addItem}
                                        style={{ boxShadow: "none", padding: "0.45rem 0.6rem" }}
                                    >
                                        ➕ Tambah Item
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={addRandom}
                                        style={{ boxShadow: "none", padding: "0.45rem 0.6rem" }}
                                    >
                                        🎲 Tambah Random
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}