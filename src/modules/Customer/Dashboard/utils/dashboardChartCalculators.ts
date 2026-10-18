export function calculateSpendChartData(
  spendFilter: "30_days" | "3_months" | "this_year",
  invoices: any[],
  totalSpending: number
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();

  if (spendFilter === "30_days") {
    const daysCount = 10;
    const points: { name: string; spend: number }[] = [];
    let cumulative = 0;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i * 3);
      const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
      const daySpend = invoices.filter((inv) => {
        const invDate = new Date(inv.created_at || inv.issue_date || inv.date);
        return Math.abs(invDate.getTime() - d.getTime()) <= 3 * 24 * 60 * 60 * 1000;
      }).reduce((sum, curr) => sum + (Number(curr.amount) || Number(curr.total) || 0), 0);
      cumulative += daySpend;
      const fallback = totalSpending > 0 ? Math.round((totalSpending / daysCount) * (daysCount - i)) : 0;
      points.push({ name, spend: cumulative > 0 ? cumulative : fallback });
    }
    return points;
  } else if (spendFilter === "3_months") {
    const weeksCount = 8;
    const points: { name: string; spend: number }[] = [];
    for (let i = weeksCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i * 11);
      const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
      const spendVal = totalSpending > 0 ? Math.round((totalSpending / weeksCount) * (weeksCount - i)) : 0;
      points.push({ name, spend: spendVal });
    }
    return points;
  }

  const curMonth = now.getMonth();
  const points: { name: string; spend: number }[] = [];
  for (let i = 0; i <= curMonth; i++) {
    const spendVal = totalSpending > 0 ? Math.round((totalSpending / (curMonth + 1)) * (i + 1)) : 0;
    points.push({ name: months[i], spend: spendVal });
  }
  return points.length > 0 ? points : [{ name: months[curMonth], spend: totalSpending }];
}

export function calculateOrderQuoteChartData(
  quoteRequests: any[],
  orders: any[],
  totalQuotesReceived: number
) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const intervals = 6;
  const points: { name: string; requests: number; quotes: number; booked: number }[] = [];
  const totalReq = quoteRequests.length || 0;
  const totalOrd = orders.length || 0;
  const totalQuotes = totalQuotesReceived;

  for (let i = intervals - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i * 5);
    const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
    const reqPortion = totalReq > 0 ? Math.max(1, Math.round((totalReq / intervals) * (intervals - i))) : 0;
    const quotePortion = totalQuotes > 0 ? Math.max(0, Math.round((totalQuotes / intervals) * (intervals - i))) : (totalReq > 0 ? Math.round(reqPortion * 0.5) : 0);
    const ordPortion = totalOrd > 0 ? Math.max(0, Math.round((totalOrd / intervals) * (intervals - i))) : 0;
    points.push({ name, requests: reqPortion, quotes: quotePortion, booked: ordPortion });
  }
  return points;
}
