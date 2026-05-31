import numpy as np


def psnr(
    orig_bytes,
    stego_bytes
):
    orig = np.frombuffer(
        orig_bytes,
        dtype=np.int32
    )

    stego = np.frombuffer(
        stego_bytes,
        dtype=np.int32
    )

    mse = np.mean(
        (orig - stego) ** 2
    )

    if mse == 0:
        return 100.0

    return (
        20
        * np.log10(
            32767
            / np.sqrt(mse)
        )
    )


def ber(
    orig_bytes,
    stego_bytes
):
    orig_bits = np.unpackbits(
        np.frombuffer(
            orig_bytes,
            dtype=np.uint8
        )
    )

    stego_bits = np.unpackbits(
        np.frombuffer(
            stego_bytes,
            dtype=np.uint8
        )
    )

    min_len = min(
        len(orig_bits),
        len(stego_bits)
    )

    errors = np.sum(
        orig_bits[:min_len]
        != stego_bits[:min_len]
    )

    return errors / min_len


def normalized_correlation(
    orig_bytes,
    stego_bytes
):
    orig = np.frombuffer(
        orig_bytes,
        dtype=np.int32
    )

    stego = np.frombuffer(
        stego_bytes,
        dtype=np.int32
    )

    return np.corrcoef(
        orig,
        stego
    )[0, 1]


def snr(
    orig_bytes,
    stego_bytes
):
    orig = np.frombuffer(
        orig_bytes,
        dtype=np.int32
    ).astype(np.float32)

    noise = (
        orig
        - np.frombuffer(
            stego_bytes,
            dtype=np.int32
        ).astype(np.float32)
    )

    signal_power = np.mean(
        orig ** 2
    )

    noise_power = np.mean(
        noise ** 2
    )

    if noise_power == 0:
        return 100.0

    return (
        10
        * np.log10(
            signal_power
            / noise_power
        )
    )