# Overview

This is a digital services marketplace application built as a full-stack TypeScript project. The application allows users to browse and purchase digital services, specifically focusing on electronic invoicing and digital signatures. It features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration using Drizzle ORM.

The system operates as a B2C marketplace where customers can browse services, add them to a cart, and complete purchases through a streamlined checkout process. The application is designed for Spanish-speaking markets, with all UI text and business logic tailored for electronic invoicing and digital signature services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite build system
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React Context for cart functionality and TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging
- **Validation**: Zod schemas for request/response validation
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations

## Data Layer
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Type Safety**: Full TypeScript integration with shared schema types

## Key Design Patterns
- **Separation of Concerns**: Clear separation between client, server, and shared code
- **Type Safety**: End-to-end TypeScript with shared types between frontend and backend
- **Component Composition**: Modular UI components with consistent design system
- **Error Boundaries**: Structured error handling with user-friendly messages
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Service Layer
- **Services Schema**: Supports categorized digital services with pricing, features, and availability
- **Orders Schema**: Customer information, service selections, pricing, and payment tracking
- **Cart Management**: Client-side cart state with server-side price validation
- **Checkout Flow**: Multi-step process with form validation and order creation

## Company Closing Flow (Empezar Cierre)
- **Trigger**: Dashboard button changes from "Cerrar Empresa" to "Empezar Cierre" once a Multas Report is paid and downloaded
- **Verification Step**: Simulated verification of the multas report before proceeding
- **Declaración Juramentada**: 
  - Legal popup explaining liability and consequences
  - Dynamic shareholder form (add/remove shareholders with names and IDs)
  - Auto-generated declaration document for download and electronic signature
- **Document Upload**: Zone for uploading the electronically signed declaration
- **Premium Service**: Share transfer (cesión de acciones) and legal representative change to facilitate company closure

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form, TanStack Query
- **Backend Framework**: Express.js with TypeScript support
- **Build Tools**: Vite, TypeScript, ESBuild for production builds

## Database and ORM
- **Database**: PostgreSQL (configured for Neon Database)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Connection**: @neondatabase/serverless for serverless PostgreSQL connections

## UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx and tailwind-merge for conditional styling

## Validation and Type Safety
- **Schema Validation**: Zod for runtime type checking and validation
- **Form Validation**: @hookform/resolvers for React Hook Form integration
- **Type Generation**: Drizzle Zod integration for database schema types

## Payment Processing
- **Stripe Integration**: @stripe/stripe-js and @stripe/react-stripe-js for payment processing
- **Payment Flow**: Configured for handling payment intents and checkout processes

## Development Tools
- **Development Server**: Vite dev server with HMR and error overlay
- **Code Quality**: TypeScript strict mode, ESLint configuration
- **Replit Integration**: Custom plugins for Replit development environment
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage