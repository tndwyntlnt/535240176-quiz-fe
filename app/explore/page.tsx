import ExploreClient from "./ExploreClient";

async function getProducts() {
  const res = await fetch("https://fakestoreapi.com/products?limit=12", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function Page() {
  const products = await getProducts();
  return (
    <main className="py-5 bg-light" style={{ minHeight: "100vh" }}>
      <div className="container">
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-6">Explore — Public Products</h1>
            <p className="text-muted">Sumber: Fake Store API (https://fakestoreapi.com)</p>
          </div>
        </div>

        <ExploreClient products={products} />
      </div>
    </main>
  );
}