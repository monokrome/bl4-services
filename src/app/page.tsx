"use client";

import { useState } from "react";
import { Lock, Search, Database, BookOpen, Upload } from "lucide-react";
import Link from "next/link";
import SaveUpload from "@/components/SaveUpload";
import styles from "./page.module.css";

const RELEASE_BASE = "https://github.com/monokrome/bl4/releases/latest/download";

const DOWNLOADS = {
  windows: { name: "bl4.exe", label: "Windows" },
  macIntel: { name: "bl4-macos-x86_64", label: "macOS Intel" },
  macArm: { name: "bl4-macos-aarch64", label: "macOS Apple Silicon" },
  linuxX64: { name: "bl4-linux-x86_64", label: "Linux x86_64" },
  linuxArm: { name: "bl4-linux-aarch64", label: "Linux ARM64" },
};

export default function Home() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.stinger}>
        <Upload size={18} />
        <span>
          Help us improve our save editor!{" "}
          <button onClick={() => setUploadOpen(true)} className={styles.stingerButton}>
            Upload your save file
          </button>{" "}
          to contribute item data.
        </span>
      </div>
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.accent}>bl4</span> Community Tools
          </h1>
          <p className={styles.tagline}>
            Save editing, serial decoding, and research tools for Borderlands 4.
            Built by the community, for the community.
          </p>
          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://book.bl4.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the Docs
            </a>
            <a
              className={styles.secondary}
              href="https://github.com/monokrome/bl4"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </section>

        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>What You Can Do</h2>
          <div className={styles.featureGrid}>
            <Link href="/tools" className={styles.featureCardLink}>
              <div className={styles.featureHeader}>
                <Lock className={styles.featureIcon} />
                <h3>Save Editing</h3>
              </div>
              <p>Decrypt, edit, and re-encrypt your BL4 save files with ease</p>
            </Link>
            <Link href="/decode" className={styles.featureCardLink}>
              <div className={styles.featureHeader}>
                <Search className={styles.featureIcon} />
                <h3>Serial Decoding</h3>
              </div>
              <p>Decode item serials to reveal weapon parts, stats, and more</p>
            </Link>
            <Link href="/items" className={styles.featureCardLink}>
              <div className={styles.featureHeader}>
                <Database className={styles.featureIcon} />
                <h3>Items Database</h3>
              </div>
              <p>Track and verify item data from community contributions</p>
            </Link>
            <a
              href="https://book.bl4.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.featureCardLink}
            >
              <div className={styles.featureHeader}>
                <BookOpen className={styles.featureIcon} />
                <h3>Learn BL4 Internals</h3>
              </div>
              <p>A guide to reverse engineering Borderlands 4 game data</p>
            </a>
          </div>
        </section>

        <section className={styles.quickstart}>
          <h2 className={styles.sectionTitle}>Quick Start</h2>
          <p className={styles.quickstartIntro}>
            Download the CLI for your platform and start editing:
          </p>
          <div className={styles.downloadButtons}>
            <a
              className={styles.downloadButton}
              href={`${RELEASE_BASE}/${DOWNLOADS.windows.name}`}
            >
              <span className={styles.downloadName}>Windows</span>
            </a>
            <a
              className={styles.downloadButton}
              href={`${RELEASE_BASE}/${DOWNLOADS.macArm.name}`}
            >
              <span className={styles.downloadName}>macOS</span>
              <span className={styles.downloadPlatform}>Apple Silicon</span>
            </a>
            <a
              className={styles.downloadButton}
              href={`${RELEASE_BASE}/${DOWNLOADS.macIntel.name}`}
            >
              <span className={styles.downloadName}>macOS</span>
              <span className={styles.downloadPlatform}>Intel</span>
            </a>
            <a
              className={styles.downloadButton}
              href={`${RELEASE_BASE}/${DOWNLOADS.linuxX64.name}`}
            >
              <span className={styles.downloadName}>Linux</span>
              <span className={styles.downloadPlatform}>x86_64</span>
            </a>
            <a
              className={styles.downloadButton}
              href={`${RELEASE_BASE}/${DOWNLOADS.linuxArm.name}`}
            >
              <span className={styles.downloadName}>Linux</span>
              <span className={styles.downloadPlatform}>ARM64</span>
            </a>
          </div>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>Usage</div>
            <pre className={styles.code}>
{`# Decrypt a save file
bl4 decrypt -i 1.sav -o character.yaml

# Decode an item serial
bl4 decode '@Ugr$ZCm/&tH!t{KgK/Shxu>k'

# Edit a save in your $EDITOR
bl4 edit -i 1.sav`}
            </pre>
          </div>
        </section>

        <section className={styles.contribute}>
          <h2 className={styles.sectionTitle}>Help the Community</h2>
          <p className={styles.contributeIntro}>
            Every contribution helps build better tools for everyone. Here are some ways to get involved:
          </p>
          <div className={styles.contributeGrid}>
            <div className={styles.contributeCard}>
              <h3>Share Your Data</h3>
              <p>
                Sync your items to the community database with{" "}
                <code>bl4 idb push</code> to help build accurate part mappings.
              </p>
            </div>
            <div className={styles.contributeCard}>
              <h3>Submit Save Files</h3>
              <p>
                Can&apos;t run the tools? Share your <code>.sav</code> files and Steam ID
                via GitHub Issues or email.
              </p>
            </div>
            <div className={styles.contributeCard}>
              <h3>Contribute Code</h3>
              <p>
                PRs welcome for bug fixes, new features, documentation, and
                research discoveries.
              </p>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p className={styles.disclaimer}>
            This project is not affiliated with or endorsed by Gearbox Software or 2K.
            Borderlands is a registered trademark of Gearbox Software. Use at your own risk.
          </p>
          <div className={styles.links}>
            <a
              href="https://book.bl4.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              href="https://github.com/monokrome/bl4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </a>
            <a
              href="https://github.com/monokrome/bl4/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Issues
            </a>
            <a href="mailto:hey@monokro.me">Contact</a>
          </div>
          <p className={styles.license}>MIT License</p>
        </footer>
      </main>

      <SaveUpload isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
