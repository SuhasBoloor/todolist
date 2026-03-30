import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import API from '../api/axios';
import { 
  Plus, CheckCircle, Circle, Trash2, Clock, Calendar, 
  LogOut, Bell, X, Check, Loader2, LayoutGrid, List, Search, Filter,
  Layers, Palette, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const COLORS = [
  { name: 'Sky', value: '#38bdf8' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pinterest Red', value: '#e60023' },
];

const BOARDS = ['General', 'Work', 'Personal', 'Shopping', 'Health'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useSocket(user?._id);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedBoard, setSelectedBoard] = useState(BOARDS[0]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBoard, setActiveBoard] = useState('All');

  const fetchTodos = async () => {
    try {
      const { data } = await API.get('/todos');
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await API.post('/todos', {
        title,
        color: selectedColor,
        board: selectedBoard,
        reminder: reminder ? new Date(reminder).toISOString() : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setTodos([res.data, ...todos]);
      setTitle('');
      setReminder('');
      setDueDate('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
  };

  const handleToggleTodo = async (id, completed) => {
    try {
      const { data } = await API.put(`/todos/${id}`, { completed: !completed });
      setTodos(todos.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = activeBoard === 'All' || todo.board === activeBoard;
    return matchesSearch && matchesBoard;
  });

  const toggleModal = () => {
    document.getElementById('add-modal').classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  };

  return (
    <div className="min-h-screen bg-body pb-20 pt-28 px-6">
      {/* Floating Top Navigation */}
      <nav className="floating-nav">
        <div className="flex items-center gap-2 px-3 mr-4 border-r border-border-color">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg hidden sm:inline text-primary">FocusTask</span>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[500px]">
          {['All', ...BOARDS].map(board => (
            <button
              key={board}
              onClick={() => setActiveBoard(board)}
              className={`px-5 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap ${activeBoard === board ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-text-muted'}`}
            >
              {board}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border-color">
          <ThemeToggle />
          <button 
            onClick={logout}
            className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-text-muted hover:text-primary"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search your pins..." 
              className="input-minimal pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button 
            onClick={toggleModal}
            className="btn-pinterest whitespace-nowrap shadow-xl"
          >
            <Plus className="w-6 h-6" /> Create Pin
          </button>
        </div>

        {/* Task Creation Modal */}
        <div id="add-modal" className="hidden fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="pinterest-card w-full max-w-xl p-8 sm:p-12 relative bg-body shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
            <button 
              onClick={toggleModal}
              className="absolute top-6 right-6 p-3 text-text-muted hover:bg-primary/10 rounded-full transition-all hover:rotate-90"
            >
              <X className="w-7 h-7" />
            </button>
            <h2 className="text-4xl font-black mb-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shadow-inner">
                <Plus className="text-primary w-7 h-7" />
              </div>
              New Pin
            </h2>
            <form onSubmit={handleAddTodo} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-text-muted ml-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Title
                </label>
                <input 
                  type="text" 
                  className="input-minimal" 
                  placeholder="What's the plan?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-text-muted ml-1 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Board
                  </label>
                  <select 
                    className="input-minimal appearance-none"
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                  >
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-text-muted ml-1 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Splash
                  </label>
                  <div className="flex gap-3 flex-wrap p-1">
                    {COLORS.map(c => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedColor(c.value)}
                        className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 ${selectedColor === c.value ? 'border-primary shadow-lg scale-125 z-10' : 'border-transparent opacity-80'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black text-text-muted ml-1 flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> Due Date
                  </label>
                  <input 
                    type="datetime-local" 
                    className="input-minimal text-sm" 
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-text-muted ml-1 flex items-center gap-2">
                    <Bell className="w-4 h-4" /> Reminder
                  </label>
                  <input 
                    type="datetime-local" 
                    className="input-minimal text-sm" 
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-pinterest w-full py-5 text-xl mt-6 shadow-2xl"
                onClick={toggleModal}
              >
                Save Pin
              </button>
            </form>
          </motion.div>
        </div>

        {/* Masonry Pin Grid */}
        <div className="masonry-grid">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-40 text-text-muted">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
              <p className="text-xl font-bold">Curating your workspace...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="masonry-item p-12 text-center pinterest-card border-dashed">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <Layers className="text-primary/30 w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Your pinboard is empty</h3>
              <p className="text-text-muted">Start pinning your ideas today!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredTodos.map((todo) => (
                <motion.div 
                  key={todo._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="masonry-item"
                >
                  <div 
                    className={`pinterest-card p-6 flex flex-col gap-4 group h-full transition-all border-t-[8px] ${todo.completed ? 'opacity-50 grayscale' : ''}`}
                    style={{ borderTopColor: todo.color }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                        {todo.board}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleTodo(todo._id, todo.completed)}
                          className={`p-2 rounded-full transition-colors ${todo.completed ? 'bg-primary text-white' : 'bg-white/10 text-text-muted hover:bg-primary/20 hover:text-primary'}`}
                        >
                          {todo.completed ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteTodo(todo._id)}
                          className="p-2 bg-red-500/10 text-text-muted hover:bg-red-500 hover:text-white rounded-full transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className={`text-xl font-bold leading-tight ${todo.completed ? 'line-through text-text-muted' : ''}`}>
                      {todo.title}
                    </h3>

                    <div className="flex flex-wrap gap-3 mt-4">
                      {todo.dueDate && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-text-muted bg-body/50 px-3 py-1.5 rounded-full border border-border-color">
                          <Clock className="w-3.5 h-3.5 text-primary" /> 
                          {new Date(todo.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                      {todo.reminder && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                          <Bell className="w-3.5 h-3.5" /> 
                          Reminder Set
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Real-time Notifications */}
      <div className="fixed bottom-10 right-10 z-[300] flex flex-col gap-6 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto pinterest-card p-6 border-l-[10px] border-primary flex items-center justify-between gap-10 max-w-md shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center animate-bounce">
                  <Bell className="text-primary w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-lg font-bold tracking-tight">Focus Pin</h4>
                  <p className="text-sm text-text-muted mt-1">{n.message}</p>
                </div>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="p-2 text-text-muted hover:bg-primary/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
