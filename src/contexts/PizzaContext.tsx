
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Pizza, PriorityRequest } from '../types/types';
import { toast } from '@/hooks/use-toast';

// Tipos de dados para o contexto
type PizzaContextType = {
  pizzas: Pizza[];
  priorityRequests: PriorityRequest[];
  filterType: 'all' | 'salgada' | 'doce';
  searchQuery: string;
  isAdmin: boolean;
  darkMode: boolean;
  setFilterType: (type: 'all' | 'salgada' | 'doce') => void;
  setSearchQuery: (query: string) => void;
  addPizza: (pizza: Pizza) => void;
  updatePizza: (id: string, pizza: Pizza) => void;
  deletePizza: (id: string) => void;
  addPriorityRequest: (request: PriorityRequest) => void;
  markPriorityAsHandled: (id: string) => void;
  clearHandledPriorities: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  toggleDarkMode: () => void;
};

// Valor inicial do contexto
const initialContext: PizzaContextType = {
  pizzas: [],
  priorityRequests: [],
  filterType: 'all',
  searchQuery: '',
  isAdmin: false,
  darkMode: false,
  setFilterType: () => {},
  setSearchQuery: () => {},
  addPizza: () => {},
  updatePizza: () => {},
  deletePizza: () => {},
  addPriorityRequest: () => {},
  markPriorityAsHandled: () => {},
  clearHandledPriorities: () => {},
  loginAdmin: () => false,
  logoutAdmin: () => {},
  toggleDarkMode: () => {},
};

// Criar contexto
const PizzaContext = createContext<PizzaContextType>(initialContext);

// Dados de exemplo para pizzas
const initialPizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=600',
    type: 'salgada',
    size: 'grande',
    description: 'Molho de tomate, mussarela, manjericão fresco e azeite.',
    active: true,
  },
  {
    id: '2',
    name: 'Pepperoni',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600',
    type: 'salgada',
    size: 'grande',
    description: 'Molho de tomate, mussarela e pepperoni.',
    active: true,
  },
  {
    id: '3',
    name: 'Quatro Queijos',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600',
    type: 'salgada',
    size: 'média',
    description: 'Molho de tomate, mussarela, gorgonzola, provolone e parmesão.',
    active: true,
  },
  {
    id: '4',
    name: 'Chocolate com Morango',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600',
    type: 'doce',
    size: 'média',
    description: 'Base de chocolate com pedaços de morango.',
    active: true,
  },
  {
    id: '5',
    name: 'Banana com Canela',
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600',
    type: 'doce',
    size: 'broto',
    description: 'Banana, canela, açúcar e leite condensado.',
    active: true,
  },
  {
    id: '6',
    name: 'Calabresa',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?q=80&w=600',
    type: 'salgada',
    size: 'grande',
    description: 'Molho de tomate, mussarela, calabresa e cebola.',
    active: true,
  },
];

// Provider do contexto
export const PizzaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pizzas, setPizzas] = useState<Pizza[]>(() => {
    const storedPizzas = localStorage.getItem('pizzas');
    return storedPizzas ? JSON.parse(storedPizzas) : initialPizzas;
  });
  
  const [priorityRequests, setPriorityRequests] = useState<PriorityRequest[]>(() => {
    const storedRequests = localStorage.getItem('priorityRequests');
    return storedRequests ? JSON.parse(storedRequests) : [];
  });
  
  const [filterType, setFilterType] = useState<'all' | 'salgada' | 'doce'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Atualizar localStorage quando os estados mudarem
  useEffect(() => {
    localStorage.setItem('pizzas', JSON.stringify(pizzas));
  }, [pizzas]);

  useEffect(() => {
    localStorage.setItem('priorityRequests', JSON.stringify(priorityRequests));
  }, [priorityRequests]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Funções para manipular pizzas
  const addPizza = (pizza: Pizza) => {
    const newPizza = {
      ...pizza,
      id: Date.now().toString(),
      active: true,
    };
    setPizzas([...pizzas, newPizza]);
    toast({
      title: "Sucesso!",
      description: `Pizza ${newPizza.name} adicionada com sucesso.`,
    });
  };

  const updatePizza = (id: string, updatedPizza: Pizza) => {
    setPizzas(pizzas.map(pizza => pizza.id === id ? { ...updatedPizza, id } : pizza));
    toast({
      title: "Sucesso!",
      description: `Pizza ${updatedPizza.name} atualizada com sucesso.`,
    });
  };

  const deletePizza = (id: string) => {
    const pizzaToDelete = pizzas.find(p => p.id === id);
    setPizzas(pizzas.filter(pizza => pizza.id !== id));
    
    if (pizzaToDelete) {
      toast({
        title: "Sucesso!",
        description: `Pizza ${pizzaToDelete.name} removida com sucesso.`,
      });
    }
  };

  // Funções para manipular pedidos de prioridade
  const addPriorityRequest = (request: PriorityRequest) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      handled: false,
    };
    setPriorityRequests([...priorityRequests, newRequest]);
    
    const pizza = pizzas.find(p => p.id === request.pizzaId);
    if (pizza) {
      toast({
        title: "Prioridade solicitada!",
        description: `Sua solicitação para ${pizza.name} foi registrada.`,
      });
    }
    
    // Tocar um som de alerta para o administrador
    if (isAdmin) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Erro ao tocar som:', err));
    }
  };

  const markPriorityAsHandled = (id: string) => {
    setPriorityRequests(
      priorityRequests.map(request => 
        request.id === id ? { ...request, handled: true } : request
      )
    );
  };

  const clearHandledPriorities = () => {
    setPriorityRequests(priorityRequests.filter(request => !request.handled));
  };

  // Funções de autenticação
  const loginAdmin = (password: string): boolean => {
    if (password === 'carlos') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Função para alternar modo escuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <PizzaContext.Provider 
      value={{
        pizzas,
        priorityRequests,
        filterType,
        searchQuery,
        isAdmin,
        darkMode,
        setFilterType,
        setSearchQuery,
        addPizza,
        updatePizza,
        deletePizza,
        addPriorityRequest,
        markPriorityAsHandled,
        clearHandledPriorities,
        loginAdmin,
        logoutAdmin,
        toggleDarkMode,
      }}
    >
      {children}
    </PizzaContext.Provider>
  );
};

// Hook para usar o contexto
export const usePizzaContext = () => useContext(PizzaContext);
