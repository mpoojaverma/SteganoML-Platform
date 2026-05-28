import os
import base64

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


# =========================================================
# KEY DERIVATION
# =========================================================

def derive_key(password: str, salt: bytes) -> bytes:
    """
    Derives a secure Fernet-compatible encryption key
    using PBKDF2-HMAC-SHA256.

    Args:
        password (str): User password
        salt (bytes): Random salt

    Returns:
        bytes: URL-safe base64 encoded key
    """

    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )

    key = base64.urlsafe_b64encode(
        kdf.derive(password.encode())
    )

    return key


# =========================================================
# ENCRYPTION
# =========================================================

def encrypt_message(message: bytes, password: str) -> bytes:
    """
    Encrypts a message using Fernet AES encryption.

    Process:
    - Generate random salt
    - Derive secure key
    - Encrypt payload
    - Prepend salt to encrypted payload

    Args:
        message (bytes): Raw payload bytes
        password (str): User password

    Returns:
        bytes: salt + encrypted payload
    """

    salt = os.urandom(16)

    key = derive_key(password, salt)

    cipher = Fernet(key)

    encrypted_message = cipher.encrypt(message)

    return salt + encrypted_message


# =========================================================
# DECRYPTION
# =========================================================

def decrypt_message(encrypted_data: bytes, password: str) -> bytes:
    """
    Decrypts encrypted payload using:
    - extracted salt
    - PBKDF2-derived key
    - Fernet decryption

    Args:
        encrypted_data (bytes): salt + encrypted payload
        password (str): User password

    Returns:
        bytes: Original decrypted payload
    """

    salt = encrypted_data[:16]
    encrypted_message = encrypted_data[16:]

    key = derive_key(password, salt)

    cipher = Fernet(key)

    decrypted_message = cipher.decrypt(encrypted_message)

    return decrypted_message