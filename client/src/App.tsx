import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import Home2 from "@/pages/Home2";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import TerminosCondiciones from "@/pages/TerminosCondiciones";
import PoliticaPrivacidad from "@/pages/PoliticaPrivacidad";
import Membresia from "@/pages/Membresia";
import Launch from "@/pages/Launch";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LaunchForm from "@/pages/LaunchForm";
import LaunchPayment from "@/pages/LaunchPayment";
import AdminLogin from "@/pages/AdminLogin";
import AdminLaunch from "@/pages/AdminLaunch";
import AdminRequestDetail from "@/pages/AdminRequestDetail";
import AdminUsers from "@/pages/AdminUsers";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Benefits from "@/pages/Benefits";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home-2" component={Home2} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/terminos-y-condiciones" component={TerminosCondiciones} />
      <Route path="/politica-privacidad-datos-lo-simple" component={PoliticaPrivacidad} />
      <Route path="/saslegal-plus" component={Membresia} />
      <Route path="/launch" component={Launch} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/launch-form" component={LaunchForm} />
      <Route path="/launch-payment" component={LaunchPayment} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/adminlaunch/:id" component={AdminRequestDetail} />
      <Route path="/adminlaunch" component={AdminLaunch} />
      <Route path="/admin-users" component={AdminUsers} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/beneficios" component={Benefits} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Header />
          <Toaster />
          <Router />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
