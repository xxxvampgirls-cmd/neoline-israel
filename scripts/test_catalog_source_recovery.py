#!/usr/bin/env python3
"""No-network regression for original NEOLINE product media extraction.

Creates photos in a temporary workspace; never touches published assets.
"""
from __future__ import annotations

import io
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from bs4 import BeautifulSoup
from PIL import Image, ImageDraw

import sync_catalog as shop
from catalog_photo_quality import duplicate_kind, photo_signature
from catalog_promo_filter import banner_diagnosis, promotional_url, banned_reference


def picture(mode: int) -> bytes:
    image = Image.new("RGB", (440, 320), "white")
    draw = ImageDraw.Draw(image)
    if mode == 1:
        draw.polygon([(10, 25), (205, 10), (210, 300), (20, 285)], fill=(202, 30, 50))
    elif mode == 2:
        draw.ellipse((125, 16, 400, 292), fill=(30, 110, 222))
    elif mode == 3:
        draw.rectangle((13, 15, 425, 302), fill=(30, 160, 50))
    else:
        draw.polygon([(210, 10), (430, 280), (11, 290)], fill=(195, 166, 35))
    output = io.BytesIO()
    image.save(output, format="WEBP", quality=90)
    return output.getvalue()


class ProductImageRecoveryTests(unittest.TestCase):
    def test_user_confirmed_ad_and_wide_colored_promo_banners_are_rejected(self):
        # Exact image was shown by the user as photo 3/3 of Power Cord Hybrid.
        self.assertTrue(banned_reference("./assets/catalog/images/951833046070-3.webp"))
        self.assertFalse(banned_reference("./assets/catalog/images/951833046070-2.webp"))
        marketing=Image.new("RGB",(900,275),(5,105,222))
        draw=ImageDraw.Draw(marketing)
        draw.rectangle((140,104,760,152),fill=(240,240,245))
        reason,details=banner_diagnosis(marketing)
        self.assertIsNotNone(reason)
        self.assertGreater(details["saturated_fraction"],0.5)
        # A long white-background power cord is not a banner.
        cable=Image.new("RGB",(900,275),"white")
        draw=ImageDraw.Draw(cable)
        draw.line([(120,120),(350,80),(510,125),(780,115)],width=12,fill="black")
        self.assertIsNone(banner_diagnosis(cable)[0])
        self.assertTrue(promotional_url("https://neoline.ru/upload/medialibrary/a/Бесплатный_самовывоз.webp"))
        self.assertTrue(promotional_url("https://neoline.ru/upload/iblock/delivery_banner.webp"))
        self.assertFalse(promotional_url("https://neoline.ru/upload/iblock/neoline_power_cord_hybrid.webp"))

    def test_future_sync_skips_promo_image_before_background_conversion(self):
        marketing=Image.new("RGB",(900,275),(6,95,220))
        stream=io.BytesIO()
        marketing.save(stream,format="PNG")
        fake=type("Response",(),{"content":stream.getvalue()})()
        with tempfile.TemporaryDirectory() as tmp:
            target=Path(tmp)/"product.webp"
            with patch.object(shop,"get",return_value=fake):
                actual=shop.download_unique_image(
                    "https://neoline.ru/upload/iblock/rasterized-banner.png",
                    target,[])
            self.assertIsNone(actual)
            self.assertFalse(target.exists())

class ProductImageRecoveryTests(unittest.TestCase):
    def test_speaker_facts_do_not_leak_into_radar_mounts(self):
        rows=[
            {"label":"Диффузор","value":"Стекловолокно"},
            {"label":"Подвес","value":"Бутилкаучуковая резина"},
            {"label":"Материал купола","value":"Шелк"},
            {"label":"Способ установки","value":"На лобовое стекло"},
            {"label":"Сплит","value":"оплата частями"}
        ]
        filtered=shop.validated_product_specs("accessories",rows)
        self.assertEqual(filtered,[{"label":"Способ установки","value":"На лобовое стекло"}])
        audio=shop.validated_product_specs("audio",rows)
        self.assertEqual(len(audio),4)

    def test_committed_mount_has_no_unrelated_speaker_parameters(self):
        import json
        data=json.loads((Path(__file__).resolve().parents[1] /
                         "assets/catalog/catalog.json").read_text(encoding="utf-8"))
        mount=next(p for p in data["products"] if p["id"]==105776419608)
        self.assertFalse(any(row["label"] in shop.SPEAKER_PROPERTIES for row in mount["specs"]))
    def test_source_candidates_reject_related_product_photos(self):
        markup = """
          <meta property="og:image" content="/upload/iblock/product_main.webp">
          <div class="detail-gallery">
            <a data-fancybox="product" href="/upload/iblock/big_photo.webp">
              <img alt="Neoline WowCam" data-zoom-image="/upload/iblock/zoom.webp"
                   src="/upload/resize_cache/thumb.webp">
            </a>
            <picture>
              <source srcset="/upload/iblock/high.webp 2x, /upload/iblock/mid.webp 1x">
              <img src="/upload/iblock/other.webp" alt="Neoline WowCam rear view">
            </picture>
          </div>
          <div class="related-products">
            <div class="detail-gallery">
              <img src="/upload/iblock/unrelated.webp" alt="Neoline WowCam">
            </div>
          </div>
          <script>unrelated images should never be parsed as srcset</script>
        """
        urls = shop.image_candidates(BeautifulSoup(markup, "html.parser"), {}, "Neoline WowCam")
        for expected in ("product_main.webp","big_photo.webp","zoom.webp","high.webp","mid.webp","other.webp"):
            self.assertTrue(any(url.endswith(expected) for url in urls), expected)
        self.assertFalse(any("unrelated.webp" in url for url in urls))
        self.assertTrue(all(url.startswith("https://neoline.ru/upload/") for url in urls))
        self.assertIsNone(shop.canonical_image("https://other-brand.ru/upload/iblock/x.webp"))
        self.assertIsNone(shop.canonical_image("javascript:alert(1)"))

    def test_only_approved_previous_gallery_is_carried_forward(self):
        with tempfile.TemporaryDirectory(prefix="neoline-gallery-test-") as tmp:
            old = os.getcwd()
            try:
                os.chdir(tmp)
                folder = Path("assets/catalog/images")
                folder.mkdir(parents=True)
                photo_id = 100112
                for i in range(1,4):
                    (folder / f"{photo_id}-{i}.webp").write_bytes(picture(i))
                approved=[
                    f"./assets/catalog/images/{photo_id}-1.webp",
                    f"./assets/catalog/images/{photo_id}-2.webp"
                ]
                expected_alt = picture(4)
                photos={
                    "https://neoline.ru/upload/iblock/same.webp":picture(1),
                    "https://neoline.ru/upload/iblock/third.webp":expected_alt
                }
                def offline_get(url,**kwargs):
                    return type("LocalResponse", (), {"content":photos[url]})()
                def safe_save(image):
                    return image.convert("RGB"), "original"
                sample = {
                    "id":photo_id,"name":"Neoline Sample Camera",
                    "specs":[{"label":"Количество камер","value":"1"}],
                    "imageSources":list(photos)
                }
                with patch.object(shop,"OUT",Path("assets/catalog")), \
                     patch.object(shop,"get",side_effect=offline_get), \
                     patch.object(shop,"clean_image",side_effect=safe_save):
                    shop.attach_photos(sample,{photo_id:approved})
                self.assertEqual(len(sample["images"]),3)
                self.assertEqual(sample["images"][:2],approved)
                self.assertNotIn(f"./assets/catalog/images/{photo_id}-4.webp",sample["images"])
                first=photo_signature(Path(sample["images"][0]))
                last=photo_signature(Path(sample["images"][-1]))
                self.assertNotIn(duplicate_kind(first,last)[0],("identical","perceptual"))
                # Historical orphan "-3" got replaced by actual NEW source image,
                # but its previous green pixels were not trusted.
                self.assertNotEqual((folder/f"{photo_id}-3.webp").read_bytes(),picture(3))
                self.assertFalse(list(folder.glob("*.pending.webp")))
                # Same import again must not create a fourth fake photo.
                sample["imageSources"] = list(photos)
                with patch.object(shop,"OUT",Path("assets/catalog")), \
                     patch.object(shop,"get",side_effect=offline_get), \
                     patch.object(shop,"clean_image",side_effect=safe_save):
                    shop.attach_photos(sample,{photo_id:sample["images"]})
                self.assertEqual(len(sample["images"]),3)
            finally:
                os.chdir(old)


if __name__ == "__main__":
    unittest.main(verbosity=2)
