"use client";

import { useState, type FC } from "react";
import { Download } from "lucide-react";
import styles from "./page.module.css";

const RELEASE_BASE = "https://github.com/monokrome/bl4/releases/latest/download";

type OS = "windows" | "macos" | "linux";

const OS_CONFIG: Record<OS, { label: string; archs: { name: string; file: string }[] }> = {
  windows: {
    label: "Windows",
    archs: [{ name: "x64", file: "bl4.exe" }],
  },
  macos: {
    label: "macOS",
    archs: [
      { name: "Apple Silicon", file: "bl4-macos-aarch64" },
      { name: "Intel", file: "bl4-macos-x86_64" },
    ],
  },
  linux: {
    label: "Linux",
    archs: [
      { name: "x86_64", file: "bl4-linux-x86_64" },
      { name: "ARM64", file: "bl4-linux-aarch64" },
    ],
  },
};

function WindowsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2.5L6.5 1.6V7.5H0V2.5ZM7.5 1.5L16 0V7.5H7.5V1.5ZM0 8.5H6.5V14.4L0 13.5V8.5ZM7.5 8.5H16V16L7.5 14.5V8.5Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C5.8 0 4.5 1.8 4.5 4.2C4.5 5.5 4.8 6.5 4.8 7.5C4.8 8.2 4.3 8.8 3.8 9.5C3.2 10.3 2.5 11.2 2.5 12.5C2.5 13.8 3.5 15 5 15C5.8 15 6.3 14.7 6.8 14.4C7.2 14.2 7.6 14 8 14C8.4 14 8.8 14.2 9.2 14.4C9.7 14.7 10.2 15 11 15C12.5 15 13.5 13.8 13.5 12.5C13.5 11.2 12.8 10.3 12.2 9.5C11.7 8.8 11.2 8.2 11.2 7.5C11.2 6.5 11.5 5.5 11.5 4.2C11.5 1.8 10.2 0 8 0ZM8 1.5C9.2 1.5 10 2.5 10 4.2C10 5.3 9.7 6.3 9.7 7.5C9.7 8.7 10.4 9.5 10.9 10.2C11.4 10.9 11.5 11.5 11.5 12C11.5 12.8 11 13.5 10.5 13.5C10.2 13.5 10 13.4 9.6 13.2C9 12.8 8.5 12.5 8 12.5C7.5 12.5 7 12.8 6.4 13.2C6 13.4 5.8 13.5 5.5 13.5C5 13.5 4.5 12.8 4.5 12C4.5 11.5 4.6 10.9 5.1 10.2C5.6 9.5 6.3 8.7 6.3 7.5C6.3 6.3 6 5.3 6 4.2C6 2.5 6.8 1.5 8 1.5ZM6.5 4C6.2 4 6 4.2 6 4.5C6 4.8 6.2 5 6.5 5C6.8 5 7 4.8 7 4.5C7 4.2 6.8 4 6.5 4ZM9.5 4C9.2 4 9 4.2 9 4.5C9 4.8 9.2 5 9.5 5C9.8 5 10 4.8 10 4.5C10 4.2 9.8 4 9.5 4ZM8 6C7.4 6 7 6.3 7 6.8C7 7.2 7.3 7.5 7.5 7.8C7.7 8 8 8 8 8C8 8 8.3 8 8.5 7.8C8.7 7.5 9 7.2 9 6.8C9 6.3 8.6 6 8 6Z" />
    </svg>
  );
}

const OS_ICONS: Record<OS, FC> = {
  windows: WindowsIcon,
  macos: AppleIcon,
  linux: LinuxIcon,
};

export default function DownloadSelector() {
  const [selectedOs, setSelectedOs] = useState<OS>("windows");
  const [archIndex, setArchIndex] = useState<Record<OS, number>>({
    windows: 0,
    macos: 0,
    linux: 0,
  });

  const config = OS_CONFIG[selectedOs];
  const currentArch = config.archs[archIndex[selectedOs]];
  const Icon = OS_ICONS[selectedOs];

  return (
    <div className={styles.downloadSelector}>
      <div className={styles.osCards}>
        {(Object.keys(OS_CONFIG) as OS[]).map((os) => {
          const OsIcon = OS_ICONS[os];
          return (
            <button
              key={os}
              className={`${styles.osCard} ${selectedOs === os ? styles.osCardActive : ""}`}
              onClick={() => setSelectedOs(os)}
            >
              <OsIcon />
              <span>{OS_CONFIG[os].label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.archSection}>
        {config.archs.length > 1 && (
          <div className={styles.archTabs}>
            {config.archs.map((arch, idx) => (
              <button
                key={arch.name}
                className={`${styles.archTab} ${archIndex[selectedOs] === idx ? styles.archTabActive : ""}`}
                onClick={() => setArchIndex({ ...archIndex, [selectedOs]: idx })}
              >
                {arch.name}
              </button>
            ))}
          </div>
        )}

        <a
          href={`${RELEASE_BASE}/${currentArch.file}`}
          className={styles.downloadButton}
        >
          <Download size={20} />
          <span>Download for {config.label}</span>
          {config.archs.length > 1 && (
            <span className={styles.archLabel}>({currentArch.name})</span>
          )}
        </a>
      </div>
    </div>
  );
}
