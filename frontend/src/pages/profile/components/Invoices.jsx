const Invoices = ({ invoices, onDownloadInvoice }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoices & Billing</h2>
        <p className="text-sm text-gray-500">
          {invoices.length} total invoices
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-sand/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Date Issued
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{invoice.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{invoice.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">
                      ${invoice.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success text-white">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDownloadInvoice(invoice.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand text-white font-semibold hover:bg-sage hover:shadow-lg transition-all duration-300 active:scale-95"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
