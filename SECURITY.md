# Security Policy

## Supported versions

Security fixes are provided for the latest published version of
`vue3-highlight-text-color`.

## Reporting a vulnerability

Do not open a public GitHub issue for a suspected security vulnerability.
Instead, email [snub01@mail.ru](mailto:snub01@mail.ru) with:

- a clear description of the issue;
- steps to reproduce it or a minimal proof of concept;
- the affected package version and environment; and
- any suggested mitigation, if available.

You will receive an acknowledgement within seven days. Please allow time for
investigation and a fix before disclosing the issue publicly.

## Scope notes

The `text` prop is rendered as HTML. Consumers must sanitize untrusted input
before passing it to the component. This is documented behaviour, but reports
about bypasses or unexpected execution paths are welcome.
