import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowLeft, User, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";
import { useEffect } from "react";

import decoratorGrid from "@assets/blog-decorator-grid.png";
import decoratorLines from "@assets/blog-decorator-lines.png";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "SAS": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-600" },
  "Facturación": { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-600" },
  "Firma Electrónica": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-600" },
  "Legal": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-600" },
};

function getCategoryStyle(category: string) {
  return categoryColors[category] || { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300", border: "border-gray-600" };
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const textOnly = content.replace(/<[^>]*>/g, '');
  const wordCount = textOnly.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;
  
  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts/${slug}`);
      if (!res.ok) throw new Error("Article not found");
      return res.json();
    },
    enabled: !!slug
  });
  
  const { data: relatedPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", "related", post?.category],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts?category=${encodeURIComponent(post!.category)}`);
      if (!res.ok) return [];
      const posts = await res.json();
      return posts.filter((p: BlogPost) => p.slug !== slug).slice(0, 3);
    },
    enabled: !!post?.category
  });
  
  // Update page title and meta tags
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || `${post.title} | Lo Simple Blog`;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', post.metaDescription || post.excerpt);
      
      // Update OG tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute('content', post.metaTitle || post.title);
      
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute('content', post.metaDescription || post.excerpt);
    }
    
    return () => {
      document.title = "Lo Simple | Blog";
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-3/4 mb-6" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-muted-foreground mb-8">
            Lo sentimos, el artículo que buscas no existe o ha sido eliminado.
          </p>
          <Link href="/blog">
            <Button data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const style = getCategoryStyle(post.category);
  const readTime = estimateReadTime(post.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 lg:py-20">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-40 h-40 opacity-15 transform rotate-6">
          <img src={decoratorGrid} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-10 left-10 w-48 h-24 opacity-20">
          <img src={decoratorLines} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" data-testid="breadcrumb">
            <Link href="/blog">
              <span className="hover:text-primary cursor-pointer">Blog</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={style.text}>{post.category}</span>
          </nav>
          
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${style.bg} ${style.text}`}>
              {post.category}
            </span>
            {post.publishedAt && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                {format(new Date(post.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
              </span>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime} min de lectura
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {post.title}
          </h1>
          
          {/* Excerpt */}
          <p className="text-lg md:text-xl text-muted-foreground">
            {post.excerpt}
          </p>
          
          {/* Author */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.bg}`}>
              <User className={`w-5 h-5 ${style.text}`} />
            </div>
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-sm text-muted-foreground">Equipo Lo Simple</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Article Content */}
      <article className="py-12 lg:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
            data-testid="article-content"
          />
        </div>
      </article>
      
      {/* CTA Box */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`rounded-2xl p-8 md:p-10 border-2 ${style.border} ${style.bg}`}>
            <h3 className="text-2xl font-bold mb-3">¿Necesitas ayuda con tu empresa?</h3>
            <p className="text-muted-foreground mb-6">
              En Lo Simple te acompañamos en todo el proceso de constitución y formalización de tu negocio en Ecuador.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/home-2">
                <Button className="bg-purple-600 hover:bg-purple-700" data-testid="button-cta-services">
                  Ver servicios
                </Button>
              </Link>
              <a href="https://calendly.com/veronica-losimple/30min" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" data-testid="button-cta-schedule">
                  Agendar llamada gratuita
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Artículos relacionados</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedStyle = getCategoryStyle(relatedPost.category);
                return (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <div className={`p-5 rounded-xl border-2 ${relatedStyle.border} hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900`} data-testid={`related-post-${relatedPost.slug}`}>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${relatedStyle.bg} ${relatedStyle.text}`}>
                        {relatedPost.category}
                      </span>
                      <h3 className="font-semibold mt-3 line-clamp-2 hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
      
      {/* Back to Blog */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="button-back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al blog
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
