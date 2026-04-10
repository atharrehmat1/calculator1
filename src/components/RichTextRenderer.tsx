"use client";

type ContentBlock =
  | { type: 'heading1' | 'heading2' | 'heading3' | 'paragraph'; content: string }
  | { type: 'image'; url: string; alt?: string; width?: number; height?: number };

export function RichTextRenderer({ content }: { content: string | null | undefined }) {
  if (!content) {
    return <p className="text-muted-foreground">No description available for this calculator.</p>;
  }

  // Check if content is HTML (contains HTML tags)
  const isHTML = /<[a-z][\s\S]*>/i.test(content);

  if (isHTML) {
    // Render HTML directly with support for inline and internal CSS
    // Extract style tag if present and inject it
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    const styleContent = styleMatch ? styleMatch[1] : null;
    const htmlContent = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    return (
      <>
        {styleContent && (
          <style dangerouslySetInnerHTML={{ __html: styleContent }} />
        )}
        <style dangerouslySetInnerHTML={{
          __html: `
          .calculator-description h1 {
            font-size: 2.25rem;
            font-weight: 700;
            line-height: 1.2;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            color: hsl(var(--foreground));
          }
          .calculator-description h2 {
            font-size: 1.875rem;
            font-weight: 600;
            line-height: 1.3;
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
            color: hsl(var(--foreground));
          }
          .calculator-description h3 {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.4;
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: hsl(var(--foreground));
          }
          .calculator-description h4 {
            font-size: 1.25rem;
            font-weight: 600;
            line-height: 1.4;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: hsl(var(--foreground));
          }
          .calculator-description h5 {
            font-size: 1.125rem;
            font-weight: 600;
            line-height: 1.4;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: hsl(var(--foreground));
          }
          .calculator-description h6 {
            font-size: 1rem;
            font-weight: 600;
            line-height: 1.4;
            margin-top: 0.75rem;
            margin-bottom: 0.5rem;
            color: hsl(var(--foreground));
          }
          .calculator-description p {
            margin-top: 0.75rem;
            margin-bottom: 0.75rem;
            color: hsl(var(--foreground));
          }
          .calculator-description ul {
            margin-top: 0.75rem;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            list-style-type: disc;
          }
          .calculator-description ol {
            margin-top: 0.75rem;
            margin-bottom: 0.75rem;
            padding-left: 1.5rem;
            list-style-type: decimal;
          }
          .calculator-description li {
            margin-top: 0.25rem;
            margin-bottom: 0.25rem;
            display: list-item;
          }
          .calculator-description strong {
            font-weight: 600;
          }
          .calculator-description em {
            font-style: italic;
          }
          /* Preserve inline styles for font-family, font-size, color, and background-color */
          .calculator-description [style*="font-family"],
          .calculator-description [style*="fontFamily"],
          .calculator-description [style*="font-size"],
          .calculator-description [style*="fontSize"],
          .calculator-description [style*="color"],
          .calculator-description [style*="background-color"],
          .calculator-description [style*="backgroundColor"] {
            /* Inline styles are preserved automatically via dangerouslySetInnerHTML */
          }
          /* Ensure span elements with inline styles are preserved */
          .calculator-description span[style] {
            display: inline;
          }
          .calculator-description img {
            max-width: 100%;
            height: auto;
          }
          .calculator-description picture,
          .calculator-description figure {
            margin: 1rem 0;
            max-width: 100%;
          }
          /* Default block image — only when no alignment class is set */
          .calculator-description figure.image:not([class*="image-style"]) {
            display: block;
          }

          /* ── Inline style ── */
          .calculator-description figure.image.image-style-inline {
            display: inline-block;
            float: none;
            margin: 0.25rem 0.5rem;
            vertical-align: middle;
          }

          /* ── Block (full-width, centred) ── */
          .calculator-description figure.image.image-style-block,
          .calculator-description figure.image.image-style-align-block {
            display: block;
            float: none;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
          }
          .calculator-description figure.image.image-style-block img,
          .calculator-description figure.image.image-style-align-block img {
            display: block;
            margin-left: auto;
            margin-right: auto;
          }

          /* ── Centre aligned ── */
          .calculator-description figure.image.image-style-align-center,
          .calculator-description .image-style-align-center {
            display: block;
            float: none !important;
            margin-left: auto !important;
            margin-right: auto !important;
            text-align: center;
          }
          .calculator-description figure.image.image-style-align-center img,
          .calculator-description .image-style-align-center img {
            display: block;
            margin-left: auto;
            margin-right: auto;
            float: none !important;
          }

          /* ── Block-align variants (CKEditor 5 newer class names) ── */
          .calculator-description figure.image.image-style-block-align-center {
            display: block;
            float: none !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .calculator-description figure.image.image-style-block-align-left {
            display: block;
            float: none;
            margin-left: 0;
            margin-right: auto;
          }
          .calculator-description figure.image.image-style-block-align-right {
            display: block;
            float: none;
            margin-left: auto;
            margin-right: 0;
          }

          /* ── Left aligned / float left ── */
          .calculator-description figure.image.image-style-align-left,
          .calculator-description .image-style-align-left {
            float: left !important;
            margin-right: 1rem !important;
            margin-left: 0 !important;
            margin-bottom: 0.5rem;
            display: block;
            max-width: 100%;
          }
          /* Fallback for unresized images */
          .calculator-description figure.image.image-style-align-left:not([style*="width"]),
          .calculator-description .image-style-align-left:not([style*="width"]) {
            max-width: 55%;
          }
          .calculator-description figure.image.image-style-align-left img,
          .calculator-description .image-style-align-left img {
            width: 100%;   /* fill the figure so resized figures render correctly */
            height: auto;
          }

          /* ── Right aligned / float right ── */
          .calculator-description figure.image.image-style-align-right,
          .calculator-description .image-style-align-right {
            float: right !important;
            margin-left: 1rem !important;
            margin-right: 0 !important;
            margin-bottom: 0.5rem;
            display: block;
            max-width: 100%;
          }
          .calculator-description figure.image.image-style-align-right:not([style*="width"]),
          .calculator-description .image-style-align-right:not([style*="width"]) {
            max-width: 55%;
          }
          .calculator-description figure.image.image-style-align-right img,
          .calculator-description .image-style-align-right img {
            width: 100%;
            height: auto;
          }

          /* ── Side style (floated right, like "beside text") ── */
          .calculator-description figure.image.image-style-side,
          .calculator-description .image-style-side {
            float: right !important;
            margin-left: 1rem !important;
            margin-bottom: 1rem;
            display: block;
            max-width: 100%;
          }
          .calculator-description figure.image.image-style-side:not([style*="width"]),
          .calculator-description .image-style-side:not([style*="width"]) {
            max-width: 55%;
          }
          .calculator-description figure.image.image-style-side img,
          .calculator-description .image-style-side img {
            width: 100%;
            height: auto;
          }

          /* ── Clearfix: only on the outer container, NOT on paragraphs ── */
          /* Clearing on p::after would push every paragraph below the float */
          .calculator-description::after {
            content: "";
            display: table;
            clear: both;
          }
          /* Table styles for CKEditor tables */
          .calculator-description table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }
          .calculator-description thead {
            background-color: hsl(var(--muted));
          }
          .calculator-description th,
          .calculator-description td {
            border: 1px solid hsl(var(--border));
            padding: 0.5rem 0.75rem;
            text-align: left;
            color: hsl(var(--foreground));
          }
          .calculator-description th {
            font-weight: 600;
            background-color: hsl(var(--muted));
          }
          .calculator-description tr:nth-child(even) {
            background-color: hsl(var(--muted) / 0.3);
          }
          .calculator-description caption {
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            color: hsl(var(--muted-foreground));
          }
          .calculator-description figure.table {
            margin: 1rem 0;
            overflow-x: auto;
          }
        ` }} />
        <div
          className="calculator-description"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </>
    );
  }

  // Legacy JSON block format support (for backward compatibility)
  let blocks: ContentBlock[] = [];

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0) {
      blocks = parsed;
    } else {
      // Fallback to plain text
      blocks = [{ type: 'paragraph', content: content }];
    }
  } catch {
    // If it's not JSON, treat as plain text
    blocks = [{ type: 'paragraph', content: content }];
  }

  return (
    <div className="space-y-4 prose dark:prose-invert max-w-none">
      {blocks.map((block, index) => {
        if (block.type === 'image') {
          return (
            <div key={index} className="my-4">
              <img
                src={block.url}
                alt={block.alt || ''}
                className="max-w-full h-auto rounded-lg border"
                style={{
                  width: block.width ? `${block.width}px` : 'auto',
                  height: block.height ? `${block.height}px` : 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          );
        }

        const blockContent = block.content || '';
        switch (block.type) {
          case 'heading1':
            return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{blockContent}</h1>;
          case 'heading2':
            return <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">{blockContent}</h2>;
          case 'heading3':
            return <h3 key={index} className="text-xl font-medium mt-4 mb-2">{blockContent}</h3>;
          case 'paragraph':
          default:
            return <p key={index} className="text-sm text-muted-foreground whitespace-pre-line">{blockContent}</p>;
        }
      })}
    </div>
  );
}

