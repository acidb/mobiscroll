The Preact source code is in the `lib` folder.

Preact 10 does not keep the original DOM attributes when rendered into an existing DOM element. But we need this, because users might use the existing id, or any other attribute on the original element.
For this the source code is modified in `lib/src/diff/index.js`, lines 382-385, where the reading of the dom attributes is commented out.
Need to keep this modifications when updating Preact to a newer version.
