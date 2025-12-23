"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Search, Upload } from "lucide-react";
import Link from "next/link";
import SerialDecode from "@/components/SerialDecode";
import SaveUpload from "@/components/SaveUpload";
import styles from "./page.module.css";

const API_BASE = "https://items.bl4.dev";

interface Item {
  serial: string;
  name: string | null;
  manufacturer: string | null;
  weapon_type: string | null;
  element: string | null;
  rarity: string | null;
  level: number | null;
  verification_status: string;
}

interface ListItemsResponse {
  items: Item[];
  total: number;
  limit: number;
  offset: number;
}

const ITEMS_PER_PAGE = 25;

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decodeOpen, setDecodeOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/items?limit=${ITEMS_PER_PAGE}&offset=${offset}`
      );
      if (!res.ok) throw new Error("Failed to fetch items");
      const data: ListItemsResponse = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [offset]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1>Items Database</h1>
        <span className={styles.itemCount}>{total.toLocaleString()} items</span>
        <button
          className={styles.uploadButton}
          onClick={() => setUploadOpen(true)}
        >
          <Upload size={18} />
          Upload Save
        </button>
      </header>

      <main className={`${styles.main} ${decodeOpen ? styles.mainWithPanel : ""}`}>
        {loading ? (
          <div className={styles.loadingState}>
            <Loader2 className={styles.spinner} size={32} />
            <p>Loading items...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchItems}>Retry</button>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div
                  key={item.serial}
                  className={styles.itemCard}
                  data-rarity={item.rarity?.toLowerCase()}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>
                      {item.name || "Unknown Item"}
                    </span>
                    {item.level && (
                      <span className={styles.itemLevel}>Lv.{item.level}</span>
                    )}
                  </div>
                  <div className={styles.itemMeta}>
                    {item.manufacturer && (
                      <span className={styles.tag}>{item.manufacturer}</span>
                    )}
                    {item.weapon_type && (
                      <span className={styles.tag}>{item.weapon_type}</span>
                    )}
                    {item.element && (
                      <span className={styles.tag} data-element={item.element.toLowerCase()}>
                        {item.element}
                      </span>
                    )}
                    {item.rarity && (
                      <span className={styles.tag} data-rarity={item.rarity.toLowerCase()}>
                        {item.rarity}
                      </span>
                    )}
                  </div>
                  <code className={styles.serial}>{item.serial}</code>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <button
                onClick={() => setOffset(Math.max(0, offset - ITEMS_PER_PAGE))}
                disabled={offset === 0}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setOffset(offset + ITEMS_PER_PAGE)}
                disabled={offset + ITEMS_PER_PAGE >= total}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </>
        )}
      </main>

      {!decodeOpen && (
        <button
          className={styles.decodeButton}
          onClick={() => setDecodeOpen(true)}
        >
          <Search size={20} />
          Decode Serial
        </button>
      )}

      <SerialDecode
        mode="panel"
        isOpen={decodeOpen}
        onClose={() => setDecodeOpen(false)}
      />

      <SaveUpload
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </div>
  );
}
