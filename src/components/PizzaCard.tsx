
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePizzaContext } from '@/contexts/PizzaContext';
import { Pizza } from '@/types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PriorityForm from './PriorityForm';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza }) => {
  const { isAdmin } = usePizzaContext();
  const [open, setOpen] = React.useState(false);
  
  return (
    <Card className="pizza-card overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={pizza.image} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            pizza.type === 'doce' ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'
          }`}
        >
          {pizza.type === 'doce' ? 'Doce' : 'Salgada'}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-xl font-display font-semibold">{pizza.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Badge variant="outline">{pizza.size}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pizza.description}</p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        {!isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full pizza-priority-btn" 
                variant={pizza.type === 'doce' ? 'secondary' : 'default'}
              >
                Solicitar Prioridade
              </Button>
            </DialogTrigger>
            <DialogContent className="animate-scale-in">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">Solicitar {pizza.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <PriorityForm 
                  pizzaId={pizza.id}
                  onSuccess={() => setOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default PizzaCard;
