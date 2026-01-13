# Skripta za deployment Supabase Edge funkcije
# Uporaba: .\deploy-edge-function.ps1

Write-Host "🚀 Deploying Supabase Edge Function..." -ForegroundColor Cyan

# Preveri, ali je Supabase CLI nameščen
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Supabase CLI ni nameščen!" -ForegroundColor Red
    Write-Host "Namesti ga z: npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Deploy funkcije
Write-Host "`n📤 Deploying send-welcome-email function..." -ForegroundColor Green
supabase functions deploy send-welcome-email

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment uspešen!" -ForegroundColor Green
    Write-Host "`n📝 Naslednji koraki:" -ForegroundColor Cyan
    Write-Host "1. Preveri, ali je RESEND_API_KEY nastavljen:" -ForegroundColor White
    Write-Host "   supabase secrets list" -ForegroundColor Gray
    Write-Host "`n2. Če ni, ga nastavi:" -ForegroundColor White
    Write-Host "   supabase secrets set RESEND_API_KEY=re_tvoj_api_ključ" -ForegroundColor Gray
    Write-Host "`n3. Nastavi Database Webhook v Supabase Dashboard" -ForegroundColor White
    Write-Host "   Glej SUPABASE_SETUP.md za podrobna navodila" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Deployment ni uspel!" -ForegroundColor Red
    Write-Host "Preveri napake zgoraj" -ForegroundColor Yellow
}
