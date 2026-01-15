import { useState, useCallback } from 'react';
import { parseContent, ParsedContent } from '../utils/textParser';

export interface ExtractionState {
  isLoading: boolean;
  error: string | null;
  content: ParsedContent | null;
}

export interface ExtractionControls {
  extractFromUrl: (url: string) => Promise<ParsedContent | null>;
  extractFromText: (text: string, title?: string) => ParsedContent;
  clearError: () => void;
}

/**
 * Simple HTML text extraction
 * Removes script, style tags and extracts text content
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style tags with their content
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '');

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');

  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Extract title from HTML
 */
function extractTitleFromHtml(html: string): string {
  // Try og:title first
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  if (ogTitleMatch) return ogTitleMatch[1];

  // Try <title> tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return titleMatch[1].trim();

  // Try h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return h1Match[1].trim();

  return 'Untitled';
}

/**
 * Try to extract main article content
 */
function extractArticleContent(html: string): string {
  // Try to find article tag content
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    return extractTextFromHtml(articleMatch[1]);
  }

  // Try main tag
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    return extractTextFromHtml(mainMatch[1]);
  }

  // Try common content class patterns
  const contentPatterns = [
    /<div[^>]*class="[^"]*(?:article|content|post|entry|story)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*(?:article|content|post|entry|story)[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const pattern of contentPatterns) {
    const match = html.match(pattern);
    if (match && match[1].length > 500) {
      return extractTextFromHtml(match[1]);
    }
  }

  // Fallback: extract from body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    return extractTextFromHtml(bodyMatch[1]);
  }

  // Last resort: extract from entire HTML
  return extractTextFromHtml(html);
}

export function useArticleExtractor(): ExtractionState & ExtractionControls {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<ParsedContent | null>(null);

  const extractFromUrl = useCallback(async (url: string): Promise<ParsedContent | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate URL
      let validUrl: URL;
      try {
        validUrl = new URL(url);
      } catch {
        // Try adding https:// if missing
        if (!url.startsWith('http')) {
          validUrl = new URL(`https://${url}`);
        } else {
          throw new Error('Invalid URL format');
        }
      }

      // Fetch the page
      const response = await fetch(validUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SpeedReader/1.0)',
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();

      // Extract content
      const title = extractTitleFromHtml(html);
      const text = extractArticleContent(html);

      if (text.length < 50) {
        throw new Error('Could not extract enough content from this page');
      }

      const parsedContent = parseContent(text, title);
      setContent(parsedContent);
      setIsLoading(false);
      return parsedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract content';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  }, []);

  const extractFromText = useCallback((text: string, title?: string): ParsedContent => {
    const parsedContent = parseContent(text, title);
    setContent(parsedContent);
    return parsedContent;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    content,
    extractFromUrl,
    extractFromText,
    clearError,
  };
}
