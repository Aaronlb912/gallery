# Gallery

Photos with captions. Add a picture. Move it. Keep more than one
gallery. Load and download JSON. Drop `src/lib/` into a React app you
already have.

The demo starts on the gallery list. DEMO GALLERY Mill Street Pottery
is the sample. Names are fake. Open it, or make a blank gallery.

## Who it is for

A shop or studio that already runs React and needs a wall of pictures
on a page. Put your photos and captions in. Save the JSON.

## What you get

Copy `src/lib/`. That folder is the component.

- `Workspace.jsx` - gallery list plus the open gallery
- `Gallery.jsx` - one gallery
- `Item.jsx` - compact piece
- `ItemPage.jsx` - new photo and edit
- `gallery.css` - the look
- `gallery-json.js` - download, load parse, blank template, and move
  helpers
- `sample-gallery.js` - Mill Street Pottery sample
- `index.js` - the import

No account. Galleries opens the list. A new gallery starts empty.
Duplicate a gallery. You cannot remove the last one. The demo keeps
galleries after a refresh (Reset sample on the list if you want Mill
Street back). Add photo in the header opens a page. Escape cancels.
Drop a picture on the grid to add it. Drag a piece to reorder. Search
finds title, caption, and credit. Rename the gallery with Edit. Edit a
piece for title, caption, credit, and date. Load JSON for one gallery
or all galleries. Download this gallery or all galleries. Old JSON with
only `caption` still loads.

## Run the demo

```
npm install
npm start
```

Open http://127.0.0.1:49340/

## Copy into an app

Copy the `src/lib/` folder into your React `src/` folder.

```
import { Workspace } from './lib'
```

Or one gallery:

```
import { Gallery } from './lib'
```

## Props

`Workspace`

- `value` - `{ galleries, activeGalleryId }`
- `onChange(next)` - full workspace
- `onResetSample` - optional. Demo uses this for Reset sample.

`Gallery`

- `value` - one gallery `{ id, title, note, items }`
- `onChange(next)` - that gallery
- `onGalleries` - optional. Back to the list
- `onLoadWorkspace(next)` - optional. When a loaded file has many galleries
- `onDownloadAll` - optional

A piece is `{ id, src, title, caption, credit, date }`. `src` is a data
URL. Host apps save `value` however they want. The demo uses
localStorage. Do not treat that as the only save path.
