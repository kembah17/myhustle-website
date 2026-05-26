-- Migration: Deduplicate areas across all cities
-- Generated: 2026-05-26
-- Total duplicate groups: 81
BEGIN;

-- Group 1: Awka - 'eke'
-- Keep: Eke Awka (eke-awka)
-- Remove: Eke Awka (eke-awka-awka)
UPDATE businesses SET area_id = 'f6e36bf3-6bef-41da-b493-a1c091cb4eba' WHERE area_id = 'da23f516-2710-4767-a23b-85c83b89b655';
DELETE FROM areas WHERE id = 'da23f516-2710-4767-a23b-85c83b89b655';

-- Group 2: Benin City - 'avbiama'
-- Keep: Avbiama (avbiama-benin-city)
-- Remove: Avbiama Benin City (avbiama-benin-city-benin-city)
UPDATE businesses SET area_id = '5ccb407f-a861-4c5c-91e6-a68d44223e5c' WHERE area_id = '2015de70-1428-45b2-b202-96b5eefce3d3';
DELETE FROM areas WHERE id = '2015de70-1428-45b2-b202-96b5eefce3d3';

-- Group 3: Lagos - 'abule egba'
-- Keep: Abule Egba (abule-egba-lagos)
-- Remove: Abule-egba (abule-egba-lagos-1)
UPDATE businesses SET area_id = 'f169f804-4510-4654-9716-a3c273c6aa50' WHERE area_id = '457961c4-809e-4c25-ad09-58d36a674384';
DELETE FROM areas WHERE id = '457961c4-809e-4c25-ad09-58d36a674384';

-- Group 4: Lagos - 'ajao'
-- Keep: Ajao (ajao-lagos)
-- Remove: Ajao Estate (ajao-estate-lagos)
UPDATE businesses SET area_id = '502e6432-8065-4467-a0dd-1bc2f49a8f74' WHERE area_id = '489817f6-b9aa-46a0-a18b-4e323405b820';
DELETE FROM areas WHERE id = '489817f6-b9aa-46a0-a18b-4e323405b820';

-- Group 5: Lagos - 'ajeromi ifelodun'
-- Keep: Ajeromi-Ifelodun (ajeromi-ifelodun)
-- Remove: Ajeromi Ifelodun (ajeromi-ifelodun-lagos)
UPDATE businesses SET area_id = '523bd62b-fc30-502b-9074-34f0f91844b7' WHERE area_id = 'd430b2da-0c42-46aa-8439-d2d50fa136f5';
DELETE FROM areas WHERE id = 'd430b2da-0c42-46aa-8439-d2d50fa136f5';

-- Group 6: Lagos - 'amuwo odofin'
-- Keep: Amuwo-Odofin (amuwo-odofin)
-- Remove: Amuwo Odofin (amuwo-odofin-lagos)
UPDATE businesses SET area_id = 'ce2fc016-1713-555d-a477-9ff1cc5c0ea9' WHERE area_id = 'd7c365f9-33d0-49bb-80b0-3d0a23d85776';
DELETE FROM areas WHERE id = 'd7c365f9-33d0-49bb-80b0-3d0a23d85776';

-- Group 7: Lagos - 'ebute metta'
-- Keep: Ebute Metta (ebute-metta-lagos)
-- Remove: Ebute-metta (ebute-metta-lagos-1)
UPDATE businesses SET area_id = '4fa6629c-fe6a-4999-8f25-95f41dec948c' WHERE area_id = 'e78b9f55-46f5-4fcf-b133-0ba152905218';
DELETE FROM areas WHERE id = 'e78b9f55-46f5-4fcf-b133-0ba152905218';

-- Group 8: Lagos - 'eti osa'
-- Keep: Eti-Osa (eti-osa)
-- Remove: Eti Osa (eti-osa-lagos)
UPDATE businesses SET area_id = '7a056a2a-c0a1-53a4-ac00-697f9d561c7d' WHERE area_id = '3cc603ab-f6c5-4821-9b68-073b45f0b660';
DELETE FROM areas WHERE id = '3cc603ab-f6c5-4821-9b68-073b45f0b660';

-- Group 9: Lagos - 'ifako ijaiye'
-- Keep: Ifako-Ijaiye (ifako-ijaiye)
-- Remove: Ifako Ijaiye (ifako-ijaiye-lagos)
UPDATE businesses SET area_id = 'e7ba0599-9d65-5da9-8de3-333079a602e9' WHERE area_id = '7b2c54f6-317f-4d87-ae6d-3b66ba49dda3';
DELETE FROM areas WHERE id = '7b2c54f6-317f-4d87-ae6d-3b66ba49dda3';

-- Group 10: Lagos - 'iju ishaga'
-- Keep: Iju Ishaga (iju-ishaga-lagos)
-- Remove: Iju-ishaga (iju-ishaga-lagos-1)
UPDATE businesses SET area_id = '604a3b45-4f77-4e98-b03e-bdd8bd0995e9' WHERE area_id = '490ba9ae-d055-4eea-af32-0c4529501e7f';
DELETE FROM areas WHERE id = '490ba9ae-d055-4eea-af32-0c4529501e7f';

-- Group 11: Lagos - 'iyana ipaja'
-- Keep: Iyana Ipaja (iyana-ipaja-lagos)
-- Remove: Iyana-ipaja (iyana-ipaja-lagos-1)
UPDATE businesses SET area_id = '8874e00f-ccff-4624-9a90-c1309f9d7e30' WHERE area_id = 'b7040e41-7fb0-48e2-8d52-0ce14cc95513';
DELETE FROM areas WHERE id = 'b7040e41-7fb0-48e2-8d52-0ce14cc95513';

-- Group 12: Lagos - 'ojodu berger'
-- Keep: Ojodu Berger (ojodu-berger-lagos)
-- Remove: Ojodu-berger (ojodu-berger-lagos-1)
UPDATE businesses SET area_id = '86f28958-b71d-4a49-9abc-93cba8c0ebe3' WHERE area_id = '9b908386-2884-434b-9bd8-29b300474f7b';
DELETE FROM areas WHERE id = '9b908386-2884-434b-9bd8-29b300474f7b';

-- Group 13: Lagos - 'oshodi isolo'
-- Keep: Oshodi-Isolo (oshodi-isolo)
-- Remove: Oshodi Isolo (oshodi-isolo-lagos)
UPDATE businesses SET area_id = 'daa4d213-ee64-5174-99a7-bd8f4f47903c' WHERE area_id = '45318e29-aa1d-40b3-ba7c-86f387b94cf9';
DELETE FROM areas WHERE id = '45318e29-aa1d-40b3-ba7c-86f387b94cf9';

-- Group 14: Ibadan - 'adamasingba'
-- Keep: Adamasingba (adamasingba-ibadan)
-- Remove: Adamasingba Ibadan (adamasingba-ibadan-ibadan)
UPDATE businesses SET area_id = '092f0eb3-a404-4647-8b91-95a1a05b3752' WHERE area_id = 'b45173ab-7d10-4e63-8538-26aafe6efba3';
DELETE FROM areas WHERE id = 'b45173ab-7d10-4e63-8538-26aafe6efba3';

-- Group 15: Ibadan - 'alakia'
-- Keep: Alakia (alakia-ibadan)
-- Remove: Alakia Ibadan (alakia-ibadan-ibadan)
UPDATE businesses SET area_id = 'f6e30254-f5aa-4da7-ac50-2737122e224e' WHERE area_id = 'dc9486fc-b0c9-4ad4-9d09-a4f2fd30cfe8';
DELETE FROM areas WHERE id = 'dc9486fc-b0c9-4ad4-9d09-a4f2fd30cfe8';

-- Group 16: Ibadan - 'egbeda'
-- Keep: Egbeda (egbeda-ibadan)
-- Remove: Egbeda Ibadan (egbeda-ibadan-ibadan)
UPDATE businesses SET area_id = 'b1e2d130-b3f0-4f7b-b330-6d1a23183475' WHERE area_id = '0e7044eb-38d8-4f49-93cc-b7080ace40f4';
DELETE FROM areas WHERE id = '0e7044eb-38d8-4f49-93cc-b7080ace40f4';

-- Group 17: Ibadan - 'felele'
-- Keep: Felele (felele-ibadan)
-- Remove: Felele Ibadan (felele-ibadan-ibadan)
UPDATE businesses SET area_id = '4528f9a4-08ad-4039-8ee0-183cf6bbe53e' WHERE area_id = 'ff7b377e-1e0c-4947-b6f3-29a9aa92dc57';
DELETE FROM areas WHERE id = 'ff7b377e-1e0c-4947-b6f3-29a9aa92dc57';

-- Group 18: Ibadan - 'oke ado'
-- Keep: Oke-Ado (oke-ado-ibadan)
-- Remove: Oke Ado Ibadan (oke-ado-ibadan-ibadan)
UPDATE businesses SET area_id = '61968ba2-789d-4aa5-97f4-119939555c49' WHERE area_id = '7c40cf9a-c585-4ab3-9c19-399fd1aa19c9';
DELETE FROM areas WHERE id = '7c40cf9a-c585-4ab3-9c19-399fd1aa19c9';

-- Group 19: Ibadan - 'oluyole'
-- Keep: Oluyole (oluyole-ibadan)
-- Remove: Oluyole Estate (oluyole-estate-ibadan)
UPDATE businesses SET area_id = 'cd16d00b-ea0e-4a97-aa66-ba622e072bd3' WHERE area_id = '2765f3b7-021a-4959-a554-a4c68c414cd0';
DELETE FROM areas WHERE id = '2765f3b7-021a-4959-a554-a4c68c414cd0';
-- Remove: Oluyole Ibadan (oluyole-ibadan-ibadan)
UPDATE businesses SET area_id = 'cd16d00b-ea0e-4a97-aa66-ba622e072bd3' WHERE area_id = 'ff67a4aa-f3a5-4ee2-85d5-62cbbed16e8c';
DELETE FROM areas WHERE id = 'ff67a4aa-f3a5-4ee2-85d5-62cbbed16e8c';

-- Group 20: Ilorin - 'ita alamu'
-- Keep: Ita-alamu (ita-alamu-ilorin)
-- Remove: Ita-alamu Area (ita-alamu-area-ilorin)
UPDATE businesses SET area_id = '273651ea-e731-48a1-958f-9c2b9258ee1c' WHERE area_id = '9564df91-d884-4f0d-87ef-d4ea6689d128';
DELETE FROM areas WHERE id = '9564df91-d884-4f0d-87ef-d4ea6689d128';

-- Group 21: Warri - 'ekpan'
-- Keep: Ekpan (ekpan-warri)
-- Remove: Ekpan Warri (ekpan-warri-warri)
UPDATE businesses SET area_id = '7382c885-0a1c-4d49-954d-440ebd16bf78' WHERE area_id = '196396da-1a06-46e7-892d-0609fee850c5';
DELETE FROM areas WHERE id = '196396da-1a06-46e7-892d-0609fee850c5';

-- Group 22: Warri - 'ubeji'
-- Keep: Ubeji (ubeji-warri)
-- Remove: Ubeji Warri (ubeji-warri-warri)
UPDATE businesses SET area_id = '39188620-c5ed-4af5-95d5-c94ada80003e' WHERE area_id = 'fbecfe9c-6a6c-479e-baf9-085d3283ca52';
DELETE FROM areas WHERE id = 'fbecfe9c-6a6c-479e-baf9-085d3283ca52';

-- Group 23: Katsina - 'dandagoro'
-- Keep: Dandagoro (dandagoro-katsina)
-- Remove: Dandagoro Katsina (dandagoro-katsina-katsina)
UPDATE businesses SET area_id = '6fb361df-d37d-40c9-bca6-8dba6be70a93' WHERE area_id = '30689e92-c79b-403d-bd2a-780b977a738a';
DELETE FROM areas WHERE id = '30689e92-c79b-403d-bd2a-780b977a738a';

-- Group 24: Akure - 'oke aro'
-- Keep: Oke-Aro (oke-aro-akure)
-- Remove: Oke Aro Akure (oke-aro-akure-akure)
UPDATE businesses SET area_id = '682994ea-aa52-43cc-a2f6-2a98fdfa072b' WHERE area_id = '4aea6677-f1e0-4d9f-be63-1a727df5b74c';
DELETE FROM areas WHERE id = '4aea6677-f1e0-4d9f-be63-1a727df5b74c';

-- Group 25: Akure - 'oke ijebu'
-- Keep: Oke-Ijebu (oke-ijebu-akure)
-- Remove: Oke Ijebu Akure (oke-ijebu-akure-akure)
UPDATE businesses SET area_id = '68251e10-a550-405f-8e1b-65b976209b35' WHERE area_id = '1fd87617-0405-46cd-9bcd-58ed797d3e2f';
DELETE FROM areas WHERE id = '1fd87617-0405-46cd-9bcd-58ed797d3e2f';

-- Group 26: Abeokuta - 'adigbe'
-- Keep: Adigbe (adigbe-abeokuta)
-- Remove: Adigbe Abeokuta (adigbe-abeokuta-abeokuta)
UPDATE businesses SET area_id = '4bf37eb0-e313-4a4b-b6de-28e32f3222ac' WHERE area_id = '89cf6877-7639-47f4-a813-bad08aa16ad5';
DELETE FROM areas WHERE id = '89cf6877-7639-47f4-a813-bad08aa16ad5';

-- Group 27: Abeokuta - 'ita eko'
-- Keep: Ita Eko (ita-eko-abeokuta)
-- Remove: Ita Eko Abeokuta (ita-eko-abeokuta-abeokuta)
UPDATE businesses SET area_id = '215fb0be-75ed-40b5-84d4-1788b0e0d149' WHERE area_id = '9dbff2c4-ba36-4a1f-819f-1d9a72d8b1d2';
DELETE FROM areas WHERE id = '9dbff2c4-ba36-4a1f-819f-1d9a72d8b1d2';

-- Group 28: Abeokuta - 'oke mosan'
-- Keep: Oke-Mosan (oke-mosan-abeokuta)
-- Remove: Oke Mosan Abeokuta (oke-mosan-abeokuta-abeokuta)
UPDATE businesses SET area_id = '80d0d429-b6f4-4a4a-bf59-c76d85f956a0' WHERE area_id = '403b7b43-dedf-4143-b3d4-ce5d7911bb03';
DELETE FROM areas WHERE id = '403b7b43-dedf-4143-b3d4-ce5d7911bb03';

-- Group 29: Abuja - 'apo'
-- Keep: Apo (apo)
-- Remove: Apo Abuja (apo-abuja-abuja)
UPDATE businesses SET area_id = 'abj-area-apo' WHERE area_id = 'a83d4f9f-3fd0-4144-9b7e-703041891841';
DELETE FROM areas WHERE id = 'a83d4f9f-3fd0-4144-9b7e-703041891841';
-- Remove: Apo District (apo-district-abuja)
UPDATE businesses SET area_id = 'abj-area-apo' WHERE area_id = 'c1383e11-0f43-45da-92da-72345a9d626d';
DELETE FROM areas WHERE id = 'c1383e11-0f43-45da-92da-72345a9d626d';

-- Group 30: Abuja - 'central'
-- Keep: Central Area (central-area-abuja)
-- Remove: Central District (central-district-abuja)
UPDATE businesses SET area_id = '53570307-89a4-4a6a-afe1-19aa4996a26a' WHERE area_id = 'ff496d2b-e34a-4d62-9bf4-0d48958ad066';
DELETE FROM areas WHERE id = 'ff496d2b-e34a-4d62-9bf4-0d48958ad066';

-- Group 31: Abuja - 'central business'
-- Keep: Central Business Area (central-business-area-abuja)
-- Remove: Central Business District (central-business-district-abuja)
UPDATE businesses SET area_id = '87677281-d1eb-4f9e-9f71-2d4d5cbccba0' WHERE area_id = '75d78c60-5537-4646-b093-f4de98aa10cd';
DELETE FROM areas WHERE id = '75d78c60-5537-4646-b093-f4de98aa10cd';
-- Remove: Central Business District Abuja (central-business-district-abuja-abuja)
UPDATE businesses SET area_id = '87677281-d1eb-4f9e-9f71-2d4d5cbccba0' WHERE area_id = '7f1d9086-95fb-47f1-9136-75ac74282641';
DELETE FROM areas WHERE id = '7f1d9086-95fb-47f1-9136-75ac74282641';

-- Group 32: Abuja - 'dawaki'
-- Keep: Dawaki (dawaki-abuja)
-- Remove: Dawaki Abuja (dawaki-abuja-abuja)
UPDATE businesses SET area_id = 'd1aea95a-42e2-4ea5-be9e-9f5881d8f7fc' WHERE area_id = '596d1b18-41d0-4bac-9801-0c543a42476a';
DELETE FROM areas WHERE id = '596d1b18-41d0-4bac-9801-0c543a42476a';

-- Group 33: Abuja - 'dei dei'
-- Keep: Dei-dei (dei-dei-abuja)
-- Remove: Dei Dei (dei-dei-abuja-1)
UPDATE businesses SET area_id = '755786ad-6861-4536-9b8d-1bfe624d7ecd' WHERE area_id = '4e5f106e-6728-4738-b9d0-19bff938b2f8';
DELETE FROM areas WHERE id = '4e5f106e-6728-4738-b9d0-19bff938b2f8';

-- Group 34: Abuja - 'duboyi'
-- Keep: Duboyi (duboyi-abuja)
-- Remove: Duboyi District (duboyi-district-abuja)
UPDATE businesses SET area_id = 'ca5f06c6-684c-4524-a778-97a5639d8909' WHERE area_id = '31140e6c-a8be-4981-9b6c-11530f1cfe6f';
DELETE FROM areas WHERE id = '31140e6c-a8be-4981-9b6c-11530f1cfe6f';

-- Group 35: Abuja - 'gaduwa'
-- Keep: Gaduwa (gaduwa-abuja)
-- Remove: Gaduwa Estate (gaduwa-estate-abuja)
UPDATE businesses SET area_id = '5a1692c7-724e-4488-be9e-02344e7e6402' WHERE area_id = 'f2197168-9081-4ad5-b8a1-46117ca79fc2';
DELETE FROM areas WHERE id = 'f2197168-9081-4ad5-b8a1-46117ca79fc2';

-- Group 36: Abuja - 'gwagwalada'
-- Keep: Gwagwalada (gwagwalada-abuja)
-- Remove: Gwagwalada Abuja (gwagwalada-abuja-abuja)
UPDATE businesses SET area_id = '60044c29-5315-4ac9-99e3-58b412c4558d' WHERE area_id = '52d40049-2564-4a07-aafe-4dc0c1e2fa1f';
DELETE FROM areas WHERE id = '52d40049-2564-4a07-aafe-4dc0c1e2fa1f';

-- Group 37: Abuja - 'gwarimpa'
-- Keep: Gwarimpa (gwarimpa-abuja)
-- Remove: Gwarimpa Abuja (gwarimpa-abuja-abuja)
UPDATE businesses SET area_id = 'a037cd60-0427-46af-bb03-025fabb3e495' WHERE area_id = 'ff56fae1-f1ef-4122-be50-656f0f1328ce';
DELETE FROM areas WHERE id = 'ff56fae1-f1ef-4122-be50-656f0f1328ce';
-- Remove: Gwarimpa Estate (gwarimpa-estate-abuja)
UPDATE businesses SET area_id = 'a037cd60-0427-46af-bb03-025fabb3e495' WHERE area_id = 'c1074e0c-80cc-4bf3-900d-adfa68802632';
DELETE FROM areas WHERE id = 'c1074e0c-80cc-4bf3-900d-adfa68802632';

-- Group 38: Abuja - 'jahi'
-- Keep: Jahi (jahi-abuja)
-- Remove: Jahi Abuja (jahi-abuja-abuja)
UPDATE businesses SET area_id = '93516b3f-118a-42e5-94b1-16f5e803c756' WHERE area_id = '86b5c1b6-2362-4a90-948b-3919c5651c27';
DELETE FROM areas WHERE id = '86b5c1b6-2362-4a90-948b-3919c5651c27';
-- Remove: Jahi District (jahi-district-abuja)
UPDATE businesses SET area_id = '93516b3f-118a-42e5-94b1-16f5e803c756' WHERE area_id = 'ee734cd3-c38c-42a1-b072-bb42e8c1939d';
DELETE FROM areas WHERE id = 'ee734cd3-c38c-42a1-b072-bb42e8c1939d';

-- Group 39: Abuja - 'kado'
-- Keep: Kado (kado-abuja)
-- Remove: Kado Estate (kado-estate-abuja)
UPDATE businesses SET area_id = 'ceec9ace-5dc5-483d-86a1-34429eb01446' WHERE area_id = '63209c9a-0131-4a9e-8f03-3be2b0f2cd8d';
DELETE FROM areas WHERE id = '63209c9a-0131-4a9e-8f03-3be2b0f2cd8d';
-- Remove: Kado District (kado-district-abuja)
UPDATE businesses SET area_id = 'ceec9ace-5dc5-483d-86a1-34429eb01446' WHERE area_id = '8b37cfef-d8e4-49dc-a891-752b7ea0033b';
DELETE FROM areas WHERE id = '8b37cfef-d8e4-49dc-a891-752b7ea0033b';

-- Group 40: Abuja - 'kaura'
-- Keep: Kaura (kaura-abuja)
-- Remove: Kaura District (kaura-district-abuja)
UPDATE businesses SET area_id = 'd2111492-42da-400d-82b5-1952a4183dce' WHERE area_id = '2e963b24-161c-4ae6-a1b0-ce9290e416a8';
DELETE FROM areas WHERE id = '2e963b24-161c-4ae6-a1b0-ce9290e416a8';

-- Group 41: Abuja - 'mabushi'
-- Keep: Mabushi (mabushi-abuja)
-- Remove: Mabushi Abuja (mabushi-abuja-abuja)
UPDATE businesses SET area_id = '80e8d0fb-9fea-49d3-94eb-786449ce729d' WHERE area_id = '3a7afc44-d188-408e-9ce8-5113822f14bd';
DELETE FROM areas WHERE id = '3a7afc44-d188-408e-9ce8-5113822f14bd';
-- Remove: Mabushi District (mabushi-district-abuja)
UPDATE businesses SET area_id = '80e8d0fb-9fea-49d3-94eb-786449ce729d' WHERE area_id = '7ab140fc-4662-4363-a06b-114008bb31ce';
DELETE FROM areas WHERE id = '7ab140fc-4662-4363-a06b-114008bb31ce';

-- Group 42: Abuja - 'mbora'
-- Keep: Mbora (mbora-abuja)
-- Remove: Mbora District (mbora-district-abuja)
UPDATE businesses SET area_id = '9de65a9b-18d5-4ee2-adaa-c2192d11b10c' WHERE area_id = '89c03d6c-89e7-44a3-8af2-a5741c8dfaa0';
DELETE FROM areas WHERE id = '89c03d6c-89e7-44a3-8af2-a5741c8dfaa0';

-- Group 43: Enugu - 'trans ekulu'
-- Keep: Trans-Ekulu (trans-ekulu-enugu)
-- Remove: Trans- Ekulu (trans-ekulu-enugu-1)
UPDATE businesses SET area_id = '9031b628-5363-42b8-98be-48583164dce8' WHERE area_id = '6235dbf8-1826-4ae8-a6f1-d8fd50929626';
DELETE FROM areas WHERE id = '6235dbf8-1826-4ae8-a6f1-d8fd50929626';

-- Group 44: Onitsha - 'main market'
-- Keep: Main Market (main-market-onitsha)
-- Remove: Main Market Area (main-market-area-onitsha)
UPDATE businesses SET area_id = '8dc72496-cce3-4877-a716-73a60f39c8c6' WHERE area_id = 'f5276452-cc44-4164-a48b-e6ad6fef3da0';
DELETE FROM areas WHERE id = 'f5276452-cc44-4164-a48b-e6ad6fef3da0';

-- Group 45: Onitsha - 'obosi'
-- Keep: Obosi (obosi-onitsha)
-- Remove: Obosi Onitsha (obosi-onitsha-onitsha)
UPDATE businesses SET area_id = 'c19e16eb-28e3-4602-abac-cc3b6cc8962e' WHERE area_id = '7d7a4070-48e6-4c9c-af0a-7475bb7a1bed';
DELETE FROM areas WHERE id = '7d7a4070-48e6-4c9c-af0a-7475bb7a1bed';

-- Group 46: Onitsha - 'omagba phase 1'
-- Keep: Omagba Phase 1 (omagba-phase-1-onitsha)
-- Remove: Omagba Phase 1 Onitsha (omagba-phase-1-onitsha-onitsha)
UPDATE businesses SET area_id = '94cfbbc9-e855-457a-ba0e-0fea374ac1b7' WHERE area_id = '77907bd9-562d-486e-aed6-3f99decf7d51';
DELETE FROM areas WHERE id = '77907bd9-562d-486e-aed6-3f99decf7d51';

-- Group 47: Onitsha - 'shoprite gra'
-- Keep: Shoprite Gra (shoprite-gra-onitsha)
-- Remove: Shoprite Gra Onitsha (shoprite-gra-onitsha-onitsha)
UPDATE businesses SET area_id = 'cc1736f4-bc20-4573-9f90-145679c88662' WHERE area_id = '6c53cd16-e1cc-43e7-9d14-3d47f8d7ce11';
DELETE FROM areas WHERE id = '6c53cd16-e1cc-43e7-9d14-3d47f8d7ce11';

-- Group 48: Owerri - 'new'
-- Keep: New Owerri (new-owerri)
-- Remove: New Owerri (new-owerri-owerri)
UPDATE businesses SET area_id = 'cb081d80-b3f5-4ed9-9530-dd26002c6901' WHERE area_id = '5d0e529c-37c5-44b6-921b-7a9712cb1a0b';
DELETE FROM areas WHERE id = '5d0e529c-37c5-44b6-921b-7a9712cb1a0b';

-- Group 49: Owerri - 'relief market'
-- Keep: Relief Market (relief-market-owerri)
-- Remove: Relief Market Area (relief-market-area-owerri)
UPDATE businesses SET area_id = 'a115b572-bd04-4547-88c3-fd6fffb92a21' WHERE area_id = 'ba348e42-213f-43c3-bb1c-7d122ed4a7e2';
DELETE FROM areas WHERE id = 'ba348e42-213f-43c3-bb1c-7d122ed4a7e2';

-- Group 50: Aba - 'abayi'
-- Keep: Abayi (abayi-aba)
-- Remove: Abayi Aba (abayi-aba-aba)
UPDATE businesses SET area_id = '21252cff-8f45-4f20-af66-7404909ad908' WHERE area_id = 'ece244c5-8084-4a7e-8031-9ad9424f675e';
DELETE FROM areas WHERE id = 'ece244c5-8084-4a7e-8031-9ad9424f675e';

-- Group 51: Port Harcourt - 'abuloma'
-- Keep: Abuloma (abuloma-port-harcourt)
-- Remove: Abuloma Port Harcourt (abuloma-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '320f332d-1cb5-4b09-97c2-7d3fb811ba04' WHERE area_id = '73122968-cd29-4e40-9db7-0664b3073979';
DELETE FROM areas WHERE id = '73122968-cd29-4e40-9db7-0664b3073979';

-- Group 52: Port Harcourt - 'borikiri'
-- Keep: Borikiri (borikiri-port-harcourt)
-- Remove: Borikiri Port Harcourt (borikiri-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'bbf81b5e-c253-4b45-b9ce-cbf99dc276c0' WHERE area_id = '03aceb62-7fa7-4377-8f78-585ef94f127a';
DELETE FROM areas WHERE id = '03aceb62-7fa7-4377-8f78-585ef94f127a';

-- Group 53: Port Harcourt - 'd line'
-- Keep: D-Line (d-line)
-- Remove: D Line (d-line-port-harcourt)
UPDATE businesses SET area_id = 'ph-area-dline' WHERE area_id = '11aabab3-2c79-4f02-9af4-7c297da4dfdb';
DELETE FROM areas WHERE id = '11aabab3-2c79-4f02-9af4-7c297da4dfdb';
-- Remove: D Line Port Harcourt (d-line-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'ph-area-dline' WHERE area_id = 'fee9cb73-be02-4b49-9582-f64e41397db1';
DELETE FROM areas WHERE id = 'fee9cb73-be02-4b49-9582-f64e41397db1';

-- Group 54: Port Harcourt - 'd/line'
-- Keep: D/line (dline-port-harcourt)
-- Remove: D/line Port Harcourt (dline-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'd3a3f339-525d-4844-8104-11801048cfb9' WHERE area_id = 'aab1e341-a2c0-4de0-9957-dda2b17ee247';
DELETE FROM areas WHERE id = 'aab1e341-a2c0-4de0-9957-dda2b17ee247';

-- Group 55: Port Harcourt - 'dline'
-- Keep: Dline (dline-port-harcourt-1)
-- Remove: Dline Port Harcourt (dline-port-harcourt-port-harcourt-1)
UPDATE businesses SET area_id = '706c3c17-5691-4bf8-b57c-aef838a39d4d' WHERE area_id = '8c723e7d-352a-490e-80b9-8ac53d3ba3f0';
DELETE FROM areas WHERE id = '8c723e7d-352a-490e-80b9-8ac53d3ba3f0';

-- Group 56: Port Harcourt - 'elekahia'
-- Keep: Elekahia (elekahia-port-harcourt)
-- Remove: Elekahia Port Harcourt (elekahia-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'c6a9eaa2-79b2-462a-80cd-d7da19bba513' WHERE area_id = '34ff1db2-206d-41c7-878e-53f9d0c1c3c3';
DELETE FROM areas WHERE id = '34ff1db2-206d-41c7-878e-53f9d0c1c3c3';

-- Group 57: Port Harcourt - 'elelenwo'
-- Keep: Elelenwo (elelenwo-port-harcourt)
-- Remove: Elelenwo Port Harcourt (elelenwo-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '350f1a03-17db-471d-9d72-4e51d074f785' WHERE area_id = '4ba3ee0b-2c60-41f0-b233-b0455aef2749';
DELETE FROM areas WHERE id = '4ba3ee0b-2c60-41f0-b233-b0455aef2749';

-- Group 58: Port Harcourt - 'eleme'
-- Keep: Eleme (eleme-port-harcourt)
-- Remove: Eleme Port Harcourt (eleme-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'b3a97733-9030-4caa-823c-5401bdd4f18d' WHERE area_id = '01f09cc1-572d-4fb4-a74f-e67165289ce7';
DELETE FROM areas WHERE id = '01f09cc1-572d-4fb4-a74f-e67165289ce7';

-- Group 59: Port Harcourt - 'g.r.a phase 2'
-- Keep: G.r.a Phase 2 (gra-phase-2-port-harcourt)
-- Remove: G.r.a Phase 2 Port Harcourt (gra-phase-2-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '7e6df4b8-ec7e-4afc-b0c4-4ea0b907c003' WHERE area_id = '17a005ce-b4d6-41d6-821e-12decf1edf70';
DELETE FROM areas WHERE id = '17a005ce-b4d6-41d6-821e-12decf1edf70';

-- Group 60: Port Harcourt - 'gra'
-- Keep: GRA (gra-port-harcourt)
-- Remove: Gra Port Harcourt (gra-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '852115b9-577b-410c-b0f1-be59c404d7c6' WHERE area_id = '9ebeb98c-fd66-43b6-b154-0e1eaa77c459';
DELETE FROM areas WHERE id = '9ebeb98c-fd66-43b6-b154-0e1eaa77c459';

-- Group 61: Port Harcourt - 'gra phase 3'
-- Keep: Gra Phase 3 (gra-phase-3-port-harcourt)
-- Remove: Gra Phase 3 Port Harcourt (gra-phase-3-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'ab5c2ec3-5a56-43d7-a306-af71357fd496' WHERE area_id = '75ee704b-9a17-466f-9fa0-7c9bce91ce79';
DELETE FROM areas WHERE id = '75ee704b-9a17-466f-9fa0-7c9bce91ce79';

-- Group 62: Port Harcourt - 'gra phase ii'
-- Keep: Gra Phase Ii (gra-phase-ii-port-harcourt)
-- Remove: Gra Phase Ii Port Harcourt (gra-phase-ii-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '79f6e4d0-1c1b-4c53-8192-e36f5445091e' WHERE area_id = 'ca3190bf-4bc5-4313-a5ea-ae70cd5dc822';
DELETE FROM areas WHERE id = 'ca3190bf-4bc5-4313-a5ea-ae70cd5dc822';

-- Group 63: Port Harcourt - 'igwuruta'
-- Keep: Igwuruta (igwuruta-port-harcourt)
-- Remove: Igwuruta Port Harcourt (igwuruta-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '6bf340fd-17c8-4d42-943c-6fa5a52871a3' WHERE area_id = '13f6315d-040e-461c-b04b-d97139beac8c';
DELETE FROM areas WHERE id = '13f6315d-040e-461c-b04b-d97139beac8c';

-- Group 64: Port Harcourt - 'mgbuoba'
-- Keep: Mgbuoba (mgbuoba-port-harcourt)
-- Remove: Mgbuoba Port Harcourt (mgbuoba-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '68ee8a3d-f7ab-433f-aa1a-ea4acf7461f1' WHERE area_id = '4f8c9289-4fd5-43b5-afb7-340e971c45a4';
DELETE FROM areas WHERE id = '4f8c9289-4fd5-43b5-afb7-340e971c45a4';

-- Group 65: Port Harcourt - 'mile 4'
-- Keep: Mile 4 (mile-4-port-harcourt)
-- Remove: Mile 4 Port Harcourt (mile-4-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '368e5e41-f1cc-40d8-9912-a197f154a94a' WHERE area_id = '7b9155e1-ed60-4876-8862-4650a9b4605d';
DELETE FROM areas WHERE id = '7b9155e1-ed60-4876-8862-4650a9b4605d';

-- Group 66: Port Harcourt - 'ogbunabali'
-- Keep: Ogbunabali (ogbunabali-port-harcourt)
-- Remove: Ogbunabali Port Harcourt (ogbunabali-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '51aecc88-ec2c-467c-98e9-88e43b4dbf41' WHERE area_id = '2f3fc0a2-5119-460c-8936-02586c556d6f';
DELETE FROM areas WHERE id = '2f3fc0a2-5119-460c-8936-02586c556d6f';

-- Group 67: Port Harcourt - 'oyigbo'
-- Keep: Oyigbo (oyigbo-port-harcourt)
-- Remove: Oyigbo Port Harcourt (oyigbo-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'b1120175-5832-44d4-a4d3-cf8d5893ab72' WHERE area_id = 'a90450bd-c281-45e4-9acf-48f0c0e662eb';
DELETE FROM areas WHERE id = 'a90450bd-c281-45e4-9acf-48f0c0e662eb';

-- Group 68: Port Harcourt - 'ozuoba'
-- Keep: Ozuoba (ozuoba-port-harcourt)
-- Remove: Ozuoba Port Harcourt (ozuoba-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'b34358eb-267f-4307-88c6-ee6d60d68eab' WHERE area_id = 'd6cae7e5-ea48-437a-8d52-0a4501e4898e';
DELETE FROM areas WHERE id = 'd6cae7e5-ea48-437a-8d52-0a4501e4898e';

-- Group 69: Port Harcourt - 'rumueme'
-- Keep: Rumueme (rumueme-port-harcourt)
-- Remove: Rumueme Port Harcourt (rumueme-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '6b1b5833-bc7f-4c4a-9ff8-0c92c0c2965c' WHERE area_id = 'a406b20e-8081-428c-9e71-6780422b0ce8';
DELETE FROM areas WHERE id = 'a406b20e-8081-428c-9e71-6780422b0ce8';

-- Group 70: Port Harcourt - 'rumuibekwe'
-- Keep: Rumuibekwe (rumuibekwe-port-harcourt)
-- Remove: Rumuibekwe Estate (rumuibekwe-estate-port-harcourt)
UPDATE businesses SET area_id = 'eb5244d6-553d-4987-9eec-413ffaf65022' WHERE area_id = 'f2adf1fe-0e88-4dca-bc3a-025f8f756595';
DELETE FROM areas WHERE id = 'f2adf1fe-0e88-4dca-bc3a-025f8f756595';
-- Remove: Rumuibekwe Port Harcourt (rumuibekwe-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'eb5244d6-553d-4987-9eec-413ffaf65022' WHERE area_id = 'd8f77fb8-bc70-4315-a42c-b1730d8f9a1f';
DELETE FROM areas WHERE id = 'd8f77fb8-bc70-4315-a42c-b1730d8f9a1f';

-- Group 71: Port Harcourt - 'rumuigbo'
-- Keep: Rumuigbo (rumuigbo-port-harcourt)
-- Remove: Rumuigbo Port Harcourt (rumuigbo-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '2fe2d9a5-6e70-416b-adc5-48b162b6c45b' WHERE area_id = '95b09500-1c7d-4b54-b02a-9d238232f56e';
DELETE FROM areas WHERE id = '95b09500-1c7d-4b54-b02a-9d238232f56e';

-- Group 72: Port Harcourt - 'rumuobiakani'
-- Keep: Rumuobiakani (rumuobiakani-port-harcourt)
-- Remove: Rumuobiakani Port Harcourt (rumuobiakani-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '5de191c2-c939-4bd9-8edb-d91f96be273e' WHERE area_id = 'aef65273-131c-444c-9414-72c33458b698';
DELETE FROM areas WHERE id = 'aef65273-131c-444c-9414-72c33458b698';

-- Group 73: Port Harcourt - 'rumuodara'
-- Keep: Rumuodara (rumuodara-port-harcourt)
-- Remove: Rumuodara Port Harcourt (rumuodara-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '82b9c61e-d905-4728-bc42-8de5f686e95c' WHERE area_id = 'addd7906-c52b-478f-8780-4c3bf13ac392';
DELETE FROM areas WHERE id = 'addd7906-c52b-478f-8780-4c3bf13ac392';

-- Group 74: Port Harcourt - 'rumuodomaya'
-- Keep: Rumuodomaya (rumuodomaya-port-harcourt)
-- Remove: Rumuodomaya Port Harcourt (rumuodomaya-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '0c3cea07-9bf7-444f-a03a-2b0684ba4c97' WHERE area_id = 'd3732bab-4d08-42d6-b383-1ae1822cdfe4';
DELETE FROM areas WHERE id = 'd3732bab-4d08-42d6-b383-1ae1822cdfe4';

-- Group 75: Port Harcourt - 'rumuogba'
-- Keep: Rumuogba (rumuogba-port-harcourt)
-- Remove: Rumuogba Estate (rumuogba-estate-port-harcourt)
UPDATE businesses SET area_id = 'd2bd6b4f-5d24-4417-837e-8ee6e5a66a71' WHERE area_id = 'd0e8141e-70ac-46ff-81fc-18b686709e99';
DELETE FROM areas WHERE id = 'd0e8141e-70ac-46ff-81fc-18b686709e99';
-- Remove: Rumuogba Port Harcourt (rumuogba-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'd2bd6b4f-5d24-4417-837e-8ee6e5a66a71' WHERE area_id = 'a90bf394-478b-4c46-9ab5-9f0ae11b47d0';
DELETE FROM areas WHERE id = 'a90bf394-478b-4c46-9ab5-9f0ae11b47d0';

-- Group 76: Port Harcourt - 'rumuokoro'
-- Keep: Rumuokoro (rumuokoro-port-harcourt)
-- Remove: Rumuokoro Port Harcourt (rumuokoro-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '3e398e85-1f49-4bc4-aa7d-31c58fcb5949' WHERE area_id = '23291077-311b-4577-9ac3-2558a0d79a85';
DELETE FROM areas WHERE id = '23291077-311b-4577-9ac3-2558a0d79a85';

-- Group 77: Port Harcourt - 'rumuokwurusi'
-- Keep: Rumuokwurusi (rumuokwurusi-port-harcourt)
-- Remove: Rumuokwurusi Port Harcourt (rumuokwurusi-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '49f76ae7-292c-419e-9f15-09cade95daaa' WHERE area_id = 'f6254b45-c08d-468b-8b71-fe89650dbe5d';
DELETE FROM areas WHERE id = 'f6254b45-c08d-468b-8b71-fe89650dbe5d';

-- Group 78: Port Harcourt - 'rumuokwuta'
-- Keep: Rumuokwuta (rumuokwuta-port-harcourt)
-- Remove: Rumuokwuta Port Harcourt (rumuokwuta-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'cefb16c7-e642-45a0-9e7e-9afbe807b455' WHERE area_id = '046559e3-5017-47a8-86c7-aa2f949b5121';
DELETE FROM areas WHERE id = '046559e3-5017-47a8-86c7-aa2f949b5121';

-- Group 79: Port Harcourt - 'rumuolumeni'
-- Keep: Rumuolumeni (rumuolumeni-port-harcourt)
-- Remove: Rumuolumeni Port Harcourt (rumuolumeni-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = '59438a1b-24ad-432c-a5c3-82df5cb21bbc' WHERE area_id = '23a66912-36af-4601-bf3e-53236fc05889';
DELETE FROM areas WHERE id = '23a66912-36af-4601-bf3e-53236fc05889';

-- Group 80: Port Harcourt - 'rumuomasi'
-- Keep: Rumuomasi (rumuomasi-port-harcourt)
-- Remove: Rumuomasi Port Harcourt (rumuomasi-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'cb98d4b6-d342-423b-b591-71752d75fba9' WHERE area_id = 'd3b0eeac-6c01-448b-8e52-0361bf7cb35d';
DELETE FROM areas WHERE id = 'd3b0eeac-6c01-448b-8e52-0361bf7cb35d';

-- Group 81: Port Harcourt - 'trans amadi'
-- Keep: Trans Amadi (trans-amadi)
-- Remove: Trans-amadi (trans-amadi-port-harcourt)
UPDATE businesses SET area_id = 'ph-area-transamadi' WHERE area_id = '10193ee9-0b88-4ec3-b931-24f8b4ede0f4';
DELETE FROM areas WHERE id = '10193ee9-0b88-4ec3-b931-24f8b4ede0f4';
-- Remove: Trans-amadi Port Harcourt (trans-amadi-port-harcourt-port-harcourt)
UPDATE businesses SET area_id = 'ph-area-transamadi' WHERE area_id = '68c0d2f8-164c-449d-a2db-47972a77db74';
DELETE FROM areas WHERE id = '68c0d2f8-164c-449d-a2db-47972a77db74';

COMMIT;
-- ============================================
-- CROSS-GROUP MERGES (variants across groups)
-- ============================================

-- Merge D/line group (Group 54) into D-Line (Group 53 winner: ph-area-dline)
UPDATE businesses SET area_id = 'ph-area-dline' WHERE area_id = 'd3a3f339-5254-4e3e-b3e2-1c1e1e1e1e1e' OR area_id IN (
  SELECT id FROM areas WHERE slug IN ('dline-port-harcourt', 'dline-port-harcourt-port-harcourt')
);
DELETE FROM areas WHERE slug IN ('dline-port-harcourt', 'dline-port-harcourt-port-harcourt');

-- Merge Dline group (Group 55) into D-Line (Group 53 winner: ph-area-dline)
UPDATE businesses SET area_id = 'ph-area-dline' WHERE area_id IN (
  SELECT id FROM areas WHERE slug IN ('dline-port-harcourt-1', 'dline-port-harcourt-port-harcourt-1')
);
DELETE FROM areas WHERE slug IN ('dline-port-harcourt-1', 'dline-port-harcourt-port-harcourt-1');

-- Merge GRA Phase II into GRA Phase 2 (if both exist)
DO $$
DECLARE
  v_phase2_id text;
  v_phaseii_id text;
BEGIN
  SELECT id INTO v_phase2_id FROM areas WHERE slug = 'gra-phase-2-port-harcourt' LIMIT 1;
  SELECT id INTO v_phaseii_id FROM areas WHERE slug = 'gra-phase-ii-port-harcourt' LIMIT 1;
  IF v_phase2_id IS NOT NULL AND v_phaseii_id IS NOT NULL THEN
    UPDATE businesses SET area_id = v_phase2_id WHERE area_id = v_phaseii_id;
    DELETE FROM areas WHERE id = v_phaseii_id;
  END IF;
  -- Also clean up the Port Harcourt suffixed variant
  SELECT id INTO v_phaseii_id FROM areas WHERE slug = 'gra-phase-ii-port-harcourt-port-harcourt' LIMIT 1;
  IF v_phase2_id IS NOT NULL AND v_phaseii_id IS NOT NULL THEN
    UPDATE businesses SET area_id = v_phase2_id WHERE area_id = v_phaseii_id;
    DELETE FROM areas WHERE id = v_phaseii_id;
  END IF;
END $$;

-- Rename the winner to clean display name
UPDATE areas SET name = 'D-Line' WHERE id = 'ph-area-dline';
