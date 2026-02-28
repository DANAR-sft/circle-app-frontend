import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

// Singleton socket instance
let socket: Socket | null = null;

/**
 * Mendapatkan atau membuat koneksi socket
 * @returns Socket instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem("token");

    socket = io(SOCKET_URL, {
      autoConnect: false,
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    // Event listeners untuk debugging
    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("⚠️ Connection error:", error.message);
    });
  }

  return socket;
};

/**
 * Menghubungkan socket ke server
 */
export const connectSocket = (): void => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
};

/**
 * Memutuskan koneksi socket dari server
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Mengirim event ke server
 * @param event - Nama event
 * @param data - Data yang akan dikirim
 */
export const emitEvent = <T>(event: string, data?: T): void => {
  const sock = getSocket();
  if (sock.connected) {
    sock.emit(event, data);
  } else {
    console.warn("Socket not connected. Cannot emit:", event);
  }
};

/**
 * Mendengarkan event dari server
 * @param event - Nama event
 * @param callback - Fungsi callback saat event diterima
 */
export const onEvent = <T>(
  event: string,
  callback: (data: T) => void,
): void => {
  const sock = getSocket();
  sock.on(event, callback);
};

/**
 * Berhenti mendengarkan event tertentu
 * @param event - Nama event
 */
export const offEvent = (event: string): void => {
  const sock = getSocket();
  sock.off(event);
};

export default socket;
