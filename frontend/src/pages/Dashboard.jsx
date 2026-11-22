
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Plus,
  Users,
  LogOut,
  ArrowRight,
  Copy,
  Check,
  Terminal,
  Hash,
  RefreshCw,
  X,
  Search,
  Code,
  Clock3,
  Layers,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "typescript", label: "TypeScript" },
];

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [joinRoomId, setJoinRoomId] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState("");

  const token = localStorage.getItem("token");

  // Load dashboard data
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms/my-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load rooms");
      }

      setRooms(data.rooms || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch {
      setUser(null);
    }

    fetchRooms();
  }, []);

  // Create a new room
  const handleCreateRoom = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (roomName.trim().length < 3) {
      setError("Room name must contain at least 3 characters.");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: roomName.trim(),
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create room");
      }

      setRooms((prev) => [data.room, ...prev]);
      setRoomName("");
      setLanguage("javascript");
      setSuccess(`Room ${data.room.roomId} created successfully.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // Join an existing room
  const handleJoinRoom = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!joinRoomId.trim()) {
      setError("Please enter a room ID.");
      return;
    }

    setJoining(true);

    try {
      const response = await fetch(`${API_URL}/rooms/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: joinRoomId.trim().toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to join room");
      }

      setJoinRoomId("");

      await fetchRooms();

      setSuccess(`Successfully joined ${data.room.name}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  // Copy room ID
  const handleCopy = async (roomId) => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedId(roomId);

      setTimeout(() => {
        setCopiedId("");
      }, 2000);
    } catch {
      setError("Unable to copy room ID.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(search.toLowerCase()) ||
    room.roomId.toLowerCase().includes(search.toLowerCase())
  );

  const getLanguageLabel = (value) => {
    return (
      languages.find((lang) => lang.value === value)?.label || value
    );
  };

  return (
    <div className="min-h-screen bg-[#080610] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-purple-700/10 blur-[150px]" />
        <div className="absolute top-[45%] -right-40 h-[400px] w-[400px] rounded-full bg-violet-700/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>

      {/* Top navigation */}
      <header className="relative z-10 border-b border-white/[0.07] bg-[#080610]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
              <Code2 size={22} className="text-purple-400" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Code<span className="text-purple-400">Sync</span>
              </h1>
              <p className="text-[10px] tracking-[2px] text-gray-500">
                COLLABORATIVE IDE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-purple-400/30 bg-purple-500/15 font-semibold text-purple-300">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-200">
                  {user?.name || "Developer"}
                </p>
                <p className="text-xs text-gray-500">Developer account</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-400 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

        {/* Welcome section */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-purple-400">
            <Terminal size={16} />
            <span>DEVELOPER WORKSPACE</span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent">
                  {user?.name?.split(" ")[0] || "Developer"}
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                Your coding workspace is ready. Create a room, invite your
                teammates, and start building together.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-green-400/15 bg-green-400/[0.06] px-4 py-3 text-sm text-green-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              Workspace active
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Rooms</span>
              <Layers size={19} className="text-purple-400" />
            </div>
            <p className="mt-3 text-3xl font-bold">{rooms.length}</p>
            <p className="mt-1 text-xs text-gray-500">
              Rooms you've joined
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Active Rooms</span>
              <Code size={19} className="text-purple-400" />
            </div>
            <p className="mt-3 text-3xl font-bold">{rooms.length}</p>
            <p className="mt-1 text-xs text-gray-500">
              Available in your workspace
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Your Role</span>
              <Users size={19} className="text-purple-400" />
            </div>
            <p className="mt-3 text-3xl font-bold">Developer</p>
            <p className="mt-1 text-xs text-gray-500">
              Collaborate and create
            </p>
          </div>
        </section>

        {/* Notifications */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <span>{error}</span>
            <button onClick={() => setError("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <span>{success}</span>
            <button onClick={() => setSuccess("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Create and join room */}
        <section className="mb-12 grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Create room */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.10] to-transparent p-6 sm:p-7">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-600/10 blur-3xl transition group-hover:bg-purple-600/20" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/15">
                <Plus size={24} className="text-purple-300" />
              </div>

              <h3 className="text-xl font-semibold">Create a Room</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Start a new collaborative coding session and invite others
                using your unique room ID.
              </p>

              <form onSubmit={handleCreateRoom} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Java DSA Practice"
                    maxLength={50}
                    className="w-full rounded-xl border border-white/10 bg-[#0c0916] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Programming Language
                  </label>

                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0c0916] px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-purple-500/60"
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:from-purple-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Coding Room
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Join room */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] p-6 transition hover:border-purple-500/30 sm:p-7">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10">
                <Users size={23} className="text-violet-300" />
              </div>

              <h3 className="text-xl font-semibold">Join a Room</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Already have a room ID? Enter it below to join an existing
                collaborative coding session.
              </p>

              <form onSubmit={handleJoinRoom} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Room ID
                  </label>

                  <div className="relative">
                    <Hash
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                    <input
                      type="text"
                      value={joinRoomId}
                      onChange={(e) =>
                        setJoinRoomId(e.target.value.toUpperCase())
                      }
                      placeholder="Enter room ID"
                      className="w-full rounded-xl border border-white/10 bg-[#0c0916] py-3 pl-11 pr-4 text-sm uppercase tracking-wider text-white outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-600 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                  <p className="text-xs leading-5 text-gray-400">
                    Ask the room host to share their unique room ID with you.
                    You need to be logged in to join.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={joining}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 py-3 text-sm font-semibold text-purple-300 transition hover:border-purple-400/60 hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {joining ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Coding Room
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* My Rooms */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">My Rooms</h3>
                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-300">
                  {rooms.length}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Your coding sessions and collaborations
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rooms..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
                />
              </div>

              <button
                onClick={fetchRooms}
                title="Refresh rooms"
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 text-gray-400 transition hover:border-purple-500/30 hover:text-purple-300"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] py-16">
              <RefreshCw
                size={28}
                className="animate-spin text-purple-400"
              />
              <p className="mt-4 text-sm text-gray-400">
                Loading your rooms...
              </p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
                <Terminal size={27} className="text-purple-400" />
              </div>

              <h4 className="mt-5 text-lg font-semibold">
                {search ? "No matching rooms" : "No rooms yet"}
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {search
                  ? "Try searching with another room name or ID."
                  : "Create your first coding room or join one using an invitation ID."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRooms.map((room) => (
                <div
                  key={room._id}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-purple-500/[0.035]"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10">
                      <Code2 size={21} className="text-purple-300" />
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-green-400/15 bg-green-400/[0.06] px-2.5 py-1 text-[11px] text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Active
                    </span>
                  </div>

                  <h4 className="truncate text-lg font-semibold text-gray-100">
                    {room.name}
                  </h4>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <span>Room ID:</span>
                    <span className="font-mono tracking-wider text-purple-300">
                      {room.roomId}
                    </span>

                    <button
                      onClick={() => handleCopy(room.roomId)}
                      title="Copy room ID"
                      className="text-gray-500 transition hover:text-purple-300"
                    >
                      {copiedId === room.roomId ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  <div className="my-5 h-px bg-white/[0.07]" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Code size={15} className="text-purple-400" />
                      {getLanguageLabel(room.language)}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <Users size={15} className="text-purple-400" />
                      {room.members?.length || 0} members
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock3 size={13} />
                      {room.host?._id === user?.id ||
                      room.host?._id === user?._id
                        ? "Created by you"
                        : `Host: ${room.host?.name || "Unknown"}`}
                    </div>
                  </div>

                 <button
  onClick={() => navigate(`/workspace/${room.roomId}`)}
  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 py-2.5 text-sm font-medium text-purple-300 transition hover:border-purple-400/60 hover:bg-purple-500/20"
>
  Open Workspace
  <ArrowRight size={15} />
</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/[0.07] pt-6">
          <div className="flex flex-col justify-between gap-3 text-xs text-gray-600 sm:flex-row">
            <p>
              © {new Date().getFullYear()} CodeSync. Built for collaborative
              coding.
            </p>
            <p className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Code together. Build better.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
