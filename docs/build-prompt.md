# TARGET 2026-09-16

Photo gallery. Pictures with captions. Add a photo. Move it later.
JSON in, JSON out. Drop `src/lib/` into a React app you already have.

Prompt file (do not wait for a paste):
`C:\Users\aaron\OneDrive\Documents\prompts\multi-session-build-prompt-react.md`

Kind: gallery. Not a board. Not a scheduler. Not a search.

Local URL: http://127.0.0.1:49340/

Pages:
- Gallery: grid of photos, captions, add a photo, remove, download JSON.
- Later: drop, reorder, edit a piece, several galleries, load JSON.

Auth: none.

Sample: Mill Street Pottery in `src/lib/sample-gallery.js`. Fake names.
Email on `.example`.

## Session plan

- [x] Session 1: scaffold, grid with sample photos and captions, add a
      photo, JSON download, demo running.
- [ ] Session 2: drop a photo onto the grid, reorder photos.
- [ ] Session 3: load JSON, miss states (no photo, bad file), empty
      gallery, persist in the demo.
- [ ] Session 4 (expand A): richer pieces (title, credit, date), click
      to edit, search, Escape cancels.
- [ ] Session 5 (expand B): several galleries, blank gallery, duplicate,
      screenshots, demo video, README Demo, SHIPPED.

## Usefulness check

1. Who else? A shop or studio that already has a React app and needs a
   wall of photos with captions on a page. They finish "these pictures,
   in this order, with this writing."
2. Their data? Yes. Pass a gallery object, or load JSON. Photos and
   captions are theirs, not the sample pots.
3. Make it theirs? Yes. Gallery title, captions, CSS in
   `src/lib/gallery.css`.
4. Take it? Yes. Copy `src/lib/` into their React `src/` and import
   `Gallery`.
5. No account? Yes. No signup. No npm publish.
6. Coworker test? Yes. Zip `src/lib/`. They drop it in and import.
7. Keep a copy? Yes. Download JSON. The useful output is also the
   component running in their app with their pictures.
8. Miss and recover? Yes. Add with no photo. Bad file. Empty gallery.
   Then add a photo or load a good file.
9. README says how? Who, what, run, copy `src/lib/`, import, props.
   Demo stills and github.com player wait until SHIPPED.

## Go deep (done-means)

A person can add, open, edit, and remove their own photos through the
component. A piece has more than a caption (title, credit, date). They
can use the sample or start blank. Work stays after a refresh in the
demo, and JSON download works. Host apps get `value` / `onChange`. They
can find a piece later (search). A miss is recoverable. Title, names,
and CSS can change. `src/lib/` copies into an existing React app.
Rename. Duplicate a gallery if that job copies work. Escape cancels an
editor. Empty gallery says what to do next. Quiet Edit/Remove. Old JSON
still loads.

## This session

Session 1. Scaffold. Grid. Sample pots. Add a photo. Remove. Download
JSON. Leave the demo running.

## Next session

- Drop a photo onto the grid
- Reorder photos
- JSON download still writes the gallery after a move

## SHIPPED means

Session plan checked. Usefulness 1-9 all yes. README has copy
`src/lib/`, import, props, three tool screenshots, and a github.com
player URL. Log marked SHIPPED. This product appended to the
multi-session React prompt's shipped list. No second product in this
repo. Do not SHIPPED from session 1.
