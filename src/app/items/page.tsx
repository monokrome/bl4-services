"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Search, Upload, Pencil, X } from "lucide-react";
import Link from "next/link";
import SerialDecode from "@/components/SerialDecode";
import SaveUpload from "@/components/SaveUpload";
import ItemEditModal from "@/components/ItemEditModal";
import styles from "./page.module.css";

const API_BASE = "https://items.bl4.dev";

interface Item {
  serial: string;
  name: string | null;
  manufacturer: string | null;
  weapon_type: string | null;
  item_type: string | null;
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

interface Filters {
  manufacturer: string;
  weapon_type: string;
  element: string;
  rarity: string;
}

const ITEMS_PER_PAGE = 50;

const EMPTY_FILTERS: Filters = {
  manufacturer: "",
  weapon_type: "",
  element: "",
  rarity: "",
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decodeOpen, setDecodeOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);


  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(ITEMS_PER_PAGE),
        offset: String(offset),
      });
      if (filters.manufacturer) params.set("manufacturer", filters.manufacturer);
      if (filters.weapon_type) params.set("weapon_type", filters.weapon_type);
      if (filters.element) params.set("element", filters.element);
      if (filters.rarity) params.set("rarity", filters.rarity);

      const res = await fetch(`${API_BASE}/items?${params}`);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data: ListItemsResponse = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [offset, filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const currentPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;

  const hasFilters = Object.values(filters).some(Boolean);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setOffset(0);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setOffset(0);
  };

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

      <div className={styles.filterBar}>
        <input
          type="text"
          placeholder="Manufacturer"
          value={filters.manufacturer}
          onChange={(e) => updateFilter("manufacturer", e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Weapon Type"
          value={filters.weapon_type}
          onChange={(e) => updateFilter("weapon_type", e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Element"
          value={filters.element}
          onChange={(e) => updateFilter("element", e.target.value)}
          className={styles.filterInput}
        />
        <input
          type="text"
          placeholder="Rarity"
          value={filters.rarity}
          onChange={(e) => updateFilter("rarity", e.target.value)}
          className={styles.filterInput}
        />
        {hasFilters && (
          <button className={styles.clearFilters} onClick={clearFilters}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>

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
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.frozenCol1}>Serial</th>
                    <th className={styles.frozenCol2}>Name</th>
                    <th>Type</th>
                    <th>Manufacturer</th>
                    <th>Level</th>
                    <th>Element</th>
                    <th>Rarity</th>
                    <th className={styles.actionsCol}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.serial}
                      className={styles.row}
                      data-rarity={item.rarity?.toLowerCase()}
                    >
                      <td className={styles.frozenCol1}>
                        <code className={styles.serial}>{item.serial}</code>
                      </td>
                      <td className={styles.frozenCol2}>
                        <span className={styles.itemName}>
                          {item.name || (item.item_type ? `Unknown ${item.item_type}` : "Unknown Item")}
                        </span>
                      </td>
                      <td>{item.weapon_type || item.item_type || "\u2014"}</td>
                      <td>{item.manufacturer || "\u2014"}</td>
                      <td>{item.level ?? "\u2014"}</td>
                      <td>
                        {item.element ? (
                          <span data-element={item.element.toLowerCase()}>
                            {item.element}
                          </span>
                        ) : (
                          "\u2014"
                        )}
                      </td>
                      <td>
                        {item.rarity ? (
                          <span data-rarity={item.rarity.toLowerCase()}>
                            {item.rarity}
                          </span>
                        ) : (
                          "\u2014"
                        )}
                      </td>
                      <td className={styles.actionsCol}>
                        <button
                          className={styles.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingItem(item);
                          }}
                          title="Edit item"
                        >
                          <Pencil size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {items.length === 0 && (
              <div className={styles.emptyState}>
                No items found{hasFilters ? " matching filters" : ""}.
              </div>
            )}

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

      {editingItem && (
        <ItemEditModal
          item={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSaved={() => fetchItems()}
        />
      )}
    </div>
  );
}
