import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme, themePresets } from "../hooks/useTheme";
import {
  LayoutDashboard,
  Send,
  Link2,
  Link2 as LinkIcon,
  Users,
  BarChart3,
  Calendar,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Bell,
  User,
  Moon,
  Sun,
  Palette,
  Edit,
  Camera,
  Mail,
  Shield,
  Check,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/posts", icon: Send, label: "Posts" },
  { path: "/links", icon: Link2, label: "Links" },
  { path: "/accounts", icon: Users, label: "Accounts" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/calendar", icon: Calendar, label: "Calendar" },
  { path: "/bio", icon: Globe, label: "Bio Pages" },
  { path: "/teams", icon: Users, label: "Teams" },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const themeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme, isDark, preset, presets } = useTheme();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setLogoutConfirmOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // Sample notifications
  const notifications = [
    {
      id: 1,
      message: "Your post was published successfully",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      message: "New follower on Instagram",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Weekly analytics report ready",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-slate-700/50">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">LinkHub</span>
            </Link>
          )}
          {collapsed && (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    active ? "" : "group-hover:scale-110 transition-transform"
                  }`}
                />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
        >
          <ChevronLeft
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          {!collapsed ? (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-700/50 h-16 flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          >
            <Menu className="w-6 h-6 dark:text-gray-300" />
          </button>

          <div className="flex-1 lg:flex-none">
            {/* Page title could go here */}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <div className="relative" ref={themeRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                title="Change theme"
              >
                <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      Select Theme
                    </p>
                  </div>
                  {Object.entries(presets).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                        preset === key ? "bg-gray-100 dark:bg-slate-700" : ""
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${value.primary}, ${value.secondary})`,
                        }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {value.name}
                      </span>
                      {preset === key && (
                        <Check className="w-4 h-4 text-emerald-500 ml-auto" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-gray-200 dark:border-slate-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setTheme(isDark ? "light" : preset);
                        setThemeDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {isDark ? (
                        <Sun className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {isDark ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      Notifications
                    </p>
                    <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                          !notif.read
                            ? "bg-emerald-50 dark:bg-emerald-900/20"
                            : ""
                        }`}
                      >
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-slate-700">
                    <Link
                      to="/notifications"
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/settings/privacy"
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg py-1 pr-2 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || ""}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings/privacy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Link>
                    <Link
                      to="/settings/privacy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Change Picture
                    </Link>
                    <Link
                      to="/bio"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Manage Links
                    </Link>
                    <Link
                      to="/settings/privacy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Change Email
                    </Link>
                    <Link
                      to="/settings/privacy"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Privacy & Security
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main>{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setLogoutConfirmOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
