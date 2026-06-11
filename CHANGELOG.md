# Changelog

All notable changes to the SteganoML platform will be documented in this file.

---

## [Version 2.0.0-Security] - 2026-06-11

### Security Update & Remediation

This update introduces security hardening across the web API and cryptographic coordinates generator.

#### Key Upgrades (Priority P0 & P1)
*   **Path Traversal Fixes:** Hardened both upload and download endpoints. Filenames are sanitized on the backend, and downloads enforce absolute boundary checks.
*   **sessionStorage Hardening:** Configured automatic erasure of steganography passwords, messages, and result caches from `sessionStorage` upon logout.
*   **File Size and MIME Validation:** Restricted backend uploads to a maximum of 100MB and validated MIME content types to prevent Resource Exhaustion (DoS).
*   **Background File Purging:** Configured automated unlinking of temporary audio files immediately after pipeline execution.
*   **Exception Sanitization:** Sanitized tracebacks in HTTP response packages to prevent backend directory structure disclosure.

---

### Cryptography & Offline Decoding Compatibility Note

The deterministic seed derivation algorithm in `generate_deterministic_positions` (for Randomized LSB) has been upgraded from character code summation (`sum(ord(c))`) to **SHA-256 hash conversion** to prevent coordinate mapping collisions.

#### Compatibility Matrix

| Scenario / File Type | Compatible? | Detail |
| :--- | :---: | :--- |
| **Database-backed files** | **✅ Yes** | Mappings are fetched directly from static database positions. |
| **ML-guided files (renamed/offline)** | **✅ Yes** | ML shuffling seed was already using SHA-256 logic. |
| **Randomized LSB files (renamed/offline)** | **❌ No** | Regenerated positions will mismatch due to the upgraded seed algorithm. |
| **New files encoded after V2 update** | **✅ Yes** | Works seamlessly online and offline under the new SHA-256 seed. |

*Note: Legacy offline Randomized LSB files can no longer be decoded if database job logs are cleared.*
