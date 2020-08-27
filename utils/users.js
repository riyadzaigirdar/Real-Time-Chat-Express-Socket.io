const users = [];

function joinRoom(id, username, room) {
  const user = {
    id,
    username,
    room,
  };
  users.push(user);
  return user;
}

function getUsersOfRoom(room) {
  const roomUsers = users.filter((user) => user.room === room);
  return roomUsers;
}

function leaveUser(id) {
  const index = users.findIndex((user) => user.id === id);
  const leaved = users.find((user) => user.id === id);
  users.splice(index, 1);
  return leaved;
}

function getUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}

module.exports = {
  joinRoom,
  getUser,
  leaveUser,
  getUsersOfRoom,
};
