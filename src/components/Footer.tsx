
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-display font-bold text-primary">Pizzaria da Vila</h3>
          <p className="text-muted-foreground mt-2">O melhor rodízio de pizzas da cidade</p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>Rua das Pizzas, 123 - Centro</p>
          <p>contato@pizzariadavila.com</p>
          <p>Tel: (11) 5555-5555</p>
        </div>
        
        <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pizzaria da Vila</p>
          <p>Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
