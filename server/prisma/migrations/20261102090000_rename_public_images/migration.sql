-- Aset statis di public/ di-rename ke penamaan produksi (kebab-case, tanpa spasi/"test").
-- Data yang menyimpan path lama (foto showroom, gambar teaser, setting CMS) ikut dipindah.
-- Path lama tetap 301 ke path baru lewat next.config, jadi baris yang terlewat tidak rusak.
DO $$
DECLARE
  p TEXT[];
  pairs TEXT[][] := ARRAY[
    ARRAY['/new-looks/01-HERO CARD-LP.webp', '/lifestyle/model-card-athena.webp'],
    ARRAY['/new-looks/02-HERO CARD-LP.webp', '/lifestyle/model-card-bees.webp'],
    ARRAY['/new-looks/03-HERO CARD-LP.webp', '/lifestyle/model-card-edpower.webp'],
    ARRAY['/new-looks/04-HERO CARD-LP.webp', '/lifestyle/model-card-victory.webp'],
    ARRAY['/new-looks/HERO 1.webp', '/lifestyle/hero-lineup-city.webp'],
    ARRAY['/new-looks/HERO 3.webp', '/lifestyle/hero-supercharge-app.webp'],
    ARRAY['/new-looks/test image.webp', '/lifestyle/hero-riding-park.webp'],
    ARRAY['/new-looks/SUPERCHARGE CARD-LP.webp', '/lifestyle/supercharge-pile-card.webp'],
    ARRAY['/new-looks/Banner Footer.webp', '/lifestyle/banner-riders-city.webp'],
    ARRAY['/advantages/Wedison Cost Savings.webp', '/advantages/cost-savings.webp'],
    ARRAY['/advantages/Wedison SuperCharge and EdPower.webp', '/advantages/supercharge-edpower.webp'],
    ARRAY['/advantages/Wedison X-Ray Battery Showcase.webp', '/advantages/battery-xray.webp'],
    ARRAY['/advantages/Showroom Skuter Listrik WEDISON.webp', '/advantages/showroom-experience.webp'],
    ARRAY['/super-charge/supercharge-testing.webp', '/super-charge/supercharge-pile-outdoor.webp'],
    ARRAY['/ShowRoom-Receptionist.webp', '/showroom-receptionist.webp'],
    ARRAY['/Environtmental-Advantage.webp', '/environmental-advantage.webp']
  ];
BEGIN
  FOREACH p SLICE 1 IN ARRAY pairs LOOP
    UPDATE "Showroom" SET "photoUrl" = p[2] WHERE "photoUrl" = p[1];
    UPDATE "Station" SET "photoUrl" = p[2] WHERE "photoUrl" = p[1];
    UPDATE "PressCoverage" SET "imageUrl" = p[2] WHERE "imageUrl" = p[1];
    UPDATE "ShowroomTeaser"
      SET "images" = replace("images"::text, p[1], p[2])::jsonb,
          "content" = replace("content"::text, p[1], p[2])::jsonb
      WHERE "images"::text LIKE '%' || p[1] || '%' OR "content"::text LIKE '%' || p[1] || '%';
    UPDATE "Setting" SET "value" = replace("value"::text, p[1], p[2])::jsonb
      WHERE "value"::text LIKE '%' || p[1] || '%';
  END LOOP;
END $$;
