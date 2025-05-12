
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePizzaContext } from '@/contexts/PizzaContext';
import { PriorityFormData } from '@/types/types';

const formSchema = z.object({
  tableNumber: z.coerce.number().positive('Número de mesa inválido').int('Deve ser um número inteiro'),
  peopleCount: z.coerce.number().positive('Número de pessoas inválido').int('Deve ser um número inteiro'),
  observations: z.string().optional(),
});

interface PriorityFormProps {
  pizzaId: string;
  onSuccess?: () => void;
}

const PriorityForm: React.FC<PriorityFormProps> = ({ pizzaId, onSuccess }) => {
  const { addPriorityRequest, pizzas } = usePizzaContext();
  const pizza = pizzas.find((p) => p.id === pizzaId);
  
  const form = useForm<PriorityFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableNumber: 1,
      peopleCount: 1,
      observations: '',
    },
  });
  
  function onSubmit(data: PriorityFormData) {
    addPriorityRequest({
      ...data,
      pizzaId,
      id: '',
      timestamp: '',
      handled: false,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tableNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Mesa</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Número da mesa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="peopleCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade de Pessoas</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Quantidade de pessoas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Retirar cebola, mais queijo, etc."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Confirmar Solicitação
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PriorityForm;
