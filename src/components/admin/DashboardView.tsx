
interface DashboardViewProps {
  userCount: number;
  systemLoad: number;
  errorRate: number;
}

const DashboardView = ({
  userCount,
  systemLoad,
  errorRate
}: DashboardViewProps) => {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <div>
        <p>Total Users: {userCount}</p>
        <p>System Load: {systemLoad}%</p>
        <p>Error Rate: {errorRate}%</p>
      </div>
    </div>
  );
};

export default DashboardView;
