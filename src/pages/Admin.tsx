
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizzaContext } from '@/contexts/PizzaContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from '@/hooks/use-toast';
import PizzaForm from '@/components/PizzaForm';
import { Pizza, PizzaFormData } from '@/types/types';
import { Plus, Edit, Trash, Check, Search, Bell } from 'lucide-react';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAdmin, 
    pizzas, 
    priorityRequests, 
    addPizza, 
    updatePizza, 
    deletePizza,
    markPriorityAsHandled,
    clearHandledPriorities
  } = usePizzaContext();
  
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pizzaToDelete, setPizzaToDelete] = useState<Pizza | null>(null);
  const [isPizzaFormOpen, setIsPizzaFormOpen] = useState(false);
  
  // Redirecionar se não for admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);
  
  const handlePizzaSubmit = (data: PizzaFormData) => {
    addPizza({
      ...data,
      id: '',
      active: true,
    });
    setIsPizzaFormOpen(false);
  };
  
  const handleEditPizza = (pizza: Pizza) => {
    setEditingPizza(pizza);
  };
  
  const handleUpdatePizza = (data: PizzaFormData) => {
    if (editingPizza) {
      updatePizza(editingPizza.id, {
        ...editingPizza,
        ...data,
      });
      setEditingPizza(null);
    }
  };
  
  const confirmDeletePizza = (pizza: Pizza) => {
    setPizzaToDelete(pizza);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeletePizza = () => {
    if (pizzaToDelete) {
      deletePizza(pizzaToDelete.id);
      setPizzaToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleMarkAsHandled = (id: string) => {
    markPriorityAsHandled(id);
    toast({
      title: "Pedido atendido",
      description: "O pedido de prioridade foi marcado como atendido.",
    });
  };
  
  const handleClearHandledPriorities = () => {
    clearHandledPriorities();
    toast({
      title: "Lista limpa",
      description: "Todos os pedidos atendidos foram removidos da lista.",
    });
  };
  
  // Agrupar pedidos de prioridade por pizza
  const groupedPriorityRequests = priorityRequests.reduce((acc, request) => {
    const pizza = pizzas.find(p => p.id === request.pizzaId);
    
    if (!pizza) return acc;
    
    if (!acc[request.pizzaId]) {
      acc[request.pizzaId] = {
        pizza,
        requests: [],
        count: 0,
      };
    }
    
    acc[request.pizzaId].requests.push(request);
    acc[request.pizzaId].count += 1;
    
    return acc;
  }, {} as Record<string, { pizza: Pizza; requests: typeof priorityRequests; count: number }>);
  
  // Ordenar pizzas por número de pedidos
  const sortedPriorities = Object.values(groupedPriorityRequests).sort(
    (a, b) => b.count - a.count
  );
  
  // Filtrar pedidos não atendidos
  const pendingRequests = priorityRequests.filter(request => !request.handled);
  const hasHandledRequests = priorityRequests.some(request => request.handled);
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-display font-bold mb-6">Painel de Administração</h1>
      
      <Tabs defaultValue="add-pizza" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="add-pizza">Gerenciar Pizzas</TabsTrigger>
          <TabsTrigger value="priorities" className="relative">
            Prioridades
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 bg-primary">{pendingRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="add-pizza">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerenciar Pizzas</CardTitle>
              <Dialog open={isPizzaFormOpen} onOpenChange={setIsPizzaFormOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus size={16} />
                    <span>Nova Pizza</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display">Adicionar Nova Pizza</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <PizzaForm onSubmit={handlePizzaSubmit} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pizzas.map((pizza) => (
                    <TableRow key={pizza.id}>
                      <TableCell className="font-medium">{pizza.name}</TableCell>
                      <TableCell>
                        <Badge variant={pizza.type === 'doce' ? 'secondary' : 'default'}>
                          {pizza.type === 'doce' ? 'Doce' : 'Salgada'}
                        </Badge>
                      </TableCell>
                      <TableCell>{pizza.size}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditPizza(pizza)}
                              >
                                <Edit size={16} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-display">Editar Pizza</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                {editingPizza && (
                                  <PizzaForm 
                                    onSubmit={handleUpdatePizza} 
                                    defaultValues={editingPizza} 
                                    buttonText="Atualizar Pizza"
                                  />
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => confirmDeletePizza(pizza)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {pizzas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center">
                          <Search size={36} className="mb-2 text-muted-foreground" />
                          <p>Nenhuma pizza cadastrada</p>
                          <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => setIsPizzaFormOpen(true)}
                          >
                            Adicionar sua primeira pizza
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="priorities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className={pendingRequests.length > 0 ? "text-primary animate-pulse" : ""} />
                Solicitações de Prioridade
              </CardTitle>
              
              {hasHandledRequests && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleClearHandledPriorities}
                >
                  Limpar Atendidos
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {sortedPriorities.length > 0 ? (
                <div className="space-y-6">
                  {sortedPriorities.map(({ pizza, requests, count }) => (
                    <div key={pizza.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-muted">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden">
                            <img 
                              src={pizza.image} 
                              alt={pizza.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{pizza.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant={pizza.type === 'doce' ? 'secondary' : 'default'}>
                                {pizza.type === 'doce' ? 'Doce' : 'Salgada'}
                              </Badge>
                              <span>{pizza.size}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-lg py-1">
                          {count} {count === 1 ? 'pedido' : 'pedidos'}
                        </Badge>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mesa</TableHead>
                            <TableHead>Pessoas</TableHead>
                            <TableHead>Observações</TableHead>
                            <TableHead>Horário</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requests.map((request) => (
                            <TableRow 
                              key={request.id} 
                              className={request.handled ? "opacity-60 bg-muted/40" : ""}
                            >
                              <TableCell className="font-medium">{request.tableNumber}</TableCell>
                              <TableCell>{request.peopleCount}</TableCell>
                              <TableCell>
                                {request.observations || <span className="text-muted-foreground italic">Nenhuma</span>}
                              </TableCell>
                              <TableCell>
                                {new Date(request.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </TableCell>
                              <TableCell className="text-right">
                                {!request.handled ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                                    onClick={() => handleMarkAsHandled(request.id)}
                                  >
                                    <Check size={16} className="mr-1" /> Atendido
                                  </Button>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50">Atendido</Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell size={36} className="mx-auto mb-3" />
                  <p className="text-lg">Nenhuma solicitação de prioridade ainda.</p>
                  <p>As solicitações aparecerão aqui quando os clientes pedirem.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a pizza 
              {pizzaToDelete?.name ? ` "${pizzaToDelete.name}"` : ''} 
              e removerá todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePizza} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;
