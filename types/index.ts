export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    isBestSeller?: boolean;
    isComingSoon?: boolean;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    gallery: string[];
    category: string;
    completedDate: string;
    client: string;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface ContactForm {
    name: string;
    email: string;
    phone: string;
    message: string;
  }
  
  export interface EnquiryForm {
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
    items: CartItem[];
  }