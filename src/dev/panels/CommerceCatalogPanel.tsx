import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot, serverTimestamp, writeBatch } from "firebase/firestore";
import {
  BadgePercent, CheckCircle2, ExternalLink, Image as ImageIcon, MessageCircle,
  PackageCheck, RefreshCw, Save, Search, Send, ShoppingBag, Sparkles,
} from "lucide-react";
import {
  commerceCatalogSeed,
  commerceCatalogVerifiedAt,
  type CommerceProduct,
  type CommerceProductFamily,
  type CommerceProductStatus,
} from "../../data/commerceCatalog";
import { db } from "../../lib/firebase";
import { useDevAuth } from "../DevAuth";

const CATALOG_DOCUMENT = "catalog";

function cloneProducts(products: CommerceProduct[]) {
  return products.map((product) => ({ ...product, features: [...product.features] }));
}

export default function CommerceCatalogPanel({ onOpenSocial }: { onOpenSocial: () => void }) {
  const { user } = useDevAuth();
  const [products, setProducts] = useState<CommerceProduct[]>(() => cloneProducts(commerceCatalogSeed));
  const [selectedId, setSelectedId] = useState(commerceCatalogSeed[0].id);
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<"All" | CommerceProductFamily>("All");
  const [syncState, setSyncState] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const reference = doc(db, "office_modules", CATALOG_DOCUMENT);
    return onSnapshot(reference, (snapshot) => {
      const items = snapshot.data()?.items;
      if (Array.isArray(items) && items.length) setProducts(cloneProducts(items as CommerceProduct[]));
      setSyncState("ready");
    }, (error) => {
      setSyncState("error");
      setNotice(error.message || "The shared product catalog could not be loaded.");
    });
  }, []);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => (
      (family === "All" || product.family === family)
      && (!normalized || `${product.name} ${product.family} ${product.tagline} ${product.price}`.toLowerCase().includes(normalized))
    ));
  }, [family, products, query]);
  const selected = products.find((product) => product.id === selectedId) || products[0];
  const activeCount = products.filter((product) => product.status === "active").length;

  const updateSelected = <K extends keyof CommerceProduct>(key: K, value: CommerceProduct[K]) => {
    setProducts((current) => current.map((product) => product.id === selected.id ? { ...product, [key]: value } : product));
  };

  const save = async () => {
    if (!user?.uid) return;
    setSyncState("saving");
    setNotice("");
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "office_modules", CATALOG_DOCUMENT), {
        items: products,
        source: "verified-public-catalog",
        verifiedAt: commerceCatalogVerifiedAt,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
        updatedByEmail: user.email || "unknown",
      }, { merge: true });
      batch.set(doc(db, "published_catalog", "products"), {
        items: products,
        verifiedAt: commerceCatalogVerifiedAt,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      }, { merge: true });
      await batch.commit();
      setSyncState("ready");
      setNotice("Catalog saved and published. The public selling surface now uses these product records.");
    } catch (error) {
      setSyncState("error");
      setNotice(error instanceof Error ? error.message : "The catalog could not be saved.");
    }
  };

  const restoreVerified = () => {
    setProducts(cloneProducts(commerceCatalogSeed));
    setSelectedId(commerceCatalogSeed[0].id);
    setNotice("Verified source values restored locally. Save to publish them to the shared Office catalog.");
  };

  const createSocialDraft = () => {
    localStorage.setItem("lorapok-social-draft", JSON.stringify({
      title: `${selected.family} · ${selected.name}`,
      caption: `${selected.tagline}\n\n${selected.price}${selected.promotion ? `\n${selected.promotion}` : ""}\n\n${selected.productUrl}`,
      link: selected.productUrl,
      image: selected.image,
    }));
    onOpenSocial();
  };

  return <div className="dev-panel-content commerce-catalog">
    <header className="commerce-catalog__hero">
      <div><span className="studio-overline"><ShoppingBag size={13} /> Commerce control</span><h1>Products that are <em>ready to sell.</em></h1><p>Manage verified LoraHost plans, Lorapok Retail subscriptions, hardware bundles, pricing, artwork, and social hand-off from one protected workspace.</p></div>
      <div className="commerce-catalog__signals"><span><strong>{products.length}</strong> products</span><span><strong>{activeCount}</strong> active</span><span><strong>2</strong> families</span></div>
    </header>

    <div className={`commerce-catalog__notice is-${syncState}`} role="status">
      {syncState === "saving" ? <RefreshCw className="spin" size={15} /> : <CheckCircle2 size={15} />}
      <span>{notice || (syncState === "loading" ? "Loading the shared catalog…" : syncState === "error" ? "Shared catalog sync needs attention." : `Verified against the public product sources on ${commerceCatalogVerifiedAt}.`)}</span>
      <button type="button" onClick={restoreVerified}>Restore verified values</button>
    </div>

    <div className="commerce-catalog__workspace">
      <section className="commerce-catalog__browser">
        <div className="commerce-catalog__filters">
          <label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search plans and packs" /></label>
          <div>{(["All", "LoraHost", "Lorapok Retail"] as const).map((item) => <button type="button" key={item} className={family === item ? "active" : ""} onClick={() => setFamily(item)}>{item}</button>)}</div>
        </div>
        <div className="commerce-catalog__list">
          {visible.map((product) => <button type="button" key={product.id} className={selected.id === product.id ? "active" : ""} onClick={() => setSelectedId(product.id)}>
            <span className="commerce-catalog__thumb"><img src={product.image} alt="" /></span>
            <span><small>{product.family} · {product.kind}</small><strong>{product.name}</strong><b>{product.price}</b></span>
            <i className={`is-${product.status}`} />
          </button>)}
        </div>
      </section>

      <section className="commerce-catalog__editor">
        <div className="commerce-catalog__preview">
          <img src={selected.image} alt={`${selected.name} product artwork`} />
          <div><span>{selected.family}</span><h2>{selected.name}</h2><p>{selected.price}</p>{selected.promotion && <b><BadgePercent size={13} /> {selected.promotion}</b>}</div>
        </div>

        <div className="commerce-catalog__form">
          <label><span>Product name</span><input value={selected.name} onChange={(event) => updateSelected("name", event.target.value)} /></label>
          <label><span>Status</span><select value={selected.status} onChange={(event) => updateSelected("status", event.target.value as CommerceProductStatus)}><option value="active">Active</option><option value="draft">Draft</option><option value="paused">Paused</option></select></label>
          <label className="wide"><span>Public tagline</span><textarea rows={2} value={selected.tagline} onChange={(event) => updateSelected("tagline", event.target.value)} /></label>
          <label><span>Price</span><input value={selected.price} onChange={(event) => updateSelected("price", event.target.value)} /></label>
          <label><span>Renewal / billing note</span><input value={selected.renewal || ""} onChange={(event) => updateSelected("renewal", event.target.value)} /></label>
          <label><span>Promotion</span><input value={selected.promotion || ""} onChange={(event) => updateSelected("promotion", event.target.value)} placeholder="No active promotion" /></label>
          <label><span>Promotion code</span><input value={selected.promotionCode || ""} onChange={(event) => updateSelected("promotionCode", event.target.value)} /></label>
          <label className="wide"><span>Features · one per line</span><textarea rows={5} value={selected.features.join("\n")} onChange={(event) => updateSelected("features", event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></label>
          <label className="wide"><span><ImageIcon size={13} /> Product image</span><input value={selected.image} onChange={(event) => updateSelected("image", event.target.value)} /></label>
          <label className="wide"><span>Product / checkout page</span><input type="url" value={selected.productUrl} onChange={(event) => updateSelected("productUrl", event.target.value)} /></label>
        </div>

        <label className="commerce-catalog__featured"><input type="checkbox" checked={selected.featured} onChange={(event) => updateSelected("featured", event.target.checked)} /><span><Sparkles size={14} /> Highlight this product in curated catalog views</span></label>
        <div className="commerce-catalog__actions">
          <a href={selected.productUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View live offer</a>
          <button type="button" onClick={createSocialDraft}><Send size={14} /> Send to Social Publisher</button>
          <button type="button" onClick={onOpenSocial}><MessageCircle size={14} /> WhatsApp & Threads</button>
          <button type="button" className="primary" onClick={save} disabled={syncState === "saving"}>{syncState === "saving" ? <RefreshCw className="spin" size={14} /> : <Save size={14} />} Save catalog</button>
        </div>
      </section>
    </div>

    <footer className="commerce-catalog__footer"><PackageCheck size={16} /><span>Prices remain editable in Office, but public claims should continue to match <a href="https://lorahost.tech/" target="_blank" rel="noreferrer">LoraHost</a> and <a href="https://inventory.lorapok.tech/" target="_blank" rel="noreferrer">Lorapok Retail</a>.</span></footer>
  </div>;
}
