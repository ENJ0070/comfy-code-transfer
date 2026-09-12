# Zdjęcia QC od razu, dodawanie sprzedawcy, brakujące zdjęcia produktów

## 1. Zdjęcia QC widoczne natychmiast

Dziś w oknie produktu sekcja QC jest pusta, dopóki ktoś nie kliknie przycisku — dopiero wtedy odpytywany jest QC Finder.

Zmiana:
- Zdjęcia QC, które produkt ma już zapisane w bazie, pokazują się od razu po otwarciu produktu, bez klikania i bez czekania.
- Jeśli produkt nie ma zapisanych zdjęć, pobierane są raz w tle i zapisywane, żeby następnym razem też były natychmiast.
- Przycisk „Pokaż więcej zdjęć QC” zostaje i dopiero on sięga do QC Findera po dodatkowe zdjęcia.
- Narzędzie QC (strona /qc) działa jak dotąd — tam wyszukiwanie uruchamia użytkownik.

## 2. Dodawanie sprzedawcy

Sprawdziłem bazę: tabela sprzedawców istnieje i zapis techniczny do niej działa (dodałem i usunąłem wpis testowy), więc przyczyna leży po stronie strony, nie bazy — dokładnej jeszcze nie potwierdziłem.

Kroki:
- Przejście przez formularz „Dodaj sprzedawcę” w podglądzie i odtworzenie błędu.
- Naprawa znalezionej przyczyny. Znane słabe punkty do poprawy niezależnie od wyniku: formularz cicho nic nie robi, gdy brakuje nazwy lub loginu (dodam czytelny komunikat), a przy dodawaniu nowego sprzedawcy wymagane będzie hasło.
- Po zapisie lista sprzedawców odświeża się i nowy sklep od razu na niej widać.

## 3. Brakujące zdjęcia produktów

Obecnie zdjęcia dociągane są wyłącznie z USFans; jeśli ten nie odpowie, produkt zostaje bez zdjęć (ok. 24 produkty bez zdjęcia głównego, ok. 94 bez QC).

Zmiana:
- Dodaję zapasowe źródła: gdy USFans nie zwróci zdjęć, produkt pobierany jest z Kakobuy, a potem z Litbuy (ten sam produkt, inny pośrednik).
- Jeśli nadal brak zdjęć QC, zapisywane są przynajmniej zdjęcia produktu i warianty kolorystyczne — tak aby żaden produkt z działającym linkiem nie został pusty.
- Po wdrożeniu uruchomię uzupełnianie na wszystkich produktach i podam, ile udało się naprawić i ile zostało bez zdjęć (bo źródło ich nie ma).

## Szczegóły techniczne

- `src/components/ProductModal.tsx` — sekcja QC dostaje początkowe zdjęcia z `product.qc_images`; pierwsze wywołanie `qcForProduct` tylko gdy lista pusta; `finderQcByProduct` przenoszone pod „Pokaż więcej”.
- `src/components/QcPhotos.tsx` — nowy prop `initialImages` oraz start paginacji od podanych zdjęć.
- `src/lib/agentApi.ts` — `fetchAgentDetails` z łańcuchem źródeł: USFans → Kakobuy → Litbuy (endpointy produktu po `channel` + `goodsId` z `extractSourceLink`).
- `src/lib/media.functions.ts` — użycie nowego łańcucha, zapis galerii/kolorystyk gdy QC niedostępne.
- `src/routes/admin.tsx` (`SellersTab`) — walidacja pól z komunikatem, wymagane hasło przy tworzeniu, poprawa obsługi błędu zapisu.

## Weryfikacja

- Otwarcie produktu w podglądzie: zdjęcia QC widoczne od razu, „Pokaż więcej” dokłada kolejne.
- Dodanie testowego sprzedawcy w panelu i usunięcie go po teście.
- Raport z uzupełniania zdjęć: liczba naprawionych i pozostałych produktów.
