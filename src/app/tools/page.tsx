import { ArrowLeft, Download, Terminal, Edit3, Search, Settings, Database } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const RELEASE_BASE = "https://github.com/monokrome/bl4/releases/latest/download";

const DOWNLOADS = [
  { name: "bl4.exe", label: "Windows", arch: "" },
  { name: "bl4-macos-aarch64", label: "macOS", arch: "Apple Silicon" },
  { name: "bl4-macos-x86_64", label: "macOS", arch: "Intel" },
  { name: "bl4-linux-x86_64", label: "Linux", arch: "x86_64" },
  { name: "bl4-linux-aarch64", label: "Linux", arch: "ARM64" },
];

export default function ToolsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Save Editing Tools</h1>
          <p>
            A complete toolkit for decrypting, editing, and managing your
            Borderlands 4 save files. Built in Rust for speed and reliability.
          </p>
        </section>

        <section className={styles.downloads}>
          <h2>Download</h2>
          <div className={styles.downloadGrid}>
            {DOWNLOADS.map((dl) => (
              <a
                key={dl.name}
                href={`${RELEASE_BASE}/${dl.name}`}
                className={styles.downloadCard}
              >
                <Download size={24} />
                <div className={styles.downloadInfo}>
                  <span className={styles.downloadName}>{dl.label}</span>
                  {dl.arch && <span className={styles.downloadPlatform}>{dl.arch}</span>}
                </div>
              </a>
            ))}
          </div>
          <p className={styles.altInstall}>
            Or install via cargo: <code>cargo install bl4-cli</code>
          </p>
        </section>

        <section className={styles.features}>
          <h2>What You Can Do</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureHeader}>
                <Edit3 className={styles.featureIcon} />
                <h3>Interactive Editing</h3>
              </div>
              <p>
                Open save files directly in your favorite editor. Changes are
                automatically encrypted and saved back.
              </p>
              <code>bl4 edit -i 1.sav</code>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureHeader}>
                <Search className={styles.featureIcon} />
                <h3>Query Save Data</h3>
              </div>
              <p>
                Inspect character stats, currencies, experience, and any other
                save data with simple commands.
              </p>
              <code>bl4 get -i 1.sav --level</code>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureHeader}>
                <Terminal className={styles.featureIcon} />
                <h3>Modify Values</h3>
              </div>
              <p>
                Set cash, eridium, character level, experience points, and more
                with precise path-based commands.
              </p>
              <code>bl4 set -i 1.sav &quot;state.currencies.cash&quot; 999999</code>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureHeader}>
                <Settings className={styles.featureIcon} />
                <h3>Decrypt &amp; Encrypt</h3>
              </div>
              <p>
                Export saves to YAML for manual editing or version control.
                Re-encrypt when you&apos;re done.
              </p>
              <code>bl4 decrypt -i 1.sav -o save.yaml</code>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureHeader}>
                <Database className={styles.featureIcon} />
                <h3>Automatic Backups</h3>
              </div>
              <p>
                Hash-based backup system preserves your original saves. Never
                lose progress due to a bad edit.
              </p>
              <code>bl4 edit -i 1.sav --backup</code>
            </div>
          </div>
        </section>

        <section className={styles.setup}>
          <h2>Getting Started</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1</span>
              <div className={styles.stepContent}>
                <h3>Configure Your Steam ID</h3>
                <p>
                  Your Steam ID is used to derive the encryption key for your
                  save files. Find it in your Steam account page.
                </p>
                <code>bl4 configure --steam-id 76561197960521364</code>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNumber}>2</span>
              <div className={styles.stepContent}>
                <h3>Locate Your Saves</h3>
                <p>
                  Save files are typically found in your Steam userdata folder
                  under the Borderlands 4 app ID.
                </p>
                <code>~/.steam/userdata/[id]/[appid]/remote/</code>
              </div>
            </div>

            <div className={styles.step}>
              <span className={styles.stepNumber}>3</span>
              <div className={styles.stepContent}>
                <h3>Start Editing</h3>
                <p>
                  Open a save file in your editor, make changes, save, and the
                  tool handles encryption automatically.
                </p>
                <code>bl4 edit -i 1.sav</code>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.library}>
          <h2>For Developers</h2>
          <p>
            The bl4 library is available as a Rust crate and WebAssembly module
            for building your own tools.
          </p>
          <div className={styles.libraryOptions}>
            <div className={styles.libraryOption}>
              <h3>Rust</h3>
              <code>cargo add bl4</code>
            </div>
            <div className={styles.libraryOption}>
              <h3>JavaScript / TypeScript</h3>
              <code>npm install bl4</code>
            </div>
          </div>
          <a
            href="https://docs.rs/bl4"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.docsLink}
          >
            View API Documentation
          </a>
        </section>
      </main>
    </div>
  );
}
