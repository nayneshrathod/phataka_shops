export type UserRole = "super_admin" | "admin" | "staff" | "customer";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  slug: string;
  image: string;
  description: {
    mr: string;
    hi: string;
    en: string;
  };
  sortOrder: number;
  active: boolean;
}

export type ComplianceStatus = "green_cracker" | "peso_approved" | "standard_licensed";

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: {
    mr: string;
    hi: string;
    en: string;
  };
  description: {
    mr: string;
    hi: string;
    en: string;
  };
  categoryId: string;
  categoryName?: string;
  images: string[];
  retailPrice: number;
  costPrice?: number; // Restricted to staff/admin
  stockQuantity: number;
  lowStockThreshold: number;
  manufacturer: string;
  safetyInformation: {
    mr: string;
    hi: string;
    en: string;
  };
  soundLevel?: "Low" | "Medium" | "High" | "Soundless (Light only)";
  visualEffect?: string;
  piecesPerBox?: number;
  complianceStatus: ComplianceStatus;
  greenCrackerCode?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = "STOCK_IN" | "STOCK_OUT" | "DAMAGE" | "ADJUSTMENT" | "RETURN";

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  movementType: MovementType;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: string; // User email or Name
  createdAt: string;
}

export type InquiryStatus = "new" | "contacted" | "in_review" | "closed" | "cancelled";

export interface InquiryItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  estimatedPrice: number;
}

export interface Inquiry {
  id: string;
  inquiryNumber: string; // e.g. INQ-2026-1042
  customerName: string;
  phone: string;
  email: string;
  items: InquiryItem[];
  totalEstimatedAmount: number;
  message?: string;
  status: InquiryStatus;
  source: "website_catalog" | "direct_inquiry" | "whatsapp_lead" | "walk_in";
  consent: boolean;
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: {
    mr: string;
    hi: string;
    en: string;
  };
  subtitle?: {
    mr: string;
    hi: string;
    en: string;
  };
  imageUrl: string;
  targetUrl?: string;
  buttonText?: {
    mr: string;
    hi: string;
    en: string;
  };
  startDate: string;
  endDate: string;
  active: boolean;
  sortOrder: number;
}

export interface StoreSettings {
  businessName: string;
  businessNameMarathi: string;
  taglineMarathi: string;
  taglineEnglish: string;
  logo: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  workingHours: string;
  licenseNumber: string;
  gstin: string;
  currency: string;
  defaultLanguage: "mr" | "hi" | "en";
  statutoryNoticeMarathi: string;
  statutoryNoticeEnglish: string;
  googleMapsUrl?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: "product" | "inventory" | "inquiry" | "category" | "settings" | "auth";
  entityId: string;
  details: string;
  userId: string;
  userEmail: string;
  timestamp: string;
}

export * from './cart.model';
export * from './discount.model';
export * from './invoice.model';

