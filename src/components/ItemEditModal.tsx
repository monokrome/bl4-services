"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import styles from "./ItemEditModal.module.css";

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

interface ItemEditModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ItemEditModal({ item, isOpen, onClose, onSaved }: ItemEditModalProps) {
  const [name, setName] = useState(item.name || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/items/${encodeURIComponent(item.serial)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() || null }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update item");
      }

      setSuccess(true);
      setTimeout(() => {
        onSaved();
        onClose();
      }, 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Edit Item</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.serialInfo}>
          <code>{item.serial}</code>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Item Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name..."
              autoFocus
            />
            <span className={styles.hint}>
              Test the serial in-game and enter the item&apos;s actual name
            </span>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {success && <div className={styles.success}>Item updated successfully!</div>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
