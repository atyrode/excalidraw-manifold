# excalidraw-manifold

## What this is

manifold's maintained build of `@excalidraw/excalidraw`, based on upstream tag
`v0.18.1` (commit `a2ec2889babf7d2295469c6d90ebe77fae57df84`). The package name is
kept as `@excalidraw/excalidraw` so consumer imports (`@excalidraw/excalidraw`,
`/types`, `/element/types`, `/data/transform`, `/index.css`) never churn; provenance
is explicit in the consumer's dependency URL. Versioning: `0.18.1-manifold.N`.

## Manifold-owned changes

Rule: per-element `customData` gates only — stock behavior when the flag is absent,
additive diffs only, never restructure upstream code.

- **Cursor color** (`clients.ts` `getClientColor`): returns
  `collaborator?.color?.background` when present; connId-hash HSL only as fallback.
- **Link affordances off** (`showHyperlinkIcon: false`): no link badge paint
  (`renderer/staticScene.ts` `renderLinkIcon`), no link hit-testing
  (`components/hyperlink/helpers.ts` `isPointHittingLinkIcon`), and no
  `showHyperlinkPopup: "info"` from any of the four setter sites in
  `components/App.tsx`.
- **Whole-surface activation** (`fullInteractionTarget: true`):
  `isIframeLikeElementCenter` uses whole bounds instead of the center third; the
  pointer-up quick-click gate drops the <300 ms requirement unless a drag occurred;
  the activation `setTimeout` delay is 0 instead of 100 ms. Mobile quick-tap path
  stays stock.
- **Hover hint suppressed** (`fullInteractionTarget: true`): the
  `excalidraw__embeddable-hint` ("Click to interact") pill is not rendered — it is
  redundant and occluding when the whole surface activates on one click.
- **Style panel suppressed** (`showShapeActions: false`):
  `element/showSelectedShapeActions.ts` returns `false` when the selection is
  non-empty and every selected element carries the flag; mixed selections still show
  the panel.

## Release procedure

From the repo root, on branch `manifold` (requires node 18–22 or `--ignore-engines`):

```
bunx yarn@1.22.22 install --frozen-lockfile --ignore-engines
bunx yarn@1.22.22 --cwd packages/excalidraw --ignore-engines build:esm
cd packages/excalidraw && bun pm pack
# sanity-check the tarball before releasing:
#   unpack to a temp dir; assert dist/prod/index.js, dist/dev/index.js, the
#   index.css export target, and dist/types/ exist; package.json version is
#   0.18.1-manifold.N; grep -c showShapeActions dist/prod/*.js >= 1
git tag v0.18.1-manifold.N && git push manifold manifold --tags
gh release create v0.18.1-manifold.N --repo atyrode/excalidraw-manifold \
  --title "0.18.1-manifold.N" excalidraw-excalidraw-0.18.1-manifold.N.tgz
```

## Sync procedure

Deliberate and infrequent — never automatic:

```
git fetch upstream && git rebase <new-tag> manifold
```

Then re-run the release procedure with a bumped version, update manifold's dependency
URL in `packages/web/package.json`, and run `bun run gate` in the manifold repo. The
sync is not real until that gate is green.

## Clean room

Never consult `atyrode/excalidraw` (the pad.ws-era fork) — no merges, cherry-picks,
or code reading. Re-derive every change from upstream source plus manifold's recorded
semantics (`docs/decisions/` in the manifold repo) only.
