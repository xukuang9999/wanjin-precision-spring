from __future__ import annotations

from pathlib import Path
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = ROOT / "public"
SOURCE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
WEBP_QUALITY = 82
AVIF_QUALITY = 55


def should_process(path: Path) -> bool:
    return path.suffix.lower() in SOURCE_EXTENSIONS


def save_variant(image: Image.Image, destination: Path, format_name: str, quality: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    save_kwargs = {"format": format_name, "quality": quality}

    if format_name == "WEBP":
      save_kwargs["method"] = 6

    image.save(destination, **save_kwargs)


def main() -> None:
    converted = 0

    for source in sorted(PUBLIC_DIR.rglob("*")):
        if not source.is_file() or not should_process(source):
            continue

        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

            save_variant(image, source.with_suffix(".webp"), "WEBP", WEBP_QUALITY)
            save_variant(image, source.with_suffix(".avif"), "AVIF", AVIF_QUALITY)
            converted += 1

    print(f"Generated modern image variants for {converted} source files.")


if __name__ == "__main__":
    main()
