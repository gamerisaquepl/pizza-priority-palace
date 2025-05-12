
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePizzaContext } from '@/contexts/PizzaContext';
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key } from 'lucide-react';

const formSchema = z.object({
  password: z.string().min(1, { message: "A senha é obrigatória" }),
});

type FormData = z.infer<typeof formSchema>;

const AdminLogin: React.FC = () => {
  const { loginAdmin } = usePizzaContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
    },
  });
  
  function onSubmit(data: FormData) {
    const success = loginAdmin(data.password);
    
    if (success) {
      navigate('/admin');
    } else {
      setError('Senha incorreta. Por favor, tente novamente.');
      form.reset();
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Área Restrita</h1>
          <p className="text-muted-foreground">Acesse o painel de administração</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Digite a senha" 
                          className="pl-10" 
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Acessar
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Dica: A senha é "carlos"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
