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

