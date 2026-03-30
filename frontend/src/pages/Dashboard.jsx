import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import API from '../api/axios';
import { 
  Plus, CheckCircle, Circle, Trash2, Clock, Calendar, 
  LogOut, Bell, X, Check, Loader2, LayoutGrid, List, Search, Filter 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useSocket(user?._id);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [reminder, setReminder] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTodos = todos.filter(todo => 
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-body pb-12 flex flex-col">
      {/* Navigation */}
      <nav className="glass-nav px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shadow-inner">
            <CheckCircle className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-primary">FocusTask</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-sm font-bold">{user?.name}</span>
            <span className="text-xs text-text-muted">{user?.email}</span>
          </div>
          <button 
            onClick={logout}
            className="p-3 hover:bg-red-500/10 rounded-xl transition-all text-text-muted hover:text-red-500 border border-transparent hover:border-red-500/20"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto w-full px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 sticky top-28"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold">New Task</h2>
            </div>
            
            <form onSubmit={handleAddTodo} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Task Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Capture your thoughts..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due Date
                </label>
                <input 
                  type="datetime-local" 
                  className="input-field text-sm" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                  <Bell className="w-3 h-3" /> Set Reminder
                </label>
                <input 
                  type="datetime-local" 
                  className="input-field text-sm" 
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-4 shadow-lg shadow-primary/20">
                <Plus className="w-5 h-5" /> Add to List
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Todo Display */}
        <div className="lg:col-span-2">
          {/* Controls Bar */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Your Tasks</h2>
            
            <div className="flex items-center gap-3 bg-card-bg/40 p-1.5 rounded-2xl border border-border-color">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-main'}`}
                title="Table View"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="input-field pl-12 py-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-text-muted">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="font-medium">Syncing with workspace...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 glass-card border-dashed"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-primary/40 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                <p className="text-text-muted">You're all clear for today.</p>
              </motion.div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredTodos.map((todo) => (
                    <motion.div 
                      key={todo._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`glass-card p-6 flex flex-col justify-between group h-full transition-all border-l-4 ${todo.completed ? 'border-primary/20 opacity-60' : 'border-primary shadow-hover'}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <button 
                            onClick={() => handleToggleTodo(todo._id, todo.completed)}
                            className={`transition-colors ${todo.completed ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                          >
                            {todo.completed ? <CheckCircle className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                          </button>
                          <button 
                            onClick={() => handleDeleteTodo(todo._id)}
                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <h3 className={`text-lg font-bold mb-4 ${todo.completed ? 'line-through text-text-muted' : ''}`}>
                          {todo.title}
                        </h3>
                      </div>
                      <div className="flex flex-col gap-2 mt-auto">
                        {todo.dueDate && (
                          <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                            <Calendar className="w-3.5 h-3.5" /> 
                            {new Date(todo.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary/5 text-xs font-bold uppercase tracking-widest text-text-muted border-b border-border-color">
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Task Name</th>
                        <th className="px-6 py-4">Due Date</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                      <AnimatePresence>
                        {filteredTodos.map((todo) => (
                          <motion.tr 
                            key={todo._id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`hover:bg-primary/5 transition-colors group ${todo.completed ? 'opacity-60' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <button 
                                onClick={() => handleToggleTodo(todo._id, todo.completed)}
                                className={`transition-colors ${todo.completed ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
                              >
                                {todo.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                              </button>
                            </td>
                            <td className={`px-6 py-4 font-semibold text-sm ${todo.completed ? 'line-through text-text-muted' : ''}`}>
                              {todo.title}
                            </td>
                            <td className="px-6 py-4 text-xs text-text-muted font-medium">
                              {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No date'}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => handleDeleteTodo(todo._id)}
                                className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Real-time Notifications */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
              className="pointer-events-auto glass-card p-5 border-l-4 border-primary flex items-center justify-between gap-8 max-w-sm shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 bg-primary/5 rounded-bl-3xl">
                <Bell className="w-12 h-12 text-primary/10 -mr-6 -mt-6" />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center animate-bounce shadow-inner">
                  <Bell className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Focus Reminder</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
              <button 
                onClick={() => removeNotification(n.id)}
                className="text-text-muted hover:text-text-main p-1 relative z-10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
