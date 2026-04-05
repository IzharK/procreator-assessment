import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, LogIn, PlusCircle, Calendar, Settings, LogOut, ChevronDown, X } from 'lucide-react';
import axios from 'axios';

// -------------------------------------------------------------
// Admin Login Component
// -------------------------------------------------------------
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (response.data.role !== 'admin') {
        setError('Access denied: Admin credentials required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="max-w-md w-full glass p-8 rounded-2xl shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 button-accent rounded-xl text-white mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Admin Portal</h2>
          <p className="mt-2 text-slate-400">Sign in to manage your services</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="admin@procreator.ai"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white button-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Custom Status Dropdown Component
// -------------------------------------------------------------
const StatusDropdown = ({ currentStatus, bookingId, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const statuses = ['pending', 'confirmed', 'completed', 'canceled'];

    const handleSelect = (status) => {
        setIsOpen(false);
        if (status !== currentStatus) {
            onUpdate(bookingId, status);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'text-green-500 bg-green-500/10';
            case 'completed': return 'text-purple-500 bg-purple-500/10';
            case 'canceled': return 'text-red-500 bg-red-500/10';
            default: return 'text-orange-500 bg-orange-500/10'; // pending
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-28 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all ${getStatusColor(currentStatus)}`}
            >
                <span>{currentStatus}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute z-10 mt-1 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => handleSelect(s)}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white uppercase tracking-wider transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
            {/* Backdrop to close click outside */}
            {isOpen && <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />}
        </div>
    );
};

// -------------------------------------------------------------
// Create Service Modal Component
// -------------------------------------------------------------
const CreateServiceModal = ({ isOpen, onClose, onServiceCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [price, setPrice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.post('http://localhost:5000/api/services', {
                name, 
                description, 
                duration: Number(duration), 
                price: Number(price)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onServiceCreated(res.data);
            
            // clear form
            setName(''); setDescription(''); setDuration(''); setPrice('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white">Create New Service</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-lg">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{error}</div>}
                    
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1.5">Service Name</label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Logo Design" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300 block mb-1.5">Description</label>
                        <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the service..." className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white h-24 resize-none outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1.5">Duration (mins)</label>
                            <input required type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} placeholder="60" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300 block mb-1.5">Price ($)</label>
                            <input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} placeholder="150" className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition-colors" />
                        </div>
                    </div>
                    
                    <div className="pt-4 mt-6 border-t border-slate-800 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 button-accent rounded-lg text-sm text-white font-bold tracking-wide disabled:opacity-50 transition-transform hover:scale-105 active:scale-95">
                            {loading ? 'Creating...' : 'Create Service'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// Dashboard Component
// -------------------------------------------------------------
const Dashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Basic Auth Guard & Fetching
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchBookings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bookings/allbookings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                setError('Failed to fetch bookings. Ensure backend is running.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/login');
    };

    const updateBookingStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:5000/api/bookings/${id}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            
            // Update local state smoothly
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleServiceCreated = (newService) => {
        // We could also refetch services if we had a dedicated service page,
        // but for now, we just show a success alert to confirm it worked.
        alert(`Service "${newService.name}" created successfully!`);
    };

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex font-sans">
            <CreateServiceModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onServiceCreated={handleServiceCreated} 
            />

            {/* Sidebar */}
            <div className="w-64 glass border-r border-slate-800 flex flex-col p-6 space-y-8 z-10">
                <div className="flex items-center space-x-3 text-blue-400 pl-2">
                    <LayoutDashboard size={26} strokeWidth={2.5} />
                    <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">AdminPanel</span>
                </div>
                
                <nav className="flex-1 space-y-3 mt-4">
                    <button className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl bg-blue-600/15 text-blue-400 font-semibold transition-all">
                        <Calendar size={22} />
                        <span>Bookings</span>
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-semibold transition-all group"
                    >
                        <PlusCircle size={22} className="group-hover:text-emerald-400 transition-colors" />
                        <span>Create Service</span>
                    </button>
                    <button className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/80 hover:text-white font-semibold transition-all">
                        <Settings size={22} />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="pt-6 border-t border-slate-800/50">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-4 px-5 py-3.5 text-red-400 hover:bg-red-500/10 rounded-xl font-semibold transition-all"
                    >
                        <LogOut size={22} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 overflow-y-auto relative">
                {/* Decorative background blur */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Booking Dashboard</h1>
                        <p className="text-slate-400 text-lg">Manage your business schedule and client appointments.</p>
                    </div>
                    <div className="flex space-x-5">
                        <div className="glass px-7 py-4 rounded-2xl border border-slate-700/50 min-w-[160px]">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Total Bookings</p>
                            <p className="text-3xl font-black text-white">{loading ? '-' : totalBookings}</p>
                        </div>
                        <div className="glass px-7 py-4 rounded-2xl border border-slate-700/50 border-t-4 border-t-orange-500 min-w-[160px]">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Pending Action</p>
                            <p className="text-3xl font-black text-white">{loading ? '-' : pendingBookings}</p>
                        </div>
                    </div>
                </header>

                <div className="glass border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-800/80 bg-slate-800/20">
                        <h2 className="text-xl font-bold">Recent Appointments</h2>
                    </div>

                    {loading ? (
                        <div className="p-16 text-center text-slate-400 flex flex-col items-center">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="font-medium tracking-wide">Loading bookings framework...</p>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-400 bg-red-500/5">
                            <p>{error}</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-20 text-center">
                            <Calendar size={64} className="mx-auto text-slate-600 mb-6" />
                            <h3 className="text-2xl font-bold text-slate-300 mb-2">No Bookings Yet</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">When customers book services through the mobile app, they will appear right here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/40 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                    <tr>
                                        <th className="px-8 py-5">Customer Info</th>
                                        <th className="px-6 py-5">Requested Service</th>
                                        <th className="px-6 py-5">Date & Time</th>
                                        <th className="px-6 py-5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {bookings.map((b) => {
                                        const dateObj = new Date(b.date);
                                        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                        const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                        return (
                                            <tr key={b._id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                                                            {b.user?.name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{b.user?.name || 'Unknown User'}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{b.user?.email || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-slate-300">{b.service?.name || 'Deleted Service'}</p>
                                                    {b.service && <p className="text-xs text-slate-500 font-medium">${b.service.price} • {b.service.duration} min</p>}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="font-semibold text-slate-300">{formattedDate}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{formattedTime}</p>
                                                </td>
                                                <td className="px-6 py-5 pr-8">
                                                    <div className="flex relative z-0">
                                                       <StatusDropdown 
                                                          currentStatus={b.status} 
                                                          bookingId={b._id}
                                                          onUpdate={updateBookingStatus} 
                                                       />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
