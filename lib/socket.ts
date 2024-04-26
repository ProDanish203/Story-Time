import io, { Socket } from "socket.io-client";
const BASE_SOCKET_CONNECTION = "http://storytime.yameenyousuf.com/";

class WSService {
  private socket: Socket | null = null;

  initializeSocket = async (token: string): Promise<void> => {
    try {
      this.socket = io(BASE_SOCKET_CONNECTION, {
        transports: ["websocket"],
        query: {
          token: `Bearer ${token}`,
        },
      });

      this.socket.on("connect", () => {
        console.log("=== socket connected ====");
      });

      this.socket.on("disconnect", () => {
        console.log("=== socket disconnected ====");
      });

      this.socket.on("connect_error", (err: Error) => {
        console.log(err, "socket connection error");
      });

      this.socket.on("error", (data: any) => {
        console.log("socket error", data);
      });
    } catch (error) {
      console.log("socket is not initialized", error);
    }
  };

  emit(event: string, data: any = {}): void {
    this.socket?.emit(event, data);
  }

  on(event: string, cb: (...args: any[]) => void): void {
    this.socket?.on(event, cb);
  }

  removeListener(
    listenerName: string,
    listener: (...args: any[]) => void
  ): void {
    this.socket?.off(listenerName, listener);
  }

  removeAllListener(listenerName?: string): void {
    if (listenerName) {
      this.socket?.removeAllListeners(listenerName);
    } else {
      this.socket?.removeAllListeners();
    }
  }

  disconnect(): void {
    this.socket?.disconnect();
  }
}

const socketServcies = new WSService();

export default socketServcies;
