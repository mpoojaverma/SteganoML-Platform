import numpy as np


def calculate_psnr(
    original_audio,
    stego_audio,
):

    mse = np.mean(
        (
            original_audio.astype(
                np.float64
            )
            -
            stego_audio.astype(
                np.float64
            )
        )
        ** 2
    )

    if mse == 0:
        return 999.0

    max_value = 32767.0

    psnr = (
        20
        * np.log10(
            max_value
        )
        -
        10
        * np.log10(
            mse
        )
    )

    return float(psnr)


def calculate_snr(
    original_audio,
    stego_audio,
):

    signal_power = np.mean(
        original_audio.astype(
            np.float64
        )
        ** 2
    )

    noise_power = np.mean(
        (
            original_audio.astype(
                np.float64
            )
            -
            stego_audio.astype(
                np.float64
            )
        )
        ** 2
    )

    if noise_power == 0:
        return 999.0

    return float(
        10
        * np.log10(
            signal_power
            /
            noise_power
        )
    )


def calculate_ber(
    original_bits,
    recovered_bits
):

    length = min(
        len(original_bits),
        len(recovered_bits)
    )

    if length == 0:
        return 0.0

    errors = sum(
        1
        for i in range(length)
        if (
            original_bits[i]
            !=
            recovered_bits[i]
        )
    )

    return float(
        errors
        /
        length
    )


def calculate_nc(
    original_bits,
    recovered_bits
):

    length = min(
        len(original_bits),
        len(recovered_bits)
    )

    if length == 0:
        return 0.0

    original = np.array(
        [
            int(x)
            for x in original_bits[:length]
        ]
    )

    recovered = np.array(
        [
            int(x)
            for x in recovered_bits[:length]
        ]
    )

    numerator = np.sum(
        original
        * recovered
    )

    denominator = np.sqrt(
        np.sum(
            original ** 2
        )
        *
        np.sum(
            recovered ** 2
        )
    )

    if denominator == 0:
        return 0.0

    return float(
        numerator
        /
        denominator
    )