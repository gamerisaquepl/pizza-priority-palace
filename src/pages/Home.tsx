
import React, { useState, useEffect } from 'react';
import { usePizzaContext } from '@/contexts/PizzaContext';
import PizzaCard from '@/components/PizzaCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pizza } from '@/types/types';
import { Search, Filter } from 'lucide-react';

const Home: React.FC = () => {
  const { pizzas, filterType, searchQuery, setFilterType, setSearchQuery } = usePizzaContext();
  const [filteredPizzas, setFilteredPizzas] = useState<Pizza[]>([]);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  
  // Filtrar pizzas com base no tipo e na pesquisa
  useEffect(() => {
    let filtered = [...pizzas].filter(pizza => pizza.active);
    
    if (filterType !== 'all') {
      filtered = filtered.filter(pizza => pizza.type === filterType);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        pizza => 
          pizza.name.toLowerCase().includes(query) || 
          pizza.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredPizzas(filtered);
  }, [pizzas, filterType, searchQuery]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 md:px-6 relative bg-pizza-light">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1200')" }}
        ></div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              O Melhor Rodízio de <span className="text-primary">Pizzas</span> da Cidade
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Escolha seus sabores favoritos e solicite prioridade para recebê-los na sua mesa mais rapidamente!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="px-8" onClick={() => window.scrollTo({
                top: document.getElementById('cardapio')?.offsetTop || 0,
                behavior: 'smooth',
              })}>
                Ver Cardápio
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Como Funciona
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section id="cardapio" className="py-16 px-4 md:px-6">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Escolha seus sabores favoritos!
            </h2>
            <p className="text-lg text-muted-foreground">
              Solicite prioridade para os sabores que você mais deseja experimentar
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                Todos
              </Button>
              <Button 
                size="sm" 
                variant={filterType === 'salgada' ? 'default' : 'outline'}
                onClick={() => setFilterType('salgada')}
              >
                Salgadas
              </Button>
              <Button 
                size="sm" 
                variant={filterType === 'doce' ? 'default' : 'outline'}
                onClick={() => setFilterType('doce')}
              >
                Doces
              </Button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex w-full sm:max-w-sm gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="text" 
                  placeholder="Buscar pizza..." 
                  value={localSearch} 
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">Buscar</Button>
            </form>
          </div>
          
          {filteredPizzas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPizzas.map(pizza => (
                <PizzaCard key={pizza.id} pizza={pizza} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Nenhuma pizza encontrada. Tente outro filtro ou busca.</p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 px-4 md:px-6 bg-muted">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Como funciona o rodízio
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Entenda como tirar o máximo proveito da sua experiência
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <span className="font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Escolha seus favoritos</h3>
              <p className="text-muted-foreground">Navegue pelo cardápio e escolha os sabores que mais te agradam.</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <span className="font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Solicite prioridade</h3>
              <p className="text-muted-foreground">Clique em "Solicitar Prioridade" para os sabores que você quer receber primeiro.</p>
            </div>
            
            <div className="bg-background p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                <span className="font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Aproveite!</h3>
              <p className="text-muted-foreground">Relaxe e aprecie a experiência. Seus sabores favoritos chegarão rapidamente.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
