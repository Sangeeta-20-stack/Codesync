
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";

import {
  Code2,
  ArrowLeft,
  Copy,
  Check,
  Users,
  Play,
  Save,
  Terminal,
  LoaderCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Trash2,
  LogOut,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

const languages = {
  javascript: {
    label: "JavaScript",
    monaco: "javascript",
    starter: `// Welcome to CodeSync

const nums = [2, 5, 7, 11];
const target = 9;

function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return [];
}

console.log(twoSum(nums, target));`,
  },

  python: {
    label: "Python",
    monaco: "python",
    starter: `# Welcome to CodeSync

nums = [2, 5, 7, 11]
target = 9

def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []

print(two_sum(nums, target))`,
  },

  java: {
    label: "Java",
    monaco: "java",
    starter: `// Welcome to CodeSync

import java.util.Arrays;
import java.util.HashMap;

public class Main {

    public static void main(String[] args) {

        int[] nums = {2, 5, 7, 11};
        int target = 9;

        Main obj = new Main();

        System.out.println(
            Arrays.toString(obj.twoSum(nums, target))
        );
    }

    public int[] twoSum(int[] nums, int target) {

        HashMap<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {

            int complement = target - nums[i];

            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }

            map.put(nums[i], i);
        }

        return new int[]{};
    }
}`,
  },

  cpp: {
    label: "C++",
    monaco: "cpp",
    starter: `// Welcome to CodeSync

#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {

    unordered_map<int, int> mp;

    for (int i = 0; i < nums.size(); i++) {

        int complement = target - nums[i];

        if (mp.count(complement)) {
            return {mp[complement], i};
        }

        mp[nums[i]] = i;
    }

    return {};
}

int main() {

    vector<int> nums = {2, 5, 7, 11};

    vector<int> result = twoSum(nums, 9);

    for (int x : result) {
        cout << x << " ";
    }

    return 0;
}`,
  },

  c: {
    label: "C",
    monaco: "c",
    starter: `// Welcome to CodeSync

#include <stdio.h>

int main() {

    int nums[] = {2, 5, 7, 11};
    int target = 9;
    int n = 4;

    for (int i = 0; i < n; i++) {

        for (int j = i + 1; j < n; j++) {

            if (nums[i] + nums[j] == target) {
                printf("[%d, %d]", i, j);
                return 0;
            }
        }
    }

    return 0;
}`,
  },

  typescript: {
    label: "TypeScript",
    monaco: "typescript",
    starter: `// Welcome to CodeSync

const nums: number[] = [2, 5, 7, 11];
const target: number = 9;

function twoSum(nums: number[], target: number): number[] {

    const map = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {

        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }

        map.set(nums[i], i);
    }

    return [];
}

console.log(twoSum(nums, target));`,
  },
};

function Workspace() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const isRemoteUpdate = useRef(false);

  const [room, setRoom] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState(
    "CodeSync terminal is ready. Write your code and click Run."
  );

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [roomMembers, setRoomMembers] = useState([]);
  const [socketStatus, setSocketStatus] = useState("Connecting...");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH ROOM
  // ==========================================

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/rooms/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load room.");
      }

      const fetchedRoom = data.room;

      setRoom(fetchedRoom);

      const savedLanguage = languages[fetchedRoom.language]
        ? fetchedRoom.language
        : "javascript";

      setLanguage(savedLanguage);

      setCode(
        fetchedRoom.code != null && fetchedRoom.code !== ""
          ? fetchedRoom.code
          : languages[savedLanguage].starter
      );
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

    fetchRoom();
  }, [roomId]);

  // ==========================================
  // SOCKET.IO CONNECTION
  // ==========================================

  useEffect(() => {
    if (!token || !roomId) return;

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketStatus("Connected");

      socket.emit("room:join", { roomId }, (response) => {
        if (!response?.success) {
          setSocketStatus("Room access denied");
          console.error(response?.message);
          return;
        }

        console.log("Joined CodeSync room:", roomId);
      });
    });

    socket.on("connect_error", (err) => {
      setSocketStatus("Disconnected");
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
      setRoomMembers([]);
    });

    // Receive code changes from other users.
    socket.on("room:code-change", ({ code: updatedCode }) => {
      if (typeof updatedCode !== "string") return;

      isRemoteUpdate.current = true;
      setCode(updatedCode);
    });

    // Receive language changes from other users.
    socket.on("room:language-change", ({ language: updatedLanguage }) => {
      if (!languages[updatedLanguage]) return;

      setLanguage(updatedLanguage);
    });

    // Receive online room members.
    socket.on("room:members", (members) => {
      setRoomMembers(members);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, token]);

  // ==========================================
  // HANDLE EDITOR CHANGES
  // ==========================================

  const handleCodeChange = (value) => {
    const updatedCode = value || "";

    setCode(updatedCode);

    // Do not rebroadcast changes received from another user.
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    socketRef.current?.emit("room:code-change", {
      code: updatedCode,
    });
  };

  // ==========================================
  // HANDLE LANGUAGE CHANGE
  // ==========================================

  const handleLanguageChange = (newLanguage) => {
    if (!languages[newLanguage]) return;

    setLanguage(newLanguage);

    const starter = languages[newLanguage].starter;

    setCode(starter);

    setOutput(`Language changed to ${languages[newLanguage].label}.`);

    socketRef.current?.emit("room:language-change", {
      language: newLanguage,
    });

    socketRef.current?.emit("room:code-change", {
      code: starter,
    });
  };

  // ==========================================
  // SAVE CODE
  // ==========================================

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/rooms/${roomId}/code`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not save code.");
      }

      setOutput("Code successfully saved to your room.");
    } catch (err) {
      setOutput(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // RUN CODE
  // ==========================================

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Please write some code before running.");
      return;
    }

    try {
      setRunning(true);
      setOutput("Submitting your code for execution...");

      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code,
          language,
          stdin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code execution failed.");
      }

      if (response.status === 202) {
        setOutput(
          data.message || "Execution is still processing. Please try again."
        );
        return;
      }

      const result = [
        `Status: ${data.status || "Completed"}`,
        "",
        "Output:",
        data.output || "(No output)",
      ];

      if (data.error) {
        result.push("", "Runtime Error:", data.error);
      }

      if (data.compileOutput) {
        result.push("", "Compilation Output:", data.compileOutput);
      }

      result.push(
        "",
        `Exit Code: ${data.exitCode ?? "Unavailable"}`,
        `Execution Time: ${data.executionTime ?? "Unavailable"} seconds`,
        `Memory: ${
          data.memory != null ? `${data.memory} KB` : "Unavailable"
        }`
      );

      setOutput(result.join("\n"));
    } catch (err) {
      setOutput(`Execution failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  // ==========================================
  // COPY ROOM ID
  // ==========================================

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setOutput("Could not copy room ID.");
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    socketRef.current?.disconnect();

    navigate("/login");
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080610] text-white">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-purple-500" size={35} />
          <p className="text-sm text-gray-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080610] px-4 text-white">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={40} />

          <h2 className="mb-2 text-xl font-semibold">
            Unable to open workspace
          </h2>

          <p className="mb-6 text-sm text-gray-400">
            {error || "Room not found."}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium hover:bg-purple-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN WORKSPACE
  // ==========================================

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#080610] text-white">

      {/* TOP NAVIGATION */}

      <header className="z-20 flex h-[68px] shrink-0 items-center justify-between border-b border-white/[0.08] bg-[#0B0813] px-4 sm:px-6">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            title="Back to Dashboard"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Code2 size={21} />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide">
              Code<span className="text-purple-500">Sync</span>
            </h1>

            <p className="text-[10px] tracking-wider text-gray-500">
              COLLABORATIVE CODING
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          {/* CONNECTION STATUS */}

          <div className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 sm:flex">

            {socketStatus === "Connected" ? (
              <Wifi size={14} className="text-green-400" />
            ) : (
              <WifiOff size={14} className="text-red-400" />
            )}

            <span className="text-xs text-gray-400">
              {socketStatus}
            </span>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-sm text-gray-400 transition hover:border-red-500/30 hover:text-red-400"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </header>

      {/* ROOM INFORMATION */}

      <div className="flex min-h-[62px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0B0813] px-4 py-3 sm:px-6">

        <div className="flex items-center gap-3">

          <div>
            <h2 className="text-sm font-semibold text-white">
              {room.name}
            </h2>

            <div className="mt-1 flex items-center gap-2">

              <span className="text-[11px] text-gray-500">
                Room ID: {room.roomId}
              </span>

              <button
                onClick={handleCopyRoomId}
                className="text-gray-500 transition hover:text-purple-400"
                title="Copy Room ID"
              >
                {copied ? (
                  <Check size={13} className="text-green-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>

            </div>
          </div>

        </div>

        {/* ONLINE MEMBERS */}

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-2">
            <Users size={16} className="text-purple-400" />

            <span className="text-xs text-gray-400">
              {roomMembers.length} Online
            </span>
          </div>

          <div className="flex -space-x-2">

            {roomMembers.slice(0, 5).map((member) => (
              <div
                key={member.id}
                title={member.name}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B0813] bg-purple-600 text-xs font-semibold text-white"
              >
                {member.name?.charAt(0).toUpperCase()}
              </div>
            ))}

            {roomMembers.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B0813] bg-gray-700 text-[10px]">
                +{roomMembers.length - 5}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* EDITOR TOOLBAR */}

      <div className="flex min-h-[55px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-[#0E0A18] px-4 py-2 sm:px-6">

        <div className="flex items-center gap-3">

          <div className="relative">

            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="cursor-pointer appearance-none rounded-lg border border-white/[0.1] bg-[#171123] py-2 pl-3 pr-9 text-xs font-medium text-gray-200 outline-none transition hover:border-purple-500/50 focus:border-purple-500"
            >
              {Object.entries(languages).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              ▾
            </span>

          </div>

          <span className="hidden text-xs text-gray-600 sm:block">
            {languages[language].label}
          </span>

        </div>

        <div className="flex items-center gap-2">

          {/* SAVE BUTTON */}

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-purple-500/50 hover:text-white disabled:opacity-50"
          >
            {saving ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}

            {saving ? "Saving..." : "Save"}
          </button>

          {/* RUN BUTTON */}

          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-900/20 transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : (
              <Play size={15} fill="currentColor" />
            )}

            {running ? "Running..." : "Run Code"}
          </button>

        </div>

      </div>

      {/* EDITOR AREA */}

      <div className="min-h-0 flex-1 bg-[#080610]">

        <Editor
          height="100%"
          language={languages[language].monaco}
          value={code}
          onChange={handleCodeChange}
          theme="codesync-dark"
          beforeMount={(monaco) => {
            monaco.editor.defineTheme("codesync-dark", {
              base: "vs-dark",
              inherit: true,
              rules: [
                {
                  token: "comment",
                  foreground: "77718B",
                  fontStyle: "italic",
                },
                {
                  token: "keyword",
                  foreground: "C792EA",
                },
                {
                  token: "string",
                  foreground: "C3E88D",
                },
              ],
              colors: {
                "editor.background": "#080610",
                "editor.foreground": "#E5E1F0",
                "editorLineNumber.foreground": "#514B61",
                "editorLineNumber.activeForeground": "#B7A5E8",
                "editorCursor.foreground": "#A78BFA",
                "editor.selectionBackground": "#6D28D955",
                "editor.lineHighlightBackground": "#FFFFFF08",
              },
            });
          }}
          options={{
            minimap: {
              enabled: true,
            },
            fontSize: 14,
            fontFamily: "Fira Code, Consolas, monospace",
            fontLigatures: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            tabSize: 4,
            padding: {
              top: 16,
            },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            bracketPairColorization: {
              enabled: true,
            },
            smoothScrolling: true,
            cursorBlinking: "smooth",
            renderLineHighlight: "all",
          }}
        />

      </div>

      {/* TERMINAL PANEL */}

      <div className="flex h-[230px] shrink-0 flex-col border-t border-white/[0.08] bg-[#0B0813] sm:h-[260px]">

        {/* TERMINAL HEADER */}

        <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-6">

          <div className="flex items-center gap-2">

            <Terminal size={16} className="text-purple-400" />

            <span className="text-xs font-semibold tracking-wide text-gray-300">
              TERMINAL
            </span>

            <span className="rounded bg-purple-500/10 px-2 py-0.5 text-[9px] font-medium text-purple-400">
              OUTPUT
            </span>

          </div>

          <button
            onClick={() => setOutput("Terminal cleared.")}
            className="flex items-center gap-1.5 text-xs text-gray-500 transition hover:text-white"
          >
            <Trash2 size={13} />
            Clear
          </button>

        </div>

        {/* STANDARD INPUT */}

        <div className="shrink-0 border-b border-white/[0.06] px-4 py-2 sm:px-6">

          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Standard Input (stdin)
          </label>

          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Enter program input here..."
            rows={2}
            className="w-full resize-none rounded-lg border border-white/[0.08] bg-[#080610] px-3 py-2 font-mono text-xs text-gray-300 outline-none placeholder:text-gray-700 focus:border-purple-500/50"
          />

        </div>

        {/* OUTPUT */}

        <div className="min-h-0 flex-1 overflow-auto px-4 py-3 sm:px-6">

          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-gray-300">
            {output}
          </pre>

        </div>

      </div>

      {/* BOTTOM STATUS BAR */}

      <footer className="flex h-[27px] shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#0E0A18] px-4 text-[10px] text-gray-500 sm:px-6">

        <div className="flex items-center gap-3">

          <span className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                socketStatus === "Connected"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            />
            {socketStatus}
          </span>

          <span>{languages[language].label}</span>

        </div>

        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>CodeSync</span>
        </div>

      </footer>

    </div>
  );
}

export default Workspace;
