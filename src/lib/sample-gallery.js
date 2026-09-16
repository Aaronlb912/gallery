function svg(body) {
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 400">${body}</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`
}

const linen = `<rect width="320" height="400" fill="#e6d8c4"/><rect x="18" y="18" width="284" height="364" fill="#efe4d2"/>`

export const sampleGallery = {
  id: 'gallery-mill-street',
  title: 'Mill Street Pottery',
  note: 'Finished pieces on the shelf this week. Names are fake.',
  items: [
    {
      id: 'p-bowl',
      src: svg(
        `${linen}<ellipse cx="160" cy="286" rx="92" ry="14" fill="#c9b49a"/><path d="M72 210c8 54 176 54 176 0 0-28-28-48-88-48s-88 20-88 48z" fill="#8d5a3a"/><path d="M86 206c10 36 138 36 148 0-8-18-32-32-74-32s-66 14-74 32z" fill="#a36a44"/><ellipse cx="160" cy="174" rx="78" ry="12" fill="#c48a5c"/>`,
      ),
      caption: 'Wide bowl, ash over iron. Thrown by Nia Brooks. nia@example.com',
    },
    {
      id: 'p-vase',
      src: svg(
        `${linen}<ellipse cx="160" cy="318" rx="46" ry="10" fill="#c9b49a"/><path d="M118 300c-4-70 8-140 18-168h48c10 28 22 98 18 168z" fill="#3e3a36"/><path d="M136 132c2-18 8-28 24-28s22 10 24 28" fill="#2c2926"/><rect x="148" y="104" width="24" height="18" rx="3" fill="#4a4540"/><path d="M128 220c20 16 44 16 64 0" fill="none" stroke="#6a6258" stroke-width="3"/>`,
      ),
      caption: 'Bottle vase, tenmoku. Jules Nguyen, evening firing.',
    },
    {
      id: 'p-mug',
      src: svg(
        `${linen}<ellipse cx="150" cy="292" rx="58" ry="12" fill="#c9b49a"/><path d="M96 168h108v116c0 18-24 28-54 28s-54-10-54-28z" fill="#d7d2c4"/><path d="M96 168h108v22H96z" fill="#ece8dc"/><path d="M204 188c28 4 38 28 28 52-8 20-26 28-40 24" fill="none" stroke="#cfc8b8" stroke-width="14" stroke-linecap="round"/><path d="M118 210h64" stroke="#b7c4b2" stroke-width="6"/>`,
      ),
      caption: 'Mug, celadon lip. Pat Ortiz for the shop shelf.',
    },
    {
      id: 'p-jar',
      src: svg(
        `${linen}<ellipse cx="160" cy="308" rx="70" ry="12" fill="#c9b49a"/><path d="M96 188c4 78 124 78 128 0 2-46-28-70-64-70s-66 24-64 70z" fill="#6e3b28"/><ellipse cx="160" cy="188" rx="64" ry="14" fill="#8a4c32"/><path d="M128 148h64l-8 28h-48z" fill="#5a3122"/><ellipse cx="160" cy="148" rx="36" ry="10" fill="#7a4330"/><rect x="148" y="132" width="24" height="16" rx="4" fill="#4e2c1e"/>`,
      ),
      caption: 'Lidded jar, shino. Mira Patel, mira@example.com',
    },
  ],
}
