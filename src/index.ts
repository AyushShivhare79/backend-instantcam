import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface userType {
  id: string;
  socket: WebSocket;
}

interface RoomType {
  user1: {};
  user2: {};
}

let room = new Map<string, RoomType>();

let users = [{}];

// let user: WebSocket | null;
let userId = 1;
let count = 0;
let roomId = 0;
wss.on("connection", function connection(ws) {
  // if (!user) {
  //   user = ws;
  //   user.send(JSON.stringify({ message: "Waiting for someone to connect!" }));
  //   return;
  // }

  //Creating users

  if (count < 2) {
    count++;
    users.push({ id: "user" + userId++, socket: ws });
    console.log(users);
    if (count < 2) return;
  }

  //Creating rooms

  roomId++;
  room.set(roomId.toString(), { user1: users[1], user2: users[2] });
  console.log("ROOM: ", room);

  // Sending message of pair successful both side

  const pair = room.get("1");
  pair?.user1.socket.send(JSON.stringify({ message: "Paired successful!" }));
  pair?.user2.socket.send(JSON.stringify({ message: "Paired successful!" }));

  // Giving both thier identity

  pair?.user1.socket.send(JSON.stringify({ user: "user1" }));
  pair?.user2.socket.send(JSON.stringify({ user: "user2" }));

  //Sharing data with each other
  pair?.user1.socket.on("message", function message(data: any) {
    const message = JSON.parse(data);
    if (message.type === "createOffer") {
      pair?.user2.socket?.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
    }
    if (message.type === "iceCandidate") {
      pair?.user2.socket?.send(
        JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
      );
    }
  });

  pair?.user2.socket.on("message", function message(data: any) {
    const message = JSON.parse(data);
    if (message.type === "createAnswer") {
      pair?.user1.socket?.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    }
    if (message.type === "iceCandidate") {
      pair?.user1.socket?.send(
        JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
      );
    }
  });

  // console.log("DONE: ", users[1]);

  // users.push({})
  //HERE
  // ws.send(JSON.stringify({ message: "Paired successful!" }));

  // user.send(JSON.stringify({ user: "user1" }));
  // ws.send(JSON.stringify({ user: "user2" }));

  // user.on("message", function message(data: any) {
  //   const message = JSON.parse(data);
  //   if (message.type === "createOffer") {
  //     ws?.send(JSON.stringify({ type: "createOffer", sdp: message.sdp }));
  //   }
  //   if (message.type === "iceCandidate") {
  //     ws?.send(
  //       JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
  //     );
  //   }
  // });

  // ws.on("message", function message(data: any) {
  //   const message = JSON.parse(data);
  //   if (message.type === "createAnswer") {
  //     user?.send(JSON.stringify({ type: "createAnswer", sdp: message.sdp }));
  //   }
  //   if (message.type === "iceCandidate") {
  //     user?.send(
  //       JSON.stringify({ type: "iceCandidate", candidate: message.candidate })
  //     );
  //   }
  // });
  //TIll
  // ws.on("close", () => {
  //   user?.send(JSON.stringify({ message: "WS user disconnected" }));
  //   user = null;
  // });

  // user.on("close", () => {
  //   ws?.send(JSON.stringify({ message: "User disconnected" }));
  //   user = null;
  // });

  // user.send(JSON.stringify({ type: 'createOffer' }));
  // user.send("Paired successful!");
});
