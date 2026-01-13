# 📧 Nastavitev avtomatskega pošiljanja mailov

## 1️⃣ Pridobi Resend API ključ

1. Pojdi na https://resend.com/
2. Ustvari račun ali se prijavi
3. Pojdi na **API Keys** in ustvari nov API ključ
4. Kopiraj ključ (začne se z `re_...`)

## 2️⃣ Namesti Supabase CLI

```powershell
# Preveri, ali je že nameščen
supabase --version

# Če ni nameščen, namesti z npm
npm install -g supabase
```

## 3️⃣ Prijava v Supabase

```powershell
supabase login
```

## 4️⃣ Poveži se s projektom

1. Pojdi na https://supabase.com/dashboard
2. Odpri svoj projekt
3. V Settings > General > Reference ID kopiraj **Project ID**

```powershell
# V mapi projekta izvedi:
supabase link --project-ref tvoj-project-id
```

## 5️⃣ Nastavi RESEND_API_KEY

```powershell
# Nastavi secret v Supabase:
supabase secrets set RESEND_API_KEY=re_tvoj_api_ključ
```

## 6️⃣ Naloži Edge funkcijo

```powershell
# V korenski mapi projekta izvedi:
supabase functions deploy send-welcome-email
```

Po uspešnem deploymentu dobiš URL funkcije, npr:
`https://xxxxx.supabase.co/functions/v1/send-welcome-email`

## 7️⃣ Testiraj funkcijo ročno

```powershell
# Testiraj z curl ali PowerShell:
$headers = @{
    "Authorization" = "Bearer tvoj-anon-key"
    "Content-Type" = "application/json"
}

$body = @{
    email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://xxxxx.supabase.co/functions/v1/send-welcome-email" -Method Post -Headers $headers -Body $body
```

## 8️⃣ Nastavi Database Webhook

### Preko Supabase Dashboard:

1. Pojdi na **Database** > **Webhooks**
2. Klikni **Create a new hook**
3. Nastavi:
   - **Name**: `send-welcome-email-webhook`
   - **Table**: `waiting_list`
   - **Events**: Izberi samo `Insert`
   - **Type**: `HTTP Request`
   - **Method**: `POST`
   - **URL**: `https://xxxxx.supabase.co/functions/v1/send-welcome-email`
   - **HTTP Headers**:
     ```
     Authorization: Bearer tvoj-service-role-key
     Content-Type: application/json
     ```
4. Klikni **Create webhook**

### Ali preko SQL (alternativa):

```sql
-- V SQL Editor izvedi:
CREATE TRIGGER on_waiting_list_insert
AFTER INSERT ON waiting_list
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://xxxxx.supabase.co/functions/v1/send-welcome-email',
  'POST',
  '{"Content-Type":"application/json","Authorization":"Bearer tvoj-service-role-key"}',
  '{}',
  '5000'
);
```

## 9️⃣ Testiraj celoten flow

1. Pojdi na svojo waiting list stran
2. Vnesi email naslov
3. Preveri, ali se email pošlje avtomatsko
4. Preveri Supabase logs:
   ```powershell
   supabase functions logs send-welcome-email
   ```

## 🔐 Kako najdeš API ključe?

V Supabase Dashboard > Settings > API:
- **anon (public) key**: Za javne klice iz brskalnika
- **service_role (secret) key**: Za webhook (nikoli ne deli javno!)

## ⚠️ Opombe

- **RESEND_API_KEY** mora biti nastavljen kot Supabase secret (korak 5)
- **service_role key** potrebuješ samo za webhook avtorizacijo
- Če uporabljate svojo domeno v Resendu, zamenjaj `onboarding@resend.dev` z `onboarding@tvoja-domena.com`
- Webhook se sproži samo pri INSERT (ne pri UPDATE ali DELETE)

## 🎉 Vse je nastavljeno!

Ko uporabnik vnese email v waiting list:
1. ✅ Email se shrani v Supabase tabelo `waiting_list`
2. ✅ Database webhook sproži Edge funkcijo
3. ✅ Edge funkcija pošlje welcome email preko Resenda
4. ✅ Uporabnik prejme email: "Dobrodošel v Študko! 🚀"
