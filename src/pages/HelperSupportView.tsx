import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  LifeBuoy,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  Phone,
  Filter,
  ShieldCheck
} from 'lucide-react';

interface Ticket {
  id: string;
  userName: string;
  userPhoneOrEmail: string;
  subject: string;
  category: 'Delivery Delay' | 'Payment Issue' | 'Order Dispute' | 'Seller Inquiry';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved';
  assignedHelper: string;
  messages: { sender: string; text: string; time: string }[];
  createdAt: string;
}

export const HelperSupportView: React.FC = () => {
  const { showToast, navigate } = useUIStore();
  const { currentUser } = useAuthStore();

  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TICK-9021',
      userName: 'Aarav Sharma',
      userPhoneOrEmail: '9841234567',
      subject: 'Delivery zone confirmation for Lazimpat, Kathmandu',
      category: 'Delivery Delay',
      priority: 'Medium',
      status: 'Open',
      assignedHelper: 'Bikash Tamang',
      messages: [
        { sender: 'Aarav Sharma', text: 'Hello, when will my order NS-20261030-942 be delivered?', time: '10:00 AM' },
        { sender: 'Bikash (Helper)', text: 'Namaste! It is packed and out for delivery with our Kathmandu rider.', time: '10:15 AM' }
      ],
      createdAt: 'Today, 10:00 AM'
    },
    {
      id: 'TICK-9022',
      userName: 'Sunil Karki',
      userPhoneOrEmail: 'karki.sunil@gmail.com',
      subject: 'eSewa transaction confirmation pending verification',
      category: 'Payment Issue',
      priority: 'High',
      status: 'In Progress',
      assignedHelper: 'Bikash Tamang',
      messages: [
        { sender: 'Sunil Karki', text: 'My eSewa wallet was debited Rs. 8,500 but order page showed pending.', time: '09:30 AM' },
        { sender: 'Bikash (Helper)', text: 'We have fetched the gateway ref from eSewa and manually confirmed your order.', time: '09:45 AM' }
      ],
      createdAt: 'Today, 09:30 AM'
    },
    {
      id: 'TICK-9023',
      userName: 'Dipendra Shah (Pokhara)',
      userPhoneOrEmail: '9856011223',
      subject: 'Question on Chyangra Pashmina hallmark tag',
      category: 'Seller Inquiry',
      priority: 'Low',
      status: 'Resolved',
      assignedHelper: 'Bikash Tamang',
      messages: [
        { sender: 'Dipendra Shah', text: 'Does the Chyangra Pashmina shawl come with a Nepal government hallmark certificate?', time: 'Yesterday' },
        { sender: 'Bikash (Helper)', text: 'Yes, every pure Chyangra pashmina is stamped with the official Nepal Pashmina Industries Association (NPIA) hallmark.', time: 'Yesterday' }
      ],
      createdAt: 'Yesterday'
    }
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string>('TICK-9021');
  const [replyInput, setReplyInput] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const updated = tickets.map((t) => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          status: 'In Progress' as const,
          messages: [
            ...t.messages,
            {
              sender: `${currentUser?.name || 'Helper'} (Support)`,
              text: replyInput.trim(),
              time: 'Just now'
            }
          ]
        };
      }
      return t;
    });

    setTickets(updated);
    setReplyInput('');
    showToast(`Reply sent to ${selectedTicket.userName} via SMS/Notification!`, 'success');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: 'Resolved' as const } : t))
    );
    showToast(`Ticket ${ticketId} marked as Resolved!`, 'success');
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status.toLowerCase() === filterStatus.toLowerCase();
  });

  if (currentUser?.role !== 'helper' && currentUser?.role !== 'owner' && currentUser?.role !== 'sradmin') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Helper Support Helpdesk</h2>
        <p className="text-xs text-gray-500 mb-6">
          Access Denied: This helpdesk portal is restricted to authorized Support Helpers and Staff. Please sign in with staff credentials.
        </p>
        <button
          onClick={() => navigate('staff_login')}
          className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Staff Operations Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Helper Support Helpdesk</h1>
              <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                CUSTOMER SERVICE
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Resolve buyer disputes, answer product inquiries, and assist delivery rider queries across Nepal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Chat Dispatch Ready
          </span>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>Active Tickets</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                {filteredTickets.length}
              </span>
            </h3>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-1 border border-gray-300 rounded-lg text-xs bg-white text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="divide-y divide-gray-100 max-h-[580px] overflow-y-auto">
            {filteredTickets.map((ticket) => {
              const isSelected = ticket.id === selectedTicketId;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-gray-500">{ticket.id}</span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        ticket.status === 'Open'
                          ? 'bg-red-100 text-red-800'
                          : ticket.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{ticket.subject}</h4>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                    <span>{ticket.userName}</span>
                    <span>{ticket.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col h-[640px]">
          {/* Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900 text-sm">{selectedTicket.id}</span>
                <span className="text-xs text-gray-500">· {selectedTicket.category}</span>
              </div>
              <h3 className="font-bold text-xs text-gray-800 mt-0.5">{selectedTicket.subject}</h3>
              <p className="text-[11px] text-gray-500">
                User: <span className="font-semibold text-gray-700">{selectedTicket.userName}</span> ({selectedTicket.userPhoneOrEmail})
              </p>
            </div>

            {selectedTicket.status !== 'Resolved' && (
              <button
                onClick={() => handleResolveTicket(selectedTicket.id)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            )}
          </div>

          {/* Conversation history */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
            {selectedTicket.messages.map((m, idx) => {
              const isSupport = m.sender.includes('Helper') || m.sender.includes('Support');
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-0.5">{m.sender} · {m.time}</span>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isSupport
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-xs shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder={`Reply to ${selectedTicket.userName}...`}
              className="flex-1 p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
