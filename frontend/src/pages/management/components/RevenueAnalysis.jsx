import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, selectOrders, selectOrdersLoading } from "../../../store/slices/ordersSlice";
import { fetchProducts, selectProducts } from "../../../store/slices/productsSlice";
import { ORDER_STATUSES } from "../../../constants";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueAnalysis = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectOrdersLoading);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Calculate revenue, profit, and loss
  const analytics = useMemo(() => {
    // Filter orders by date range and completed statuses
    const filteredOrders = orders.filter((order) => {
      if (order.status === ORDER_STATUSES.CANCELLED) return false;

      const orderDate = new Date(order.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    let totalRevenue = 0;
    let totalProductRevenue = 0; // Revenue from products only (no tax/shipping)
    let totalCost = 0;

    filteredOrders.forEach((order) => {
      totalRevenue += order.total_amount || 0;

      // Calculate product revenue and cost
      order.items.forEach((item) => {
        const itemRevenue = item.product_price * item.quantity;
        totalProductRevenue += itemRevenue;

        const costPrice = item.product_price * 0.5; // Default to 50% if not specified
        totalCost += costPrice * item.quantity;
      });
    });

    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalProductRevenue > 0 ? ((totalProductRevenue - totalCost) / totalProductRevenue) * 100 : 0;

    return {
      totalOrders: filteredOrders.length,
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      filteredOrders,
    };
  }, [orders, products, startDate, endDate]);

  // Prepare chart data - group by month
  const chartData = useMemo(() => {
    if (!analytics.filteredOrders || analytics.filteredOrders.length === 0) return [];

    // Group orders by month
    const monthlyData = {};

    analytics.filteredOrders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = date.toLocaleDateString("en-US", { year: "numeric", month: "short" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthLabel,
          revenue: 0,
          cost: 0,
          profit: 0,
          orders: 0,
        };
      }

      let orderRevenue = order.total_amount || 0;
      let orderCost = 0;

      order.items.forEach((item) => {
        const costPrice = item.product_price * 0.5;
        orderCost += costPrice * item.quantity;
      });

      monthlyData[monthKey].revenue += orderRevenue;
      monthlyData[monthKey].cost += orderCost;
      monthlyData[monthKey].profit += orderRevenue - orderCost;
      monthlyData[monthKey].orders += 1;
    });

    // Convert to array and sort by month
    return Object.keys(monthlyData)
      .sort()
      .map((key) => ({
        month: monthlyData[key].month,
        Revenue: parseFloat(monthlyData[key].revenue.toFixed(2)),
        Cost: parseFloat(monthlyData[key].cost.toFixed(2)),
        Profit: parseFloat(monthlyData[key].profit.toFixed(2)),
        Orders: monthlyData[key].orders,
      }));
  }, [analytics.filteredOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue & Profit Analysis</h2>
        <p className="text-gray-600">
          Calculate revenue, profit, and loss between dates
        </p>
      </div>

      {/* Date Range Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-sand to-sage rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-warning to-error rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${analytics.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">Total Cost</p>
                </div>
              </div>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-linear-to-br ${analytics.totalProfit >= 0 ? "from-success-light to-success" : "from-error to-error"} rounded-2xl flex items-center justify-center`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${analytics.totalProfit >= 0 ? "text-success" : "text-error"}`}>
                    ${Math.abs(analytics.totalProfit).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {analytics.totalProfit >= 0 ? "Profit" : "Loss"}
                  </p>
                </div>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-sage to-linen rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path color="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.profitMargin.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">Profit Margin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Details */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Total Orders</span>
                  <span className="text-xl font-bold text-gray-900">{analytics.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Average Order Value</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Average Cost per Order</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${analytics.totalOrders > 0 ? (analytics.totalCost / analytics.totalOrders).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50">
                  <span className="text-gray-600 font-medium">Average Profit per Order</span>
                  <span className={`text-xl font-bold ${analytics.totalProfit >= 0 ? "text-success" : "text-error"}`}>
                    ${analytics.totalOrders > 0 ? (analytics.totalProfit / analytics.totalOrders).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend Chart */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue, Cost & Profit Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #FFB6D9",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="Revenue"
                    stroke="#FFB6D9"
                    strokeWidth={3}
                    dot={{ fill: "#FFB6D9", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Cost"
                    stroke="#FF0090"
                    strokeWidth={3}
                    dot={{ fill: "#FF0090", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Profit"
                    stroke="#16A34A"
                    strokeWidth={3}
                    dot={{ fill: "#16A34A", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bar Chart for Monthly Comparison */}
          {chartData.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "2px solid #FFB6D9",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                  <Bar dataKey="Revenue" fill="#FFB6D9" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Cost" fill="#FF0090" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Profit" fill="#16A34A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RevenueAnalysis;
