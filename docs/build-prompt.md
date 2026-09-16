# TARGET 2026-09-16

Photo gallery. Pictures with captions. Add a photo. Move it later.
JSON in, JSON out. Drop `src/lib/` into a React app you already have.

Prompt file (do not wait for a paste):
`C:\Users\aaron\OneDrive\Documents\prompts\multi-session-build-prompt-react.md`

Kind: gallery. Not a board. Not a scheduler. Not a search.

Local URL: http://127.0.0.1:49340/
Repo: https://github.com/Aaronlb912/gallery

Pages:
- Gallery list: open, new blank, duplicate, remove. Reset sample.
- Gallery: grid, drop, reorder, search, rename, add photo, load and
  download JSON (this gallery or all galleries). Click a print to see
  it large. Print wall. Undo after Remove.
- New photo: header Add photo. Save. Escape cancels.
- Edit piece: Edit on a piece. Title, caption, credit, date. Duplicate.
- Large print: click the picture. Escape goes back.

Auth: none required. Demo can sign in with Puter to keep galleries
on another device. Host apps omit that and save `value` themselves.

Sample: Mill Street Pottery in `src/lib/sample-gallery.js`. Fake names.
Email on `.example`. Bisque waiting is the empty shelf.

## Session plan

- [x] Session 1: scaffold, grid with sample photos and captions, add a
      photo, JSON download, demo running.
- [x] Session 2: drop a photo onto the grid, reorder photos.
- [x] Session 3: load JSON, miss states (no photo, bad file), empty
      gallery, persist in the demo.
- [x] Session 4 (expand A): richer pieces (title, credit, date), click
      to edit, search, Escape cancels.
- [x] Session 5 (expand B): several galleries, blank gallery, duplicate.
- [x] Session 6: screenshots, demo video, README Demo, LinkedIn draft,
      SHIPPED.

## Usefulness check

1. Who else? A shop or studio that already has a React app and needs a
   wall of photos with captions on a page. They finish "these pictures,
   in this order, with this writing."
2. Their data? Yes. Pass a gallery object, or load JSON. Photos and
   captions are theirs, not the sample pots.
3. Make it theirs? Yes. Gallery title, captions, CSS in
   `src/lib/gallery.css`.
4. Take it? Yes. Copy `src/lib/` into their React `src/` and import
   `Workspace` or `Gallery`.
5. No account? Yes. No signup. No npm publish.
6. Coworker test? Yes. Zip `src/lib/`. They drop it in and import.
7. Keep a copy? Yes. Download JSON. The useful output is also the
   component running in their app with their pictures.
8. Miss and recover? Yes. Add with no photo. Bad file. Empty gallery.
   Blank gallery name. Last gallery. Then add a photo or load a good
   file.
9. README says how? Yes. Who, what, run, copy `src/lib/`, import,
   props, three tool stills, github.com player.

## Go deep (done-means)

A person can add, open, edit, and remove their own photos through the
component. A piece has more than a caption (title, credit, date). They
can use the sample or start blank. Work stays after a refresh in the
demo, and JSON download works. Host apps get `value` / `onChange`. They
can find a piece later (search). A miss is recoverable. Title, names,
and CSS can change. `src/lib/` copies into an existing React app.
Rename. Duplicate a gallery. Escape cancels an editor. Empty gallery
says what to do next. Quiet Edit/Remove. Old JSON still loads.

## This session

Optional Puter sign-in on the Galleries list so a public visitor can
keep their own galleries on another device.

## Next session

None. Product is shipped. Do not start a second idea in this repo.

## SHIPPED means

Session plan checked. Usefulness 1-9 all yes. README has copy
`src/lib/`, import, props, three tool screenshots, and a github.com
player URL. Log marked SHIPPED. This product appended to the
multi-session React prompt's shipped list. No second product in this
repo. Do not SHIPPED until screenshots and video.
