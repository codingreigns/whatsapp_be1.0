let onlineUsers = [];

export default function (socket, io) {
  // user joins or open the app
  socket.on("join", (user) => {
    socket.join(user);
    // join users to online users
    if (!onlineUsers.some((u) => u.userId === user)) {
      onlineUsers.push({ userId: user, socketId: socket.id });
    }
    // send online users to client
    io.emit("online users", onlineUsers);
  });
  // disconnected or offline user
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("online users", onlineUsers);
  });
  //   join conversation room
  socket.on("join conversation", (conversation) => {
    socket.join(conversation);
  });
  //   send and receive messages
  socket.on("send message", (message) => {
    let conversation = message.conversation;
    if (!conversation.users) return;
    conversation.users.forEach((user) => {
      if (user._id === message.sender._id) return;
      socket.in(user._id).emit("receive message", message);
    });
  });
  // typing
  socket.on("typing", (conversation) => {
    socket.in(conversation).emit("typing", conversation);
  });
  socket.on("stop typing", (conversation) => {
    socket.in(conversation).emit("stop typing");
  });
  // test
  // socket.on("test ping", () => {
  //   socket.emit("test pong", { time: new Date().toISOString() });
  // });
}
