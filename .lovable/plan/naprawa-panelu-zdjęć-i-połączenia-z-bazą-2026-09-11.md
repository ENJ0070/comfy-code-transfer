# Naprawa panelu, zdjęć i połączenia z bazą

## Zakres
- Uzupełnić bezpieczną konfigurację połączenia serwera z obecną bazą.
- Uodpornić serwer na nazwy zmiennych używane przez Lovable i Vercel.
- Naprawić dodawanie oraz edycję produktów: formularz ma czyścić się wyłącznie po udanym zapisie i pokazywać prawdziwy wynik.
- Naprawić przesyłanie zdjęć głównych, dodatkowych, QC i logo agentów przez ten sam chroniony zapis.
- Dopasować logo Kakaobuy w kalkulatorze także przy wariancie nazwy „Kakobuy”.
- Sprawdzić zapis testowego produktu, upload pliku, publiczne wyświetlanie zdjęć i odczyt QC.

## Szczegóły techniczne
- Zachować tajny klucz wyłącznie po stronie serwera; nie umieszczać go w kodzie przeglądarki.
- Dodać obsługę `SUPABASE_URL`/`VITE_SUPABASE_URL` oraz bezpiecznych nazw klucza serwerowego.
- Nie osłabiać zabezpieczeń bazy ani nie przyznawać publicznego zapisu.
- Na końcu podać osobno kroki dla Vercel, ponieważ jego ustawień nie można zmienić z poziomu projektu Lovable.
