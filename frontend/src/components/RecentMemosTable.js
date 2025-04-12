// components/RecentMemosTable.jsx
const RecentMemosTable = ({ memos }) => (
    <div className="overflow-x-auto bg-white shadow-md rounded-2xl p-5 mt-6">
      <h2 className="text-lg font-semibold mb-4">Recent Memos</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Memo ID</th>
            <th className="p-2">Submitted By</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {memos.map((memo, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{memo.id}</td>
              <td className="p-2">{memo.submittedBy}</td>
              <td className="p-2">{memo.status}</td>
              <td className="p-2">{new Date(memo.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  export default RecentMemosTable;
  