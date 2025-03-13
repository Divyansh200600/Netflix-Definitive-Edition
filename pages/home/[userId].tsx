import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Loader, LogOut, User } from "lucide-react";

const Dashboard = () => {
  const router = useRouter();
  const { userId } = router.query; 

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true); 
        const res = await axios.get(`http://localhost:3001/duggu-api/auth/user/${userId}`);
        
        if (res.data.success) {
          setUser(res.data.user); 
        } else {
          console.error("Failed to fetch user data");
          setUser(null); 
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    router.push("/"); 
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
            <h1>Name: {user.name}</h1> 
            <p>Email: {user.email}</p> 
          </div>
        ) : (
          <p>User not found.</p> 
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
