// components/KPICard.jsx
const KPICard = ({ title, value, icon }) => (
  <div className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between">
    <div>
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="text-blue-500 text-3xl">
      {icon}
    </div>
  </div>
);

export default KPICard;
