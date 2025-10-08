'use client';
import styles from '@/styles/loading.module.css';

export default function Loading() {
  return (
    <section className={styles.loading_section}>
      <div className={styles.loading}></div>
    </section>
  );
}
