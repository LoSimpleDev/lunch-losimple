import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowRight, Rocket, CheckCircle, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { BlogPost } from "@shared/schema";

import decoratorPerson from "@assets/blog-decorator-person.png";
import decoratorGrid from "@assets/blog-decorator-grid.png";
import decoratorFolder from "@assets/blog-decorator-folder.png";
import logoUrl from "@assets/aArtboard 1_1757538311500.png";

const POSTS_PER_PAGE = 6;

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
      style={{ backgroundColor: '#FFEAA7' }}
      data-testid="cta-launch-card"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
          <Rocket className="w-8 h-8 text-[#6C5CE7]" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Lanza tu negocio con todo incluido
        </h3>
        
        <p className="text-gray-700 mb-6">
          En 5 días tendrás tu empresa lista para operar con presencia digital profesional.
        </p>
        
        <ul className="text-left space-y-3 mb-8">
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Compañía SAS constituida</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Títulos Acción</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Firma Electrónica de Empresa</span>
          </li>
          <li className="flex items-start gap-2 text-gray-800">
            <CheckCircle className="w-5 h-5 text-[#6C5CE7] mt-0.5 flex-shrink-0" />
            <span>Soporte por 1 año</span>
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

function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="pagination-prev"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Anterior
      </Button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "bg-[#6C5CE7] hover:bg-[#5a4bd1]" : ""}
            data-testid={`pagination-page-${page}`}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="pagination-next"
      >
        Siguiente
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const totalPosts = posts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = posts?.slice(startIndex, startIndex + POSTS_PER_PAGE) || [];

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [posts, totalPages, currentPage]);

  return (
    <>
      <SEO 
        title="Blog Lo Simple | Recursos para emprendedores en Ecuador"
        description="Guías, consejos y noticias sobre constitución de empresas SAS, facturación electrónica y firma digital en Ecuador. Recursos para emprendedores."
        canonical="/blog"
        keywords="emprender Ecuador, SAS Ecuador blog, facturación electrónica, firma digital Ecuador"
      />
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
                    onClick={() => handleCategoryChange(null)}
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
                        onClick={() => handleCategoryChange(category)}
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
              ) : paginatedPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    {paginatedPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
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
                      onClick={() => handleCategoryChange(null)}
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
      
      {/* Related Services Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Servicios relacionados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/launch">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-purple-200 dark:border-purple-800" data-testid="card-related-launch">
                <CardContent className="p-6 text-center">
                  <Rocket className="w-10 h-10 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-bold mb-2">Launch</h3>
                  <p className="text-sm text-muted-foreground">Constituye tu SAS con todo incluido</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/multas-sas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-amber-200 dark:border-amber-800" data-testid="card-related-multas">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-10 h-10 mx-auto mb-4 text-amber-600" />
                  <h3 className="font-bold mb-2">Consulta de Multas</h3>
                  <p className="text-sm text-muted-foreground">Verifica el estado de tu SAS</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/cerrar-sas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-red-200 dark:border-red-800" data-testid="card-related-cerrar">
                <CardContent className="p-6 text-center">
                  <ArrowRight className="w-10 h-10 mx-auto mb-4 text-red-600" />
                  <h3 className="font-bold mb-2">Cerrar SAS</h3>
                  <p className="text-sm text-muted-foreground">Cierra tu empresa legalmente</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Width CTA Banner */}
      <section className="py-24 md:py-32 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Menos trámites. Más acción.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Agenda una llamada con nuestro equipo y descubre cómo podemos ayudarte a lanzar tu negocio.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 font-semibold shadow-lg hover:shadow-xl transition-all bg-[#6C5CE7] hover:bg-[#5a4bd1]"
            onClick={() => window.open('https://calendly.com/veronica-losimple/30min', '_blank')}
            data-testid="button-schedule-blog"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Agendar cita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141464] text-white py-12 px-4 mt-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img src={logoUrl} alt="Lo Simple" className="h-8 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm mb-4 opacity-80">
                La puerta de entrada a la formalización en Ecuador.
              </p>
              <p className="text-sm opacity-60">
                Hecho en Ecuador con 💜
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>
                  <Link href="/" className="hover:opacity-100 transition-opacity" data-testid="link-footer-inicio">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/launch" className="hover:opacity-100 transition-opacity" data-testid="link-footer-launch">
                    Launch
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:opacity-100 transition-opacity" data-testid="link-footer-blog">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Ecuador</li>
                <li>
                  <a href="mailto:hola@losimple.ai" className="hover:opacity-100 transition-opacity" data-testid="link-footer-email">
                    hola@losimple.ai
                  </a>
                </li>
                <li>
                  <a href="tel:+593958613237" className="hover:opacity-100 transition-opacity" data-testid="link-footer-phone">
                    +593 958 613 237
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
              <p>© 2024 Lo Simple. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <Link href="/terminos-y-condiciones" className="hover:opacity-100 transition-opacity" data-testid="link-footer-terminos">
                  Términos y Condiciones
                </Link>
                <Link href="/politica-privacidad-datos-lo-simple" className="hover:opacity-100 transition-opacity" data-testid="link-footer-privacidad">
                  Política de Privacidad
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
