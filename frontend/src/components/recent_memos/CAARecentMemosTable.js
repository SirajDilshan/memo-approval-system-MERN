import { useState } from 'react';

const CAARecentMemosTable = ({ memos }) => {
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  const filteredMemos = showOnlyPending
    ? memos.filter((memo) => memo.status.toLowerCase() === 'pending')
    : memos;

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-2xl p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Memos</h2>
        <button
          onClick={() => setShowOnlyPending(!showOnlyPending)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200"
        >
          {showOnlyPending ? 'Show All' : 'Show Only Pending'}
        </button>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Memo Title</th>
            <th className="p-2">Submitted By</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredMemos.map((memo, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2">{memo.title}</td>
              <td className="p-2">
                {memo.createdBy?.email} ({memo.createdBy?.role})
              </td>
              <td className="p-2">{memo.status}</td>
              <td className="p-2">
                {new Date(memo.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CAARecentMemosTable;
