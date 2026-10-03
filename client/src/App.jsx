import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const demoUsers = [
  {
    id: 1,
    full_name: "Vijay",
    email: "vijay@university.edu",
    password: "password123",
    role: "PLAYER",
  },
  {
    id: 2,
    full_name: "Rahul Coach",
    email: "rahul.coach@university.edu",
    password: "password123",
    role: "COACH",
  },
  {
    id: 3,
    full_name: "Priya Admin",
    email: "priya.admin@university.edu",
    password: "password123",
    role: "SPORTS_ADMIN",
  },
  {
    id: 4,
    full_name: "Administrator",
    email: "admin@university.edu",
    password: "password123",
    role: "ADMIN",
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadUser = () => {
    const token = localStorage.getItem("sports_app_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const savedUser = localStorage.getItem("sports_app_user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      setUser(parsedUser);

      setPlayerProfile({
        sport: "Football",
        position: "Forward",
        status: "Active",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (loginId, password) => {
    const foundUser = demoUsers.find(
      (item) =>
        (item.email === loginId || item.full_name === loginId) &&
        item.password === password
    );

    if (!foundUser) {
      showToast("Invalid email or password", "error");
      throw new Error("Invalid email or password");
    }

    const token = "demo_token_" + Date.now();

    localStorage.setItem("sports_app_token", token);
    localStorage.setItem("sports_app_user", JSON.stringify(foundUser));

    setUser(foundUser);

    setPlayerProfile({
      sport: "Football",
      position: "Forward",
      status: "Active",
    });

    showToast(
      `Welcome back, ${foundUser.full_name}!`,
      "success"
    );

    return {
      token,
      user: foundUser,
    };
  };

  const register = async (formData) => {
    const newUser = {
      id: Date.now(),
      full_name: formData.full_name || "New Athlete",
      email: formData.email,
      password: formData.password,
      role: "PLAYER",
    };

    const token = "demo_token_" + Date.now();

    localStorage.setItem("sports_app_token", token);
    localStorage.setItem("sports_app_user", JSON.stringify(newUser));

    setUser(newUser);

    setPlayerProfile({
      sport: formData.sport || "Football",
      position: formData.position || "Forward",
      status: "Active",
    });

    showToast(
      "Registration successful! Welcome to Sports Portal.",
      "success"
    );

    return {
      token,
      user: newUser,
    };
  };

  const logout = () => {
    localStorage.removeItem("sports_app_token");
    localStorage.removeItem("sports_app_user");

    setUser(null);
    setPlayerProfile(null);

    showToast("Logged out successfully", "info");
  };

  const loginAsDemoRole = async (role) => {
    let email = "vijay@university.edu";

    if (role === "COACH") {
      email = "rahul.coach@university.edu";
    }

    if (role === "SPORTS_ADMIN") {
      email = "priya.admin@university.edu";
    }

    if (role === "ADMIN") {
      email = "admin@university.edu";
    }

    try {
      await login(email, "password123");
    } catch (err) {
      showToast(`Demo login failed: ${err.message}`, "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        playerProfile,
        loading,
        login,
        register,
        logout,
        loginAsDemoRole,
        loadUser,
        toast,
        showToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

function Dashboard() {
  const {
    user,
    playerProfile,
    logout,
    loginAsDemoRole,
    toast,
  } = useAuth();

  if (!user) {
    return (
      <div style={styles.container}>
        <h1>Sports Portal</h1>
        <p>Authentication Demo</p>

        <div style={styles.card}>
          <h2>Demo Login</h2>

          <button
            onClick={() => loginAsDemoRole("PLAYER")}
            style={styles.button}
          >
            Login as Player
          </button>

          <button
            onClick={() => loginAsDemoRole("COACH")}
            style={styles.button}
          >
            Login as Coach
          </button>

          <button
            onClick={() => loginAsDemoRole("SPORTS_ADMIN")}
            style={styles.button}
          >
            Login as Sports Admin
          </button>

          <button
            onClick={() => loginAsDemoRole("ADMIN")}
            style={styles.button}
          >
            Login as Admin
          </button>
        </div>

        {toast && (
          <div style={styles.toast}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Sports Portal Dashboard</h1>

      <div style={styles.card}>
        <h2>Welcome, {user.full_name}</h2>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

        <hr />

        <h3>Player Profile</h3>

        <p>
          <strong>Sport:</strong> {playerProfile?.sport}
        </p>

        <p>
          <strong>Position:</strong> {playerProfile?.position}
        </p>

        <p>
          <strong>Status:</strong> {playerProfile?.status}
        </p>

        <button
          onClick={logout}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h3>Quick Role Switch</h3>

        <button
          onClick={() => loginAsDemoRole("PLAYER")}
          style={styles.button}
        >
          Player
        </button>

        <button
          onClick={() => loginAsDemoRole("COACH")}
          style={styles.button}
        >
          Coach
        </button>

        <button
          onClick={() => loginAsDemoRole("SPORTS_ADMIN")}
          style={styles.button}
        >
          Sports Admin
        </button>

        <button
          onClick={() => loginAsDemoRole("ADMIN")}
          style={styles.button}
        >
          Admin
        </button>
      </div>

      {toast && (
        <div style={styles.toast}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
  },

  card: {
    background: "white",
    maxWidth: "500px",
    margin: "20px auto",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },

  button: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },

  logout: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },

  toast: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    padding: "15px 25px",
    background: "#222",
    color: "white",
    borderRadius: "8px",
  },
};

export default App;