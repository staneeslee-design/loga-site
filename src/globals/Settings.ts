import type { GlobalConfig } from 'payload'
import { revalidateSiteGlobal } from '../lib/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Nustatymai',
  admin: { group: 'Nustatymai' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSiteGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kontaktai',
          description: 'Rodoma svetainės antraštėje, poraštėje, mygtukuose „Skambinti“, Viber ir WhatsApp.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Telefonas (rodomas)', type: 'text', defaultValue: '+370 641 23788', required: true, admin: { width: '50%' } },
                { name: 'email', label: 'El. paštas', type: 'email', defaultValue: 'dalys@loga.lt', required: true, admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'viber', label: 'Viber numeris', type: 'text', defaultValue: '+37064123788', admin: { width: '50%', description: 'Tarptautiniu formatu, be tarpų.' } },
                { name: 'whatsapp', label: 'WhatsApp numeris', type: 'text', defaultValue: '+37064123788', admin: { width: '50%', description: 'Tarptautiniu formatu, be tarpų.' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'address', label: 'Adresas', type: 'text', defaultValue: 'Fabriko g. 12, Lentvaris', admin: { width: '50%' } },
                { name: 'mapsUrl', label: 'Nuoroda į žemėlapį', type: 'text', defaultValue: 'https://maps.google.com/?q=Fabriko+g.+12,+Lentvaris', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'companyName', label: 'Įmonės pavadinimas', type: 'text', admin: { width: '50%', description: 'Įrašomas į privatumo politiką vietoje [ĮMONĖS PAVADINIMAS].' } },
                { name: 'companyCode', label: 'Įmonės kodas', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Pranešimai',
          description: 'Kur siųsti naujas užklausas iš svetainės formų. Galima įjungti kelis kanalus vienu metu.',
          fields: [
            {
              name: 'mail',
              label: 'El. paštas',
              type: 'group',
              fields: [
                { name: 'enabled', label: 'Siųsti užklausas el. paštu', type: 'checkbox', defaultValue: true },
                {
                  name: 'recipients',
                  label: 'Gavėjai',
                  type: 'array',
                  labels: { singular: 'Gavėjas', plural: 'Gavėjai' },
                  fields: [{ name: 'email', label: 'El. paštas', type: 'email', required: true }],
                  admin: { condition: (_, s) => !!s?.enabled },
                },
                {
                  type: 'collapsible',
                  label: 'SMTP serveris (siuntimui)',
                  admin: { initCollapsed: true, condition: (_, s) => !!s?.enabled, description: 'Pvz. Gmail: smtp.gmail.com, 465, SSL, programos slaptažodis.' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'host', label: 'Serveris', type: 'text', admin: { width: '40%', placeholder: 'smtp.gmail.com' } },
                        { name: 'port', label: 'Prievadas', type: 'number', defaultValue: 465, admin: { width: '20%' } },
                        { name: 'secure', label: 'SSL/TLS', type: 'checkbox', defaultValue: true, admin: { width: '20%' } },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'user', label: 'Vartotojas', type: 'text', admin: { width: '50%' } },
                        { name: 'pass', label: 'Slaptažodis', type: 'text', admin: { width: '50%', components: { Field: '@/components/admin/SecretField#SecretField' } } },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        { name: 'fromName', label: 'Siuntėjo vardas', type: 'text', defaultValue: 'Loga group svetainė', admin: { width: '50%' } },
                        { name: 'fromEmail', label: 'Siuntėjo el. paštas', type: 'email', admin: { width: '50%' } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'telegram',
              label: 'Telegram',
              type: 'group',
              admin: { description: 'Sukurkite botą per @BotFather, įrašykite jo raktą ir pokalbio (chat) ID. Užklausos ateis į telefoną akimirksniu.' },
              fields: [
                { name: 'enabled', label: 'Siųsti į Telegram', type: 'checkbox' },
                {
                  type: 'row',
                  admin: { condition: (_, s) => !!s?.enabled },
                  fields: [
                    { name: 'botToken', label: 'Boto raktas (token)', type: 'text', admin: { width: '60%', components: { Field: '@/components/admin/SecretField#SecretField' } } },
                    { name: 'chatIds', label: 'Chat ID (kelis atskirkite kableliu)', type: 'text', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'viberBot',
              label: 'Viber',
              type: 'group',
              admin: { description: 'Viber boto (Viber Admin Panel) raktas ir gavėjų Viber ID. Gavėjas turi būti parašęs botui bent kartą.' },
              fields: [
                { name: 'enabled', label: 'Siųsti į Viber', type: 'checkbox' },
                {
                  type: 'row',
                  admin: { condition: (_, s) => !!s?.enabled },
                  fields: [
                    { name: 'token', label: 'Boto raktas', type: 'text', admin: { width: '60%', components: { Field: '@/components/admin/SecretField#SecretField' } } },
                    { name: 'receivers', label: 'Gavėjų ID (kableliu)', type: 'text', admin: { width: '40%' } },
                  ],
                },
              ],
            },
            {
              name: 'webhook',
              label: 'Webhook (WhatsApp, CRM, Make, Zapier…)',
              type: 'group',
              admin: { description: 'Užklausa siunčiama JSON formatu POST metodu. Tinka WhatsApp pranešimams per Make/Zapier/Twilio arba CRM.' },
              fields: [
                { name: 'enabled', label: 'Siųsti į webhook', type: 'checkbox' },
                { name: 'url', label: 'URL', type: 'text', admin: { condition: (_, s) => !!s?.enabled } },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteName', label: 'Svetainės pavadinimas', type: 'text', defaultValue: 'Loga group' },
            { name: 'homeTitle', label: 'Pagrindinio puslapio pavadinimas', type: 'text', localized: true },
            { name: 'homeDescription', label: 'Pagrindinio puslapio aprašymas', type: 'textarea', localized: true },
            { name: 'carsTitle', label: 'Automobilių katalogo pavadinimas', type: 'text', localized: true },
            { name: 'enginesTitle', label: 'Variklių katalogo pavadinimas', type: 'text', localized: true },
          ],
        },
      ],
    },
  ],
}
