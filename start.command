#!/bin/bash
# Loga group — paleidimas vienu paspaudimu (macOS). Dukart spustelėkite šį failą.
cd "$(dirname "$0")"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js nerastas. Atsidarys nodejs.org — įdiekite LTS versiją ir paleiskite šį failą dar kartą."
  open "https://nodejs.org/en/download"
  read -n 1 -s -r -p "Paspauskite bet kurį klavišą..."
  exit 1
fi
echo "Node $(node -v)"
if [ ! -d node_modules ]; then
  echo "▶ Diegiamos priklausomybės (pirmą kartą ~1–2 min)…"
  npm install --no-audit --no-fund || { read -n 1 -s -r -p "Klaida. Paspauskite klavišą..."; exit 1; }
fi
if [ ! -f loga.db ]; then
  echo "▶ Pildoma duomenų bazė (automobiliai, varikliai, nuotraukos)…"
  npm run seed || { read -n 1 -s -r -p "Klaida. Paspauskite klavišą..."; exit 1; }
fi
( for i in $(seq 1 90); do sleep 2; curl -s -o /dev/null http://localhost:3000/ && break; done; open "http://localhost:3000"; open "http://localhost:3000/admin" ) &
echo "▶ Svetainė: http://localhost:3000   Administravimas: http://localhost:3000/admin"
echo "  Sustabdyti: uždarykite šį langą arba Ctrl+C"
npm run dev
