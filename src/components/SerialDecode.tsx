"use client";

import { useState } from "react";
import { Search, Loader2, X, Check, Send } from "lucide-react";
import styles from "./SerialDecode.module.css";

const API_BASE = "https://items.bl4.dev";

interface PartInfo {
  index: number;
  name: string | null;
  category: string | null;
}

interface DecodeResult {
  serial: string;
  item_type: string;
  item_type_name: string;
  manufacturer: string | null;
  weapon_type: string | null;
  element: string | null;
  rarity: string | null;
  level: number | null;
  parts: PartInfo[];
}

interface SerialDecodeProps {
  mode: "panel" | "full";
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SerialDecode({ mode, isOpen, onClose }: SerialDecodeProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DecodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [itemName, setItemName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleDecode = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setItemName("");
    setSubmitted(false);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial: input.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to decode serial");
      }

      const data: DecodeResult = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Decode failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!result) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serial: result.serial,
          name: itemName.trim() || null,
          source: "community-frontend",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          setSubmitted(true);
          return;
        }
        throw new Error(data.message || "Failed to submit item");
      }

      setSubmitted(true);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleDecode();
    }
    if (e.key === "Escape" && mode === "panel" && onClose) {
      onClose();
    }
  };

  if (mode === "panel" && !isOpen) {
    return null;
  }

  const containerClass = mode === "panel" ? styles.panel : styles.fullPage;

  return (
    <div className={containerClass}>
      {mode === "panel" && (
        <div className={styles.panelHeader}>
          <h2>Decode Serial</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
      )}

      {mode === "full" && (
        <div className={styles.fullHeader}>
          <h1>Serial Decoder</h1>
          <p>Paste an item serial to decode its parts, stats, and metadata</p>
        </div>
      )}

      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <Search size={20} className={styles.inputIcon} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste item serial here..."
            className={styles.input}
            autoFocus
          />
          <button
            onClick={handleDecode}
            disabled={loading || !input.trim()}
            className={styles.decodeButton}
          >
            {loading ? <Loader2 className={styles.spinner} size={18} /> : "Decode"}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.resultTitle}>
              <span className={styles.itemType}>{result.item_type_name}</span>
              {result.level && (
                <span className={styles.level}>Level {result.level}</span>
              )}
            </div>
          </div>

          <div className={styles.resultMeta}>
            {result.manufacturer && (
              <span className={styles.tag}>{result.manufacturer}</span>
            )}
            {result.weapon_type && (
              <span className={styles.tag}>{result.weapon_type}</span>
            )}
            {result.element && (
              <span className={styles.tag} data-element={result.element.toLowerCase()}>
                {result.element}
              </span>
            )}
            {result.rarity && (
              <span className={styles.tag} data-rarity={result.rarity.toLowerCase()}>
                {result.rarity}
              </span>
            )}
          </div>

          <div className={styles.serialDisplay}>
            <code>{result.serial}</code>
          </div>

          {result.parts.length > 0 && (
            <div className={styles.partsSection}>
              <h3>Parts ({result.parts.length})</h3>
              <div className={styles.partsList}>
                {result.parts.map((part) => (
                  <div key={part.index} className={styles.part}>
                    {part.category && (
                      <span className={styles.partCategory}>{part.category}</span>
                    )}
                    <span className={styles.partName}>
                      {part.name || `Part #${part.index}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.submitSection}>
            <p className={styles.submitHint}>
              Know what this item is? Help us by naming it:
            </p>
            <div className={styles.submitRow}>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Hellfire, Conference Call, Bee Shield..."
                className={styles.nameInput}
                disabled={submitted}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting || submitted}
                className={styles.submitButton}
              >
                {submitting ? (
                  <Loader2 className={styles.spinner} size={18} />
                ) : submitted ? (
                  <>
                    <Check size={18} />
                    Submitted
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit
                  </>
                )}
              </button>
            </div>
            {submitError && (
              <div className={styles.submitError}>{submitError}</div>
            )}
            {submitted && (
              <div className={styles.submitSuccess}>
                Thanks for contributing to the database!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
