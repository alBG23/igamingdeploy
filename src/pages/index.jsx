import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import Dashboard from "./Dashboard";
import PnLDashboard from "./PnLDashboard";
import Acquisition from "./Acquisition";
import Payments from "./Payments";
import PlayerAnalysis from "./PlayerAnalysis";
import CohortAnalysis from "./CohortAnalysis";
import PlayerValueMatrix from "./PlayerValueMatrix";
import AIInsights from "./AIInsights";
import Benchmarking from "./Benchmarking";
import AlertsManagement from "./AlertsManagement";
import CustomReports from "./CustomReports";
import PlatformHealth from "./PlatformHealth";
import DataValidation from "./DataValidation";
import SchemaDiscovery from "./SchemaDiscovery";
import DataImport from "./DataImport";
import MiddlewareAPIGuide from "./MiddlewareAPIGuide";
import AzureIntegrationGuide from "./AzureIntegrationGuide";
import EnvironmentVariablesGuide from "./EnvironmentVariablesGuide";
import Integrations from "./Integrations";
import ProductionSetupGuide from "./ProductionSetupGuide";

export default function IndexPage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pnl-dashboard" element={<PnLDashboard />} />
          <Route path="/acquisition" element={<Acquisition />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/player-analysis" element={<PlayerAnalysis />} />
          <Route path="/cohort-analysis" element={<CohortAnalysis />} />
          <Route path="/player-value-matrix" element={<PlayerValueMatrix />} />
          <Route path="/ai-insights" element={<AIInsights />} />
          <Route path="/benchmarking" element={<Benchmarking />} />
          <Route path="/alerts-management" element={<AlertsManagement />} />
          <Route path="/custom-reports" element={<CustomReports />} />
          <Route path="/platform-health" element={<PlatformHealth />} />
          <Route path="/data-validation" element={<DataValidation />} />
          <Route path="/schema-discovery" element={<SchemaDiscovery />} />
          <Route path="/data-import" element={<DataImport />} />
          <Route path="/middleware-api-guide" element={<MiddlewareAPIGuide />} />
          <Route path="/azure-integration-guide" element={<AzureIntegrationGuide />} />
          <Route path="/environment-variables-guide" element={<EnvironmentVariablesGuide />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/production-setup-guide" element={<ProductionSetupGuide />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}