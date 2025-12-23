"use client";

import { useState } from "react";
import styles from "./page.module.css";

const PATHS = {
  windows: "~/Documents/My Games/Borderlands 4/Saved/SaveGames/<steamid>/Profiles/client/",
  linux: "~/.local/share/Steam/steamapps/compatdata/1285190/pfx/drive_c/users/steamuser/Documents/My Games/Borderlands 4/Saved/SaveGames/<steamid>/Profiles/client",
};

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2.5L6.5 1.6V7.5H0V2.5ZM7.5 1.5L16 0V7.5H7.5V1.5ZM0 8.5H6.5V14.4L0 13.5V8.5ZM7.5 8.5H16V16L7.5 14.5V8.5Z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C5.8 0 4.5 1.8 4.5 4.2C4.5 5.5 4.8 6.5 4.8 7.5C4.8 8.2 4.3 8.8 3.8 9.5C3.2 10.3 2.5 11.2 2.5 12.5C2.5 13.8 3.5 15 5 15C5.8 15 6.3 14.7 6.8 14.4C7.2 14.2 7.6 14 8 14C8.4 14 8.8 14.2 9.2 14.4C9.7 14.7 10.2 15 11 15C12.5 15 13.5 13.8 13.5 12.5C13.5 11.2 12.8 10.3 12.2 9.5C11.7 8.8 11.2 8.2 11.2 7.5C11.2 6.5 11.5 5.5 11.5 4.2C11.5 1.8 10.2 0 8 0ZM8 1.5C9.2 1.5 10 2.5 10 4.2C10 5.3 9.7 6.3 9.7 7.5C9.7 8.7 10.4 9.5 10.9 10.2C11.4 10.9 11.5 11.5 11.5 12C11.5 12.8 11 13.5 10.5 13.5C10.2 13.5 10 13.4 9.6 13.2C9 12.8 8.5 12.5 8 12.5C7.5 12.5 7 12.8 6.4 13.2C6 13.4 5.8 13.5 5.5 13.5C5 13.5 4.5 12.8 4.5 12C4.5 11.5 4.6 10.9 5.1 10.2C5.6 9.5 6.3 8.7 6.3 7.5C6.3 6.3 6 5.3 6 4.2C6 2.5 6.8 1.5 8 1.5ZM6.5 4C6.2 4 6 4.2 6 4.5C6 4.8 6.2 5 6.5 5C6.8 5 7 4.8 7 4.5C7 4.2 6.8 4 6.5 4ZM9.5 4C9.2 4 9 4.2 9 4.5C9 4.8 9.2 5 9.5 5C9.8 5 10 4.8 10 4.5C10 4.2 9.8 4 9.5 4ZM8 6C7.4 6 7 6.3 7 6.8C7 7.2 7.3 7.5 7.5 7.8C7.7 8 8 8 8 8C8 8 8.3 8 8.5 7.8C8.7 7.5 9 7.2 9 6.8C9 6.3 8.6 6 8 6Z" />
    </svg>
  );
}

export default function OsPathSelector() {
  const [os, setOs] = useState<"windows" | "linux">("windows");

  return (
    <div className={styles.osSelector}>
      <div className={styles.osTabs}>
        <button
          className={`${styles.osTab} ${os === "windows" ? styles.osTabActive : ""}`}
          onClick={() => setOs("windows")}
        >
          <WindowsIcon />
          Windows
        </button>
        <button
          className={`${styles.osTab} ${os === "linux" ? styles.osTabActive : ""}`}
          onClick={() => setOs("linux")}
        >
          <LinuxIcon />
          Linux
        </button>
      </div>
      <code className={styles.osPath}>{PATHS[os]}</code>
    </div>
  );
}
