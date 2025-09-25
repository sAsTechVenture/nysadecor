export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: ProductCategory;
    description: string;
    isBestSeller: boolean;
    isComingSoon: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    gallery: string[];
    category: ProjectCategory;
    completedDate: string;
    client: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CartItem {
    id: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    productId: string;
    sessionId: string;
    product: Product;
  }
  
  export interface ContactForm {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
  }
  
  export interface EnquiryForm {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
    createdAt: string;
    items: EnquiryItem[];
  }

  export interface EnquiryItem {
    id: string;
    quantity: number;
    createdAt: string;
    enquiryFormId: string;
    productId: string;
    enquiryForm: EnquiryForm;
    product: Product;
  }

  export enum ProductCategory {
    VERTICAL_BLINDS = 'VERTICAL_BLINDS',
    HORIZONTAL_BLINDS = 'HORIZONTAL_BLINDS',
    ROLLER_BLINDS = 'ROLLER_BLINDS',
    VENETIAN_BLINDS = 'VENETIAN_BLINDS',
    ROMAN_BLINDS = 'ROMAN_BLINDS',
    PLEATED_BLINDS = 'PLEATED_BLINDS',
    HONEYCOMB_BLINDS = 'HONEYCOMB_BLINDS',
    MOTORIZED_BLINDS = 'MOTORIZED_BLINDS',
    OUTDOOR_BLINDS = 'OUTDOOR_BLINDS',
    CUSTOM_BLINDS = 'CUSTOM_BLINDS',
  }

  export enum ProjectCategory {
    RESIDENTIAL = 'RESIDENTIAL',
    COMMERCIAL = 'COMMERCIAL',
    OFFICE = 'OFFICE',
    HOTEL = 'HOTEL',
    RESTAURANT = 'RESTAURANT',
    RETAIL = 'RETAIL',
    HEALTHCARE = 'HEALTHCARE',
    EDUCATION = 'EDUCATION',
    OTHER = 'OTHER',
  }

  // Legacy type for backward compatibility
  export interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    channel: 'EMAIL' | 'WHATSAPP';
    createdAt: string;
  }