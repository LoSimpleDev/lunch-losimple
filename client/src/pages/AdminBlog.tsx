import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, ArrowLeft, LogOut } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'simplificador' | 'superadmin';
}

const categories = ["SAS", "Facturación", "Firma Electrónica", "Legal"];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  author: string;
  isPublished: boolean;
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "SAS",
  imageUrl: "",
  metaTitle: "",
  metaDescription: "",
  author: "Lo Simple",
  isPublished: false,
};

export default function AdminBlog() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(emptyForm);
  const [autoSlug, setAutoSlug] = useState(true);

  const { data: sessionData, isLoading: isLoadingSession } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
  });

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/admin/posts"],
    enabled: !!sessionData?.user && (sessionData.user.role === 'superadmin' || sessionData.user.role === 'simplificador'),
  });

  useEffect(() => {
    if (!isLoadingSession && (!sessionData?.user || (sessionData.user.role !== 'superadmin' && sessionData.user.role !== 'simplificador'))) {
      setLocation('/admin-login');
      toast({
        title: "Acceso denegado",
        description: "Debes iniciar sesión como administrador",
        variant: "destructive",
      });
    }
  }, [sessionData, isLoadingSession, setLocation, toast]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      await queryClient.invalidateQueries();
      setLocation('/admin-login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      return apiRequest("POST", "/api/blog/admin/posts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Artículo creado", description: "El artículo se ha creado correctamente." });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Error al crear el artículo", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogFormData> }) => {
      return apiRequest("PATCH", `/api/blog/admin/posts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Artículo actualizado", description: "Los cambios se han guardado correctamente." });
      closeDialog();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Error al actualizar el artículo", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/blog/admin/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Artículo eliminado", description: "El artículo ha sido eliminado." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Error al eliminar el artículo", variant: "destructive" });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      return apiRequest("PATCH", `/api/blog/admin/posts/${id}`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/admin/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Error al cambiar estado", variant: "destructive" });
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    setFormData(emptyForm);
    setAutoSlug(true);
  };

  const openCreateDialog = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setAutoSlug(true);
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      author: post.author,
      isPublished: post.isPublished,
    });
    setAutoSlug(false);
    setIsDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: autoSlug ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.category) {
      toast({ title: "Error", description: "Completa todos los campos requeridos", variant: "destructive" });
      return;
    }

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (post: BlogPost) => {
    if (confirm(`¿Estás seguro de eliminar "${post.title}"?`)) {
      deleteMutation.mutate(post.id);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  const user = sessionData?.user;
  if (!user || (user.role !== 'superadmin' && user.role !== 'simplificador')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/adminlaunch">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Administrar Blog</h1>
              <p className="text-muted-foreground">
                {user.fullName} - {user.role === 'superadmin' ? 'Superadmin' : 'Simplificador'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700" data-testid="button-new-post">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Artículo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPost ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ej: Cómo constituir una SAS en Ecuador"
                      data-testid="input-title"
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="slug">URL (slug) *</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <Switch
                          checked={autoSlug}
                          onCheckedChange={setAutoSlug}
                          data-testid="switch-auto-slug"
                        />
                        <span className="text-muted-foreground">Auto</span>
                      </div>
                    </div>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="como-constituir-sas-ecuador"
                      disabled={autoSlug}
                      data-testid="input-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL: /blog/{formData.slug || "..."}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Extracto / Descripción corta *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Breve descripción que aparece en las tarjetas del blog..."
                      rows={2}
                      data-testid="input-excerpt"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido (HTML) *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="<h2>Título de sección</h2><p>Contenido del artículo...</p>"
                      rows={12}
                      className="font-mono text-sm"
                      data-testid="input-content"
                    />
                    <p className="text-xs text-muted-foreground">
                      Usa HTML para formatear: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, etc.
                    </p>
                  </div>

                  {/* SEO Section */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">SEO (Opcional)</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle">Meta Título</Label>
                        <Input
                          id="metaTitle"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                          placeholder="Título para motores de búsqueda (máx 60 caracteres)"
                          data-testid="input-meta-title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="metaDescription">Meta Descripción</Label>
                        <Textarea
                          id="metaDescription"
                          value={formData.metaDescription}
                          onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                          placeholder="Descripción para motores de búsqueda (máx 160 caracteres)"
                          rows={2}
                          data-testid="input-meta-description"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Author & Publish */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="author">Autor</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                          placeholder="Lo Simple"
                          data-testid="input-author"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <Switch
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                          data-testid="switch-publish"
                        />
                        <Label>Publicar artículo</Label>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={closeDialog} data-testid="button-cancel">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700"
                      data-testid="button-save"
                    >
                      {createMutation.isPending || updateMutation.isPending ? "Guardando..." : (editingPost ? "Guardar cambios" : "Crear artículo")}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Artículos ({posts?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando artículos...</div>
            ) : posts && posts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id} data-testid={`row-post-${post.slug}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          post.category === "SAS" ? "bg-purple-100 text-purple-700" :
                          post.category === "Facturación" ? "bg-yellow-100 text-yellow-700" :
                          post.category === "Firma Electrónica" ? "bg-green-100 text-green-700" :
                          "bg-cyan-100 text-cyan-700"
                        }`}>
                          {post.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePublishMutation.mutate({ id: post.id, isPublished: !post.isPublished })}
                          className={post.isPublished ? "text-green-600" : "text-gray-400"}
                          data-testid={`button-toggle-${post.slug}`}
                        >
                          {post.isPublished ? (
                            <><Eye className="w-4 h-4 mr-1" /> Publicado</>
                          ) : (
                            <><EyeOff className="w-4 h-4 mr-1" /> Borrador</>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {post.publishedAt 
                            ? format(new Date(post.publishedAt), "d MMM yyyy", { locale: es })
                            : format(new Date(post.createdAt), "d MMM yyyy", { locale: es })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {post.isPublished && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" title="Ver artículo" data-testid={`button-view-${post.slug}`}>
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </a>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => openEditDialog(post)}
                            title="Editar"
                            data-testid={`button-edit-${post.slug}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(post)}
                            className="text-red-500 hover:text-red-600"
                            title="Eliminar"
                            data-testid={`button-delete-${post.slug}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No hay artículos aún</p>
                <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer artículo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
