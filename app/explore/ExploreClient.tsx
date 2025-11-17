"use client";

import React, { useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
};
type Item = { id: number; name: string; image?: string | null };

export default function ExploreClient({ products }: { products: Product[] }) {
  const [addingId, setAddingId] = useState<number | null>(null);

  const importProduct = (p: Product) => {
    try {
      setAddingId(p.id);
      const raw = localStorage.getItem("adminItems");
      const arr: Item[] = raw ? JSON.parse(raw) : [];
      const newItem: Item = { id: Date.now() + Math.random(), name: p.title, image: p.image ?? null };
      arr.push(newItem);
      localStorage.setItem("adminItems", JSON.stringify(arr));
      sessionStorage.setItem("adminItems", JSON.stringify(arr)); 
    } catch (e) {
      // 
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="row">
      {products.map((p) => (
        <div key={p.id} className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm">
            <img
              src={p.image}
              className="card-img-top"
              style={{ objectFit: "contain", height: 200 }}
              alt={p.title}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title" title={p.title}>
                {p.title}
              </h5>
              <p className="text-muted small mb-1">{p.category}</p>
              <p className="fw-bold mb-2">${p.price}</p>
              <p className="text-truncate mb-3" style={{ flex: "1 0 auto" }}>
                {p.description}
              </p>
              <div className="d-flex gap-2 mt-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => importProduct(p)}
                  disabled={addingId === p.id}
                >
                  {addingId === p.id ? "Importing..." : "Import"}
                </button>
                <Link href="/admin" className="btn btn-sm btn-outline-secondary">
                  Open Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}