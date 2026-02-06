
import React, { useState, useEffect } from 'react';
import { Stock, PortfolioItem } from '../types';

const INITIAL_STOCKS: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 1.2 },
  { symbol: 'TSLA', name: 'Tesla Motors', price: 680.50, change: -2.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2750.10, change: 0.8 },
  { symbol: 'AMZN', name: 'Amazon.com', price: 3300.45, change: -1.4 },
];

export const StockPlatform: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [balance, setBalance] = useState(10000);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [transactionAmount, setTransactionAmount] = useState<Record<string, number>>({});

  // Simulate market fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => ({
        ...s,
        price: Number((s.price + (Math.random() - 0.5) * 5).toFixed(2)),
        change: Number(((Math.random() - 0.5) * 4).toFixed(2))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (stock: Stock) => {
    const qty = transactionAmount[stock.symbol] || 0;
    const cost = qty * stock.price;
    if (qty <= 0 || balance < cost) return;

    setBalance(prev => prev - cost);
    setPortfolio(prev => {
      const existing = prev.find(p => p.symbol === stock.symbol);
      if (existing) {
        const totalShares = existing.shares + qty;
        const totalCost = (existing.shares * existing.avgPrice) + (qty * stock.price);
        return prev.map(p => p.symbol === stock.symbol 
          ? { ...p, shares: totalShares, avgPrice: totalCost / totalShares }
          : p
        );
      }
      return [...prev, { symbol: stock.symbol, shares: qty, avgPrice: stock.price }];
    });
    setTransactionAmount({ ...transactionAmount, [stock.symbol]: 0 });
  };

  const handleSell = (stock: Stock) => {
    const qty = transactionAmount[stock.symbol] || 0;
    const existing = portfolio.find(p => p.symbol === stock.symbol);
    if (qty <= 0 || !existing || existing.shares < qty) return;

    const revenue = qty * stock.price;
    setBalance(prev => prev + revenue);
    setPortfolio(prev => {
      if (existing.shares === qty) {
        return prev.filter(p => p.symbol !== stock.symbol);
      }
      return prev.map(p => p.symbol === stock.symbol 
        ? { ...p, shares: p.shares - qty }
        : p
      );
    });
    setTransactionAmount({ ...transactionAmount, [stock.symbol]: 0 });
  };

  const totalPortfolioValue = portfolio.reduce((acc, item) => {
    const currentPrice = stocks.find(s => s.symbol === item.symbol)?.price || 0;
    return acc + (item.shares * currentPrice);
  }, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-700">Market Dashboard</h2>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Available Cash</p>
              <p className="text-2xl font-bold text-slate-900">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {stocks.map(stock => (
              <div key={stock.symbol} className="flex flex-wrap items-center justify-between p-4 border rounded-xl hover:border-blue-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-lg text-blue-600 font-bold">
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <h3 className="font-bold">{stock.name}</h3>
                    <p className="text-sm text-slate-500">{stock.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${stock.price}</p>
                  <p className={`text-sm ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <input
                    type="number"
                    min="0"
                    placeholder="Qty"
                    className="w-20 border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    value={transactionAmount[stock.symbol] || ''}
                    onChange={(e) => setTransactionAmount({ ...transactionAmount, [stock.symbol]: parseInt(e.target.value) || 0 })}
                  />
                  <button 
                    onClick={() => handleBuy(stock)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                  >
                    Buy
                  </button>
                  <button 
                    onClick={() => handleSell(stock)}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition"
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800">
          <h2 className="text-lg font-semibold mb-4 opacity-80">Portfolio Summary</h2>
          <div className="space-y-1 mb-6">
            <p className="text-xs uppercase tracking-widest opacity-60">Total Value</p>
            <p className="text-3xl font-bold">${(balance + totalPortfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="space-y-4">
            {portfolio.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-4">Your portfolio is currently empty.</p>
            ) : (
              portfolio.map(item => {
                const stock = stocks.find(s => s.symbol === item.symbol);
                const currentVal = item.shares * (stock?.price || 0);
                return (
                  <div key={item.symbol} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <p className="font-bold">{item.symbol}</p>
                      <p className="text-xs opacity-60">{item.shares} shares @ ${item.avgPrice.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${currentVal.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
