"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SerialDecode from "@/components/SerialDecode";
import styles from "./page.module.css";

export default function DecodePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={20} />
          Back
        </Link>
      </header>
      <SerialDecode mode="full" />
    </div>
  );
}
