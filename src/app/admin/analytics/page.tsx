import { AnalyticsDashboard } from './AnalyticsDashboard';
import '../admin.css';

export default function AnalyticsPage() {
    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Analytics & Insights</h1>
                <p className="admin-subtitle">
                    Track your store performance and sales trends
                </p>
            </div>

            <AnalyticsDashboard />
        </div>
    );
}
