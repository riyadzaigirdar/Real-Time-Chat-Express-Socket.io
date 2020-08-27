const chatForm = document.getElementById("chat-form");
const messagesDiv = document.getElementsByClassName("chat-messages")[0];
const roomDom = document.getElementById("room-name");
const usersDom = document.getElementById("users");
const socket = io();

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinroom", { username, room });

socket.on("message", ({ username, message, date }) => {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<p class="meta">
      ${username} <span>${date}</span>
    </p>
    <p class="text">
    ${message}
    </p>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on("getUsersAndRoom", ({ inRoom, users }) => {
  showRoom(inRoom);
  showUsers(users);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  document.getElementById("msg").focus();
});

function showRoom(value) {
  roomDom.innerHTML = value;
}

function showUsers(users) {
  let html = "";
  users.map((user) => (html = html.concat(`<li> ${user.username}</li>`)));
  console.log(html);
  usersDom.innerHTML = html;
}
