# Resume PDF version: why PDF 2.0, and the trade-off

Decision (2026-11-05): the resume PDFs are exported as **PDF 2.0** (`--pdf-standard 2.0`, Typst 0.14 or newer). The build fails if a file does not start with `%PDF-2.0` (see `scripts/build-resume.mjs`).

## Why PDF 2.0

The owner asked for the newest PDF format. PDF 2.0 (ISO 32000-2, 2017) improves metadata and accessibility tag semantics. For a plain one-column text resume the visible benefit is small.

## Known trade-off: compatibility with older tools

Some applicant tracking systems (ATS) and upload forms may handle PDF 2.0 less well than PDF 1.7. **This has not been tested, and there is no known list of affected systems.** It is a general risk, not an observed failure.

Possible reasons:

- **Older parsing libraries.** Many ATS pipelines extract text with third-party libraries (for example pdfminer, PDFBox/Tika, or old versions of iText and Poppler). PDF 2.0 was standardised in 2017, and support in older libraries and products arrived gradually.
- **Strict upload validation.** Some forms check the start of the file (for example `%PDF-1.x`) before processing. An overly strict check could reject `%PDF-2.0`.
- **Format changes.** PDF 2.0 removes some legacy features and adds new ones (encryption, tags, metadata). A plain, unencrypted text resume is structurally close to PDF 1.7, so most parsers should still read it.

If a tool does fail, it often fails silently: the candidate profile shows empty or garbled text instead of an error message.

Accessibility note: the Typst documentation recommends PDF/UA-1 for accessible documents. PDF/UA-1 requires PDF 1.7 or earlier, so it cannot be combined with PDF 2.0. Typst already writes tagged PDF by default.

## If a portal rejects or garbles the PDF

1. Upload the PDF and check the portal's text preview or parsed profile.
2. If the text is missing or wrong, set `PDF_VERSION` to `'1.7'` in `scripts/build-resume.mjs` (and update the expectation in `src/__tests__/resume.test.ts`), then push. CI rebuilds all three PDFs.
3. Optionally check text extraction locally, for example `pdftotext ridhwan-habib-resume-lead.pdf -`.

## Related

- Resume source: `resume/resume_us.typ` (one file, three variants chosen with `--input role=senior|lead|analyst`; `--input public=true` omits the phone number and the work-authorization line).
- Pipeline: `.github/workflows/deploy.yml` installs a pinned Typst release and runs `npm run resume` before the site build.
