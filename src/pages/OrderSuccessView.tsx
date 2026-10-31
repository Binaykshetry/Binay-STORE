import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { orderService } from '../services/orderService';
import { Order } from '../types/models';
import { formatNPR, formatBilingualDate } from '../lib/format';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  ArrowRight,
  Package,
  Calendar,
  FileText
} from 'lucide-react';

export const OrderSuccessView: React.FC = () => {
  const { currentOrderNo, navigate } = useUIStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      if (currentOrderNo) {
        const found = await orderService.getByOrderNo(currentOrderNo);
        if (found) setOrder(found);
      }
    }
    load();
  }, [currentOrderNo]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Retrieving order confirmation details...</p>
      </div>
    );
  }

  const { full: bilingualDate } = formatBilingualDate(order.placedAt);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl pb-16">
      {/* Top Success Banner */}
      <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 text-center shadow-xs mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Order Successfully Placed
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
          Thank you for choosing NepaleseStore!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Your order reference is <span className="font-mono font-bold text-gray-900">{order.orderNo}</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span>Date: {bilingualDate}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Tracking: {order.trackingNumber}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
          </div>
        </div>
      </div>

      {/* Fulfillment Progress Tracker */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-6">Fulfillment Tracker</h3>
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
          <div className="absolute top-1/2 left-0 w-1/4 -translate-y-1/2 h-1 bg-emerald-500 -z-0" />

          {['Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
            const isCompleted = idx === 0;
            return (
              <div key={step} className="flex flex-col items-center bg-white px-2 z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-gray-300 text-gray-400 bg-white'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-[11px] font-semibold mt-1.5 ${isCompleted ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Tax Invoice Container (Printable) */}
      <div id="printable-invoice" className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs mb-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900">NepaleseStore Pvt. Ltd.</h2>
            <p className="text-xs text-gray-500">Official VAT Sales Tax Invoice</p>
            <p className="text-[11px] text-gray-400 mt-1">
              PAN: <span className="font-mono font-bold text-gray-700">609823411</span> | Reg: 184920/078/079
            </p>
            <p className="text-[11px] text-gray-400">Lazimpat, Kathmandu, Nepal</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-gray-500">Invoice No:</span>
            <p className="font-mono text-base font-black text-primary-600">
              INV-{order.orderNo.replace('NS-', '')}
            </p>
            <p className="text-xs text-gray-500 mt-1">Date: {bilingualDate}</p>
          </div>
        </div>

        {/* Customer Address Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-gray-100 text-xs">
          <div>
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
              Billed & Shipped To:
            </span>
            <p className="font-bold text-gray-900 text-sm mt-1">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-600">{order.shippingAddress.street}, {order.shippingAddress.ward}</p>
            <p className="text-gray-600">
              {order.shippingAddress.municipality}, {order.shippingAddress.district}
            </p>
            <p className="text-gray-600">{order.shippingAddress.province}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
              Delivery Zone:
            </span>
            <p className="font-bold text-gray-900 text-sm mt-1">{order.deliveryZoneName}</p>
            <p className="text-gray-500 mt-1">
              Payment Method: <span className="font-bold text-gray-800">{order.paymentMethod.toUpperCase()}</span>
            </p>
            {order.paymentRef && (
              <p className="text-gray-500 font-mono text-[11px]">Ref: {order.paymentRef}</p>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">SKU</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3">
                    <p className="font-bold text-gray-900">{item.nameEn}</p>
                    <p className="text-[11px] text-gray-500">{item.variantName}</p>
                  </td>
                  <td className="py-3 text-center font-mono text-gray-500">{item.sku}</td>
                  <td className="py-3 text-right">{formatNPR(item.unitPrice)}</td>
                  <td className="py-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 text-right font-black text-gray-900">
                    {formatNPR(item.lineTotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown */}
        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-bold">{formatNPR(order.subtotal)}</span>
            </div>

            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount ({order.couponCode || 'Coupon'}):</span>
                <span className="font-bold">-{formatNPR(order.discountTotal)}</span>
              </div>
            )}

            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges:</span>
              <span className="font-bold">
                {order.shippingTotal === 0 ? 'FREE' : formatNPR(order.shippingTotal)}
              </span>
            </div>

            <div className="flex justify-between text-gray-500 text-[11px]">
              <span>VAT (13% included):</span>
              <span>{formatNPR(order.taxTotal)}</span>
            </div>

            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
              <span className="font-black text-gray-900">Grand Total:</span>
              <span className="text-lg font-black text-primary-600">
                {formatNPR(order.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4 text-gray-600" />
          <span>Print / Save Tax Invoice</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('account')}
            className="flex-1 sm:flex-none py-3 px-6 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate('home')}
            className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
