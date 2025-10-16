import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Users } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'simplificador' | 'superadmin';
}

interface TeamUser {
  id: string;
  email: string;
  fullName: string;
  role: 'simplificador' | 'superadmin';
}

const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  role: z.enum(["simplificador", "superadmin"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: sessionData } = useQuery<{ user: User }>({
    queryKey: ["/api/auth/session"],
  });

  const { data: teamUsers, isLoading } = useQuery<TeamUser[]>({
    queryKey: ["/api/admin/team"],
    enabled: !!sessionData?.user && sessionData.user.role === 'superadmin',
  });

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "simplificador",
    },
  });

  const handleCreateUser = async (data: CreateUserFormData) => {
    try {
      await apiRequest("POST", "/api/admin/team", data);
      await queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      toast({
        title: "Usuario creado",
        description: `${data.fullName} ha sido agregado al equipo`,
      });
      setIsDialogOpen(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el usuario",
        variant: "destructive",
      });
    }
  };

  const user = sessionData?.user;
  if (!user || user.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Acceso denegado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/adminlaunch')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Gestión de Equipo</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Administra los usuarios del equipo Lo Simple</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-user">
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo miembro al equipo Lo Simple
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateUser)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-fullname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} data-testid="input-password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-role">
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="simplificador">Simplificador</SelectItem>
                            <SelectItem value="superadmin">Superadmin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" data-testid="button-submit">
                      Crear Usuario
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando equipo...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamUsers?.map((member) => (
              <Card key={member.id} data-testid={`card-user-${member.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.fullName}</CardTitle>
                        <CardDescription className="text-sm">{member.email}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant={member.role === 'superadmin' ? 'default' : 'secondary'} data-testid={`badge-role-${member.id}`}>
                    {member.role === 'superadmin' ? 'Superadmin' : 'Simplificador'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {!isLoading && teamUsers && teamUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No hay usuarios en el equipo</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Agrega el primer miembro del equipo</p>
          </div>
        )}
      </div>
    </div>
  );
}
