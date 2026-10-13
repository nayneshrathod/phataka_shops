import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '@layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from '@layouts/admin-layout/admin-layout.component';
import { adminAuthGuard, adminOnlyGuard, superAdminGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Public Customer Portal Routes
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('@features/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'products/:slug',
        loadComponent: () => import('@features/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('@features/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'offers',
        loadComponent: () => import('@features/offers/offers.component').then(m => m.OffersComponent)
      },
      {
        path: 'inquiry',
        loadComponent: () => import('@features/inquiry/inquiry.component').then(m => m.InquiryComponent)
      },
      {
        path: 'inquiry-cart',
        loadComponent: () => import('@features/inquiry-cart/inquiry-cart.component').then(m => m.InquiryCartComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('@features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('@features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'cart',
        redirectTo: 'inquiry-cart',
        pathMatch: 'full'
      },
      {
        path: 'safety',
        loadComponent: () => import('@features/safety/safety.component').then(m => m.SafetyComponent)
      }
    ]
  },

  // Dedicated Login Portal (Standalone clean URL)
  {
    path: 'login',
    loadComponent: () => import('@features/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin/login',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Protected Admin Portal Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('@features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'billing',
        loadComponent: () => import('@features/admin/billing/pos/pos.component').then(m => m.PosComponent)
      },
      {
        path: 'billing/history',
        loadComponent: () => import('@features/admin/billing/history/billing-history.component').then(m => m.BillingHistoryComponent)
      },
      {
        path: 'billing/returns',
        loadComponent: () => import('@features/admin/billing/returns/billing-returns.component').then(m => m.BillingReturnsComponent)
      },
      {
        path: 'offers',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/offers/offers-admin.component').then(m => m.OffersAdminComponent)
      },
      {
        path: 'settings/billing',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/billing/settings/billing-settings.component').then(m => m.BillingSettingsComponent)
      },
      {
        path: 'products',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/products/products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'inventory',
        loadComponent: () => import('@features/admin/inventory/inventory.component').then(m => m.AdminInventoryComponent)
      },
      {
        path: 'inquiries',
        loadComponent: () => import('@features/admin/inquiries/inquiries.component').then(m => m.AdminInquiriesComponent)
      },
      {
        path: 'categories',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/categories/categories.component').then(m => m.AdminCategoriesComponent)
      },
      {
        path: 'customers',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/customers/customers.component').then(m => m.AdminCustomersComponent)
      },
      {
        path: 'banners',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/banners/banners.component').then(m => m.AdminBannersComponent)
      },
      {
        path: 'reports',
        canActivate: [adminOnlyGuard],
        loadComponent: () => import('@features/admin/reports/reports.component').then(m => m.AdminReportsComponent)
      },
      {
        path: 'users',
        canActivate: [superAdminGuard],
        loadComponent: () => import('@features/admin/users/users.component').then(m => m.AdminUsersComponent)
      },
      {
        path: 'settings',
        canActivate: [superAdminGuard],
        loadComponent: () => import('@features/admin/settings/settings.component').then(m => m.AdminSettingsComponent)
      }
    ]
  },

  // Wildcard Fallback
  {
    path: '**',
    redirectTo: ''
  }
];
