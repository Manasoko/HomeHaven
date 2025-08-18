import {Link, Outlet} from 'react-router-dom'

const Sidebar = () => (
    <div className="w-64 h-screen p-6 transition-all dark:bg-gray-900 dark:text-white bg-gray-100 text-black ">
        <h1 className="text-xl font-bold mb-6">HomeHaven Dashboard</h1>
        <nav className="flex flex-col space-y-4">
            <Link to="/dashboard" className="hover:text-white hover:bg-gray-800 p-2 rounded">Dashboard</Link>
            <Link to="/dashboard/properties" className="hover:text-white hover:bg-gray-800 p-2 rounded">Properties</Link>
            <a href="/analytics" className="hover:text-white hover:bg-gray-800 p-2 rounded">Analytics</a>
            <a href="/billing" className="hover:text-white hover:bg-gray-800 p-2 rounded">Billing</a>
            <a href="/settings" className="hover:text-white hover:bg-gray-800 p-2 rounded">Settings</a>
        </nav>
    </div>
);

const DashboardLayout = () => {
    return (
        <div className="flex h-screen dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 p-6 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout;