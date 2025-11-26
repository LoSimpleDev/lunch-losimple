import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, Rocket, CheckCircle } from "lucide-react";
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

function LaunchCTACard() {
  return (
    <div 
      className="rounded-2xl p-8 sticky top-24"
      style={{ backgroundColor: '#FFF3CD' }}
      data-testid="cta-launch-card"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
          <Rocket className="w-8 h-8 text-[#6C5CE7]" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Constituye tu SAS con Lo Simple
        </h3>
        
        <p className="text-gray-700 mb-6">
          Formaliza tu empresa en Ecuador en solo 5 días. Te acompañamos en cada paso del proceso.
        </p>
        
        <ul className="text-left space-y-3 mb-8">
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Proceso 100% en línea</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Firma electrónica incluida</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>RUC y permisos gestionados</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Soporte legal personalizado</span>
          </li>
        </ul>
        
        <Link href="/login">
          <Button 
            size="lg" 
            className="w-full text-white font-semibold bg-[#6C5CE7] hover:bg-[#5a4bd1]"
            data-testid="button-cta-launch"
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
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
      {/* Hero Section - Simplified */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 lg:py-20">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 opacity-20 transform -rotate-12 hidden lg:block">
          <img src={decoratorPerson} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-16 right-16 w-32 h-32 opacity-15 transform rotate-6 hidden lg:block">
          <img src={decoratorGrid} alt="" className="w-full h-full object-contain" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-6">
              Blog Lo Simple
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Recursos para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600">
                emprendedores
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guías, consejos y noticias sobre constitución de empresas, facturación electrónica y firma digital en Ecuador.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content - Two Column Layout */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column - Articles */}
            <div className="flex-1 lg:max-w-[65%]">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Recursos para emprendedores</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-[#6C5CE7] hover:bg-[#5a4bd1]" : ""}
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
              
              {/* Blog Posts Grid */}
              {isLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <BlogPostCardSkeleton key={i} />
                  ))}
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
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
            
            {/* Right Column - CTA Card */}
            <div className="lg:w-[35%]">
              <LaunchCTACard />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer spacer */}
      <div className="py-8 bg-white dark:bg-gray-950"></div>
    </div>
  );
}
