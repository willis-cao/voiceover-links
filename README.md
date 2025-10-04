# VoiceOver Links

Firefox extension to add URLs to ARIA labels for external links, and forms that submit to external links.

A link with:
- Text: "GitHub"
- URL: `https://www.github.com`

Will be announced by screen readers as:
> "GitHub, external link to www.github.com"

A form submit button with:
- Text: "Submit"
- `<form action="https://payment-processor.com/checkout" method="post">`

Will be announced by screen readers as:
> "Submit, submits to external link payment-processor.com/checkout"

- Ignores internal/relative links; same-origin requests
- Keeps any existing ARIA labels

## Installation

### From Source

1. Clone this repository or download the source code
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the extension directory and select the `manifest.json` file