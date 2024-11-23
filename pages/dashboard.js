import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showAddCallForm, setShowAddCallForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newCall, setNewCall] = useState({
    NoOfClients: "",
    MeetingsScheduled: "",
  });
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/intern/profile", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
        } else {
          setError(data.message);
          router.push("/login");
        }
      } catch (err) {
        setError("Failed to fetch user data");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleAddCall = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/intern/add-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newCall),
      });

      const data = await response.json();

      if (response.ok) {
        setUserData((prevData) => ({
          ...prevData,
          calls: [...prevData.calls, { ...data.call }],
        }));
        setShowAddCallForm(false);
        setNewCall({ NoOfClients: "", MeetingsScheduled: "" });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to add call data");
    }
  };

  const handleAddComplaint = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newComplaint),
      });

      const data = await response.json();

      if (response.ok) {
        setShowComplaintForm(false);
        setNewComplaint({ title: "", description: "" });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to submit complaint");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    try {
      const response = await fetch("/api/intern/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowChangePasswordForm(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to change password");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce delay-75"></div>
          <div className="h-3 w-3 bg-blue-400 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-lg shadow-lg flex items-center border border-red-700">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              Welcome, {userData?.name}
            </h1>
            <div className="flex space-x-4">
              <span className="px-4 py-2 bg-blue-900/50 text-blue-300 rounded-full text-sm font-medium border border-blue-700">
                {userData?.TeamName}
              </span>
              <button
                onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Change Password
              </button>
            </div>
          </div>

          {showChangePasswordForm && (
            <form
              onSubmit={handleChangePassword}
              className="mb-8 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Change Password
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Username
                </h2>
                <p className="text-lg text-white">{userData?.username}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Email
                </h2>
                <p className="text-lg text-white">{userData?.email}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Mobile
                </h2>
                <p className="text-lg text-white">{userData?.mobile}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Team Name
                </h2>
                <p className="text-lg text-white">{userData?.TeamName}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Team Leader
                </h2>
                <p className="text-lg text-white">{userData?.teamLeader}</p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-400 mb-1">
                  Referral Code
                </h2>
                <p className="text-lg text-white">
                  {userData?.referalCode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-8">
            Performance Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 rounded-xl border border-blue-700">
              <h3 className="text-sm font-medium text-blue-300 mb-2">
                Commission Earned
              </h3>
              <p className="text-3xl font-bold text-blue-200">
                ₹{userData?.comissionEarned?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 p-6 rounded-xl border border-emerald-700">
              <h3 className="text-sm font-medium text-emerald-300 mb-2">
                Commission Released
              </h3>
              <p className="text-3xl font-bold text-emerald-200">
                ₹{userData?.comissionReleased?.toLocaleString() || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-xl border border-purple-700">
              <h3 className="text-sm font-medium text-purple-300 mb-2">
                Personal Deals
              </h3>
              <p className="text-3xl font-bold text-purple-200">
                {userData?.dealsClosedPersonally || 0}
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/50 p-6 rounded-xl border border-amber-700">
              <h3 className="text-sm font-medium text-amber-300 mb-2">
                Team Deals
              </h3>
              <p className="text-3xl font-bold text-amber-200">
                {userData?.dealsClosedByTeam || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-8">Assigned Data</h2>
          {userData?.DataAssigned && userData.DataAssigned.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.DataAssigned.map((data, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6 text-gray-300">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No data has been assigned yet.</p>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Calls</h2>
            <button
              onClick={() => setShowAddCallForm(!showAddCallForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {showAddCallForm ? "Cancel" : "Add New Call"}
            </button>
          </div>

          {showAddCallForm && (
            <form
              onSubmit={handleAddCall}
              className="mb-8 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Clients Called
                  </label>
                  <input
                    type="number"
                    value={newCall.NoOfClients}
                    onChange={(e) =>
                      setNewCall((prev) => ({
                        ...prev,
                        NoOfClients: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meetings Scheduled
                  </label>
                  <input
                    type="number"
                    value={newCall.MeetingsScheduled}
                    onChange={(e) =>
                      setNewCall((prev) => ({
                        ...prev,
                        MeetingsScheduled: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Submit Call Data
              </button>
            </form>
          )}

          {userData?.calls && userData.calls.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Clients Called
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Meetings Scheduled
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.calls.map((call, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className="py-4 px-6 text-gray-300">
                        {new Date(call.Date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {call.NoOfClients}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {call.MeetingsScheduled}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            call.MeetingsScheduled / call.NoOfClients >= 0.5
                              ? "bg-green-900/50 text-green-300 border border-green-700"
                              : "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                          }`}>
                          {(
                            (call.MeetingsScheduled / call.NoOfClients) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Complaints & Suggestions
            </h2>
            <button
              onClick={() => setShowComplaintForm(!showComplaintForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {showComplaintForm ? "Cancel" : "Add New Complaint"}
            </button>
          </div>

          {showComplaintForm && (
            <form
              onSubmit={handleAddComplaint}
              className="mb-8 p-6 bg-gray-700/50 rounded-xl border border-gray-600">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newComplaint.title}
                    onChange={(e) =>
                      setNewComplaint((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newComplaint.description}
                    onChange={(e) =>
                      setNewComplaint((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 h-32"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Submit Complaint
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
