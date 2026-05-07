# Changelog

## Unreleased

- Added an opt-in `?avidaTest=1` browser harness and Playwright worker smoke test for running-instance regression checks.
- Added browser regression coverage for freezer deletion with stale DOM nodes outside the target container.
- Added browser regression coverage for workspace-open prompts when freezer save state is uncertain.
- Added browser regression coverage for missing parent time-series data in population stats updates.
- Fixed population statistics updates and CSV export when parent/clade series are missing from incoming worker data.
- Fixed freezer item deletion paths so stale DOM nodes are not removed from the wrong parent.
- Fixed workspace-open prompts so the uncertain save state is treated as needing confirmation.
- Fixed CSV export from unexpected page states so it produces an empty CSV string instead of leaving stale or undefined data.
- Guarded freezer item creation, grid redraw calls, zoom reset, and selected-organism color rendering when UI or grid data is incomplete.
