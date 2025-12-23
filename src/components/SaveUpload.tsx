"use client";

import { useState, useCallback } from "react";
import { Upload, X, Loader2, Check, AlertCircle } from "lucide-react";
import yaml from "js-yaml";
import styles from "./SaveUpload.module.css";

const API_BASE = "https://items.bl4.dev";

interface SaveUploadProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UploadResult {
  total: number;
  succeeded: number;
  failed: number;
}

type UploadStage = "idle" | "loading-wasm" | "decrypting" | "extracting" | "uploading" | "done" | "error";

export default function SaveUpload({ isOpen, onClose }: SaveUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [steamId, setSteamId] = useState("");
  const [stage, setStage] = useState<UploadStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [serialCount, setSerialCount] = useState(0);

  const reset = useCallback(() => {
    setFile(null);
    setSteamId("");
    setStage("idle");
    setError(null);
    setResult(null);
    setSerialCount(0);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".sav")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please drop a .sav file");
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const extractSerials = useCallback((data: Record<string, unknown>): string[] => {
    const serials = new Set<string>();

    // Character save: state.inventory.items.backpack.slot_N.serial
    const backpack = (data as Record<string, unknown>)?.state as Record<string, unknown> | undefined;
    const inventory = backpack?.inventory as Record<string, unknown> | undefined;
    const items = inventory?.items as Record<string, unknown> | undefined;
    const backpackItems = items?.backpack as Record<string, unknown> | undefined;

    if (backpackItems) {
      let i = 0;
      while (true) {
        const slot = backpackItems[`slot_${i}`] as Record<string, unknown> | undefined;
        if (!slot) break;
        if (typeof slot.serial === "string" && slot.serial) {
          serials.add(slot.serial);
        }
        i++;
      }
    }

    // Character save: state.inventory.equipped_inventory.equipped.slot_N[0].serial
    const equippedInventory = inventory?.equipped_inventory as Record<string, unknown> | undefined;
    const equipped = equippedInventory?.equipped as Record<string, unknown> | undefined;

    if (equipped) {
      let i = 0;
      while (true) {
        const slot = equipped[`slot_${i}`] as unknown[] | undefined;
        if (!slot) break;
        const item = slot[0] as Record<string, unknown> | undefined;
        if (item && typeof item.serial === "string" && item.serial) {
          serials.add(item.serial);
        }
        i++;
      }
    }

    // Profile save: domains.local.shared.inventory.items.bank.slot_N.serial
    const domains = (data as Record<string, unknown>)?.domains as Record<string, unknown> | undefined;
    const local = domains?.local as Record<string, unknown> | undefined;
    const shared = local?.shared as Record<string, unknown> | undefined;
    const sharedInventory = shared?.inventory as Record<string, unknown> | undefined;
    const sharedItems = sharedInventory?.items as Record<string, unknown> | undefined;
    const bank = sharedItems?.bank as Record<string, unknown> | undefined;

    if (bank) {
      let i = 0;
      while (true) {
        const slot = bank[`slot_${i}`] as Record<string, unknown> | undefined;
        if (!slot) break;
        if (typeof slot.serial === "string" && slot.serial) {
          serials.add(slot.serial);
        }
        i++;
      }
    }

    return Array.from(serials);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || !steamId.trim()) return;

    setError(null);
    setResult(null);

    try {
      // Load WASM
      setStage("loading-wasm");
      const bl4 = await import("@monokrome/bl4");
      await bl4.default();

      // Read file
      const fileData = new Uint8Array(await file.arrayBuffer());

      // Decrypt
      setStage("decrypting");
      let yamlBytes: Uint8Array;
      try {
        yamlBytes = bl4.decryptSav(fileData, steamId.trim());
      } catch (e) {
        throw new Error("Decryption failed. Check your Steam ID and ensure this is a valid BL4 save file.");
      }

      // Parse YAML
      setStage("extracting");
      const yamlString = new TextDecoder().decode(yamlBytes);
      let saveData: Record<string, unknown>;
      try {
        saveData = yaml.load(yamlString) as Record<string, unknown>;
      } catch (e) {
        throw new Error("Failed to parse save data");
      }

      // Extract serials
      const serials = extractSerials(saveData);
      setSerialCount(serials.length);

      if (serials.length === 0) {
        throw new Error("No items found in this save file");
      }

      // Upload to API
      setStage("uploading");
      const response = await fetch(`${API_BASE}/items/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: serials.map(serial => ({
            serial,
            source: "save-upload",
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload items to database");
      }

      const uploadResult = await response.json();
      setResult({
        total: serials.length,
        succeeded: uploadResult.succeeded,
        failed: uploadResult.failed,
      });
      setStage("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
      setStage("error");
    }
  }, [file, steamId, extractSerials]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Upload Save File</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {stage === "done" ? (
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <Check size={48} />
            </div>
            <h3>Upload Complete!</h3>
            <p>
              Found <strong>{result?.total}</strong> items in your save.
              <br />
              <strong>{result?.succeeded}</strong> new items added to the database.
              {result?.failed ? <><br />{result.failed} already existed.</> : null}
            </p>
            <button onClick={handleClose} className={styles.doneButton}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div className={styles.content}>
              <div
                className={`${styles.dropZone} ${file ? styles.hasFile : ""}`}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {file ? (
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className={styles.removeFile}
                      disabled={stage !== "idle"}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className={styles.dropIcon} />
                    <p>Drop your .sav file here</p>
                    <span className={styles.orText}>or</span>
                    <label className={styles.browseButton}>
                      Browse
                      <input
                        type="file"
                        accept=".sav"
                        onChange={handleFileSelect}
                        hidden
                      />
                    </label>
                  </>
                )}
              </div>

              <div className={styles.steamIdSection}>
                <label htmlFor="steamId">Steam ID</label>
                <input
                  id="steamId"
                  type="text"
                  value={steamId}
                  onChange={e => setSteamId(e.target.value)}
                  placeholder="76561197960521364"
                  className={styles.steamIdInput}
                  disabled={stage !== "idle"}
                />
                <p className={styles.steamIdHint}>
                  Your 17-digit Steam ID starting with 7656119...
                </p>
              </div>

              {error && (
                <div className={styles.error}>
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {stage !== "idle" && stage !== "error" && (
                <div className={styles.progress}>
                  <Loader2 className={styles.spinner} size={20} />
                  <span>
                    {stage === "loading-wasm" && "Loading decryption module..."}
                    {stage === "decrypting" && "Decrypting save file..."}
                    {stage === "extracting" && "Extracting items..."}
                    {stage === "uploading" && `Uploading ${serialCount} items...`}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.footer}>
              <button onClick={handleClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || !steamId.trim() || stage !== "idle"}
                className={styles.uploadButton}
              >
                {stage === "idle" ? "Upload & Extract" : "Processing..."}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
