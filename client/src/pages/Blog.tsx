import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";

import decoratorPerson from "@assets/blog-decorator-person.png";
import decoratorGrid from "@assets/blog-decorator-grid.png";
import decoratorLines from "@assets/blog-decorator-lines.png";
import decoratorFolder from "@assets/blog-decorator-folder.png";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "SAS": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-600" },
  "Facturación": { bg: "bg-yellow-100 dark:bg-yellow-900/30", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-600" },
  "Firma Electrónica": { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300", border: "border-green-600" },
  "Legal": { bg: "bg-cyan-100 dark:bg-cyan-900/30", text: "text-cyan-700 dark:text-cyan-300", border: "border-cyan-600" },
};

function getCategoryStyle(category: string) {
  return categoryColors[category] || { bg: "bg-gray-100 dark:bg-gray-900/30", text: "text-gray-700 dark:text-gray-300", border: "border-gray-600" };
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const style = getCategoryStyle(post.category);
  
  return (
    <Card className={`group overflow-hidden border-2 ${style.border} hover:shadow-lg transition-all duration-300`} data-testid={`card-blog-post-${post.slug}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${style.bg} ${style.text}`}>
            {post.category}
          </span>
          {post.publishedAt && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {format(new Date(post.publishedAt), "d MMM yyyy", { locale: es })}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <Link href={`/blog/${post.slug}`}>
          <Button variant="ghost" className="p-0 h-auto font-semibold group-hover:text-primary" data-testid={`link-read-more-${post.slug}`}>
            Leer más
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function BlogPostCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-6 w-24" />
      </CardContent>
    </Card>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/blog/posts?category=${encodeURIComponent(selectedCategory)}`
        : "/api/blog/posts";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error loading posts");
      return res.json();
    }
  });
  
  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/blog/categories"]
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 lg:py-28">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-30 transform -rotate-12">
          <img src={decoratorPerson} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-20 right-20 w-40 h-40 opacity-20 transform rotate-6">
          <img src={decoratorGrid} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-10 left-1/4 w-48 h-24 opacity-25">
          <img src={decoratorLines} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-20 right-10 w-28 h-28 opacity-20 transform rotate-12">
          <img src={decoratorFolder} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-6">
              Blog Lo Simple
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Recursos para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                emprendedores
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Guías, consejos y noticias sobre constitución de empresas, facturación electrónica y firma digital en Ecuador.
            </p>
          </div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="py-8 border-b bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-purple-600 hover:bg-purple-700" : ""}
              data-testid="filter-all"
            >
              Todos
            </Button>
            {categories?.map((category) => {
              const style = getCategoryStyle(category);
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? `${style.bg} ${style.text} border ${style.border}` : ""}
                  data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Button>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogPostCardSkeleton key={i} />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 opacity-50">
                <img src={decoratorFolder} alt="" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay artículos disponibles</h3>
              <p className="text-muted-foreground">
                {selectedCategory 
                  ? `No hay artículos en la categoría "${selectedCategory}" por el momento.`
                  : "Estamos trabajando en nuevo contenido. ¡Vuelve pronto!"}
              </p>
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSelectedCategory(null)}
                >
                  Ver todos los artículos
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-cyan-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para formalizar tu negocio?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Constituye tu SAS en solo 5 días con el apoyo de nuestro equipo de expertos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/home-2">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" data-testid="button-cta-services">
                  Ver servicios
                </Button>
              </Link>
              <a href="https://calendly.com/veronica-losimple/30min" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-cta-schedule">
                  Agendar llamada
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer spacer */}
      <div className="py-8 bg-white dark:bg-gray-950"></div>
    </div>
  );
}
