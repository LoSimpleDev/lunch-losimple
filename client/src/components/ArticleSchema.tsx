import { useEffect } from 'react';

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  publishedAt: Date | string | null;
  imageUrl?: string;
  category: string;
  slug: string;
  content: string;
}

export function ArticleSchema({ 
  title, 
  description, 
  author, 
  publishedAt, 
  imageUrl,
  category,
  slug,
  content 
}: ArticleSchemaProps) {
  useEffect(() => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "author": {
        "@type": "Person",
        "name": author,
        "url": "https://losimple.ai"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Lo Simple",
        "logo": {
          "@type": "ImageObject",
          "url": "https://losimple.ai/logo.png"
        }
      },
      "datePublished": publishedAt ? (typeof publishedAt === 'string' ? publishedAt : publishedAt.toISOString()) : null,
      "dateModified": publishedAt ? (typeof publishedAt === 'string' ? publishedAt : publishedAt.toISOString()) : null,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://losimple.ai/blog/${slug}`
      },
      "image": imageUrl || "https://losimple.ai/og-image.jpg",
      "articleSection": category,
      "wordCount": wordCount,
      "inLanguage": "es-EC"
    };

    const existingScript = document.querySelector('script[data-schema-id="article-schema"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-id', 'article-schema');
    script.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(script);

    return () => {
      const script = document.querySelector('script[data-schema-id="article-schema"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, author, publishedAt, imageUrl, category, slug, content]);

  return null;
}
