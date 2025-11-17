"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Item = { id: number; name: string; image?: string | null };

export default function Page() {
    const params = useParams();
    const id = params?.id ?? "";
    const router = useRouter();
    const [item, setItem] = useState<Item | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const raw = sessionStorage.getItem("adminItems") || localStorage.getItem("adminItems");
            if (!raw) {
                setLoaded(true);
                return;
            }
            const arr = JSON.parse(raw) as Item[];
            const found = arr.find((a) => String(a.id) === String(id));
            if (found) setItem(found);
        } catch (e) {
            //
        }
        setLoaded(true);
    }, [id]);

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
                    <div className="col">
                        <button onClick={() => router.back()} className="btn btn-secondary mb-3">← Kembali</button>
                    </div>
                </div>

                {item ? (
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="card shadow-lg">
                                <div className="card-header bg-primary text-white">
                                    <h4 className="mb-0">Detail Item</h4>
                                </div>
                                <div className="card-body">
                                    {item.image && (
                                        <div className="mb-3 text-center">
                                            <img src={item.image} alt={item.name} style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 8 }} />
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-muted">ID</label>
                                        <div className="p-3 bg-light rounded border">
                                            <code>{item.id}</code>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-muted">Nama Item</label>
                                        <div className="p-3 bg-light rounded border">
                                            <h5 className="mb-0">{item.name}</h5>
                                        </div>
                                    </div>

                                    <div className="alert alert-info" role="alert">
                                        <strong>Informasi:</strong> Untuk mengedit item ini, kembali ke halaman daftar dan gunakan tombol "Edit".
                                    </div>
                                </div>
                                <div className="card-footer bg-light">
                                    <Link href="/admin" className="btn btn-primary w-100">← Kembali ke Daftar</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        <div className="col-lg-6 offset-lg-3">
                            <div className="card border-danger shadow-sm">
                                <div className="card-header bg-danger text-white">
                                    <h4 className="mb-0">❌ Item Tidak Ditemukan</h4>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted mb-3">
                                        Item yang Anda cari tidak ditemukan. Kemungkinan:
                                    </p>
                                    <ul className="mb-4">
                                        <li>Item sudah dihapus</li>
                                        <li>ID tidak valid</li>
                                        <li>Data tidak tersimpan di browser Anda</li>
                                    </ul>
                                    <p className="text-muted">Silakan kembali ke halaman daftar untuk melihat item yang tersedia.</p>
                                </div>
                                <div className="card-footer bg-light">
                                    <Link href="/admin" className="btn btn-primary w-100">← Kembali ke Daftar</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}