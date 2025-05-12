
export type PizzaType = 'salgada' | 'doce';
export type PizzaSize = 'broto' | 'média' | 'grande';

export interface Pizza {
  id: string;
  name: string;
  image: string;
  type: PizzaType;
  size: PizzaSize;
  description: string;
  active: boolean;
}

export interface PriorityRequest {
  id: string;
  pizzaId: string;
  tableNumber: number;
  peopleCount: number;
  observations?: string;
  timestamp: string;
  handled: boolean;
}

export interface PizzaFormData {
  name: string;
  image: string;
  type: PizzaType;
  size: PizzaSize;
  description: string;
}

export interface PriorityFormData {
  tableNumber: number;
  peopleCount: number;
  observations?: string;
}
