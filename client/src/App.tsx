import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import GoogleAdsPolicy from "./pages/GoogleAdsPolicy";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import WriteBlog from "./pages/WriteBlog";
import About from "./pages/About";
import LatestNews from "./pages/LatestNews";
import CustomerAgreement from "./pages/CustomerAgreement";
import Portfolio from "./pages/Portfolio";
import Certificates from "./pages/Certificates";
import ContactForm from "./pages/ContactForm";
import ClientReviews from "./pages/ClientReviews";
import AdminPanel from "./pages/AdminPanel";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-conditions"} component={TermsConditions} />
      <Route path={"/google-ads-policy"} component={GoogleAdsPolicy} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/write" component={WriteBlog} />
      <Route path={"/write-blog"} component={WriteBlog} />
      <Route path={"/latest-news"} component={LatestNews} />
      <Route path={"/customer-agreement"} component={CustomerAgreement} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/certificates"} component={Certificates} />
      <Route path={"/contact-form"} component={ContactForm} />
      <Route path={"/client-reviews"} component={ClientReviews} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/analytics"} component={AnalyticsDashboard} />
      <Route path={"/products"} component={Products} />
      <Route path={"/product/:id"} component={ProductDetail} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
