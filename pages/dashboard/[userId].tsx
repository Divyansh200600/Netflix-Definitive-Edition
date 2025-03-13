import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Loader, LogOut, User } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();
  const { userId } = router.query; // Get userId from URL

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure userId is defined before fetching
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const res = await axios.get(`http://localhost:3001/auth/user/${userId}`);
        
        if (res.data.success) {
          setUser(res.data.user); // ✅ Set user state to the nested user object
        } else {
          console.error("Failed to fetch user data");
          setUser(null); // Set to null if the fetch was not successful
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null); // Set to null on error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    router.push("/login"); // Redirect to login page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Loader size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User size={30} /> Dashboard
        </h1>
        {user ? (
          <div>
            <h1>Name: {user.name}</h1> {/* Access user.name directly */}
            <p>Email: {user.email}</p> {/* Access user.email directly */}
          </div>
        ) : (
          <p>User not found.</p> // Show a message if user is not found
        )}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
