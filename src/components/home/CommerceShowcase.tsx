import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BadgePercent, Check, ExternalLink, PackageCheck, Server, ShoppingBag } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import {
  commerceCatalogSeed,
  commerceCatalogVerifiedAt,
  type CommerceProduct,
  type CommerceProductFamily,
} from "../../data/commerceCatalog";
import { db } from "../../lib/firebase";

const families: CommerceProductFamily[] = ["LoraHost", "Lorapok Retail"];

function cloneCatalog(products: CommerceProduct[]) {
  return products.map((product) => ({ ...product, features: [...product.features] }));
}

export default function CommerceShowcase() {
  const [products, setProducts] = useState<CommerceProduct[]>(() => cloneCatalog(commerceCatalogSeed));
  const [family, setFamily] = useState<CommerceProductFamily>("LoraHost");

  useEffect(() => onSnapshot(doc(db, "published_catalog", "products"), (snapshot) => {
    const items = snapshot.data()?.items;
    if (Array.isArray(items) && items.length) setProducts(cloneCatalog(items as CommerceProduct[]));
  }, () => {
    // The verified build-time catalog remains visible if live publishing is unavailable.
  }), []);

  const visible = useMemo(() => products.filter((product) => product.family === family && product.status === "active"), [family, products]);

  return <section className="v4-commerce section" id="offers"><div className="wrap4">
    <div className="v4-heading v4-commerce__heading">
      <div><div className="eyebrow">PRODUCT CATALOG / VERIFIED OFFERS</div><h2>Practical systems.<br /><em>Clear buying paths.</em></h2></div>
      <p>Compare hosting, retail software, and shop hardware using published prices and renewal notes. Checkout and final availability remain on each official product service.</p>
    </div>

    <div className="v4-commerce__toolbar" role="tablist" aria-label="Product families">
      {families.map((item) => <button key={item} type="button" role="tab" aria-selected={family === item} className={family === item ? "active" : ""} onClick={() => setFamily(item)}>
        {item === "LoraHost" ? <Server size={17} /> : <ShoppingBag size={17} />}
        <span>{item}</span><b>{products.filter((product) => product.family === item && product.status === "active").length}</b>
      </button>)}
      <small><PackageCheck size={15} /> Catalog verified {commerceCatalogVerifiedAt}</small>
    </div>

    <div className="v4-commerce__grid">
      {visible.map((product, index) => <article key={product.id} className={`v4-commerce-card${product.featured ? " featured" : ""}`} style={{ "--product-index": index } as CSSProperties}>
        <div className="v4-commerce-card__visual">
          <img src={product.image} alt={`${product.family} ${product.name} product artwork`} loading="lazy" />
          <span>{product.kind}</span>
          {product.featured && <b>Recommended</b>}
        </div>
        <div className="v4-commerce-card__body">
          <small>{product.family}</small><h3>{product.name}</h3><p>{product.tagline}</p>
          <strong>{product.price}</strong>
          {product.promotion && <div className="v4-commerce-card__promotion"><BadgePercent size={15} /><span>{product.promotion}{product.promotionCode ? <code>{product.promotionCode}</code> : null}</span></div>}
          {product.renewal && <div className="v4-commerce-card__renewal">Renewal / billing: {product.renewal}</div>}
          <ul>{product.features.map((feature) => <li key={feature}><Check size={14} /> {feature}</li>)}</ul>
          <a className="button" href={product.productUrl} target="_blank" rel="noopener noreferrer">View official offer <ExternalLink size={14} /></a>
        </div>
      </article>)}
    </div>
    <p className="v4-disclaimer">Published catalog information is an orientation layer. Confirm the current billing total, taxes, stock, service limits, and checkout availability on the official product page before purchase.</p>
  </div></section>;
}
