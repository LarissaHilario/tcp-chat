import net from "net";
import {networkInterfaces} from 'os'
import kleur from 'kleur';

const users = [];
const users_preference = {};

const port=4000;
let host;

const color1= "\x1b[34m"
const color2="\x1b[35m"

if(networkInterfaces()['Wi-Fi']) //asignación ip
networkInterfaces()['Wi-Fi'].map((network)=>{
    if(network.family==='IPv4'){host=network.address;}
})

if(host==undefined) host='127.0.0.1'




const server = net.createServer((socket) => {
  users.push(socket);

  console.log(socket.remoteAddress);

  if (users_preference[socket.remoteAddress] === undefined) {
    users_preference[socket.remoteAddress]= {
      nickname: socket.remoteAddress,
      color:color1,
    };
  }
  socket.write("Escribe salir para salir del chat");

  console.log(
    "Un usuario nuevo se ha conectado:",
    users_preference[socket.remoteAddress].nickname
  );

  socket.on("data", (data) => {
    const array = data.toString().trim().split(" ");
    if (array[1] == undefined) {
      return;
    }
    
    broadcast(data, socket);
  });

  socket.on("error", (err) => {
    console.log("\x1b[33mUn cliente se ha desconectado\x1b[89m");
  });

  socket.on("close", () => {
    console.log(color2,"Un cliente ha abandonado la sesión");
  });
});

const broadcast = (message, socketSent) => {
  if (
    users_preference[socketSent.remoteAddress].nickname == socketSent.remoteAddress
  ) {
    let array = message.toString().trim().split(" ", 1);
    let name = array[0].replace(":", "");
    users_preference[socketSent.remoteAddress].nickname = name;
  }
  if (message === "salir") {
    const index = sockets.indexOf(socketSent);
    users.splice(index, 1);
  } else {
    users.forEach((socket) => {
      let messageFinal = `${users_preference[socketSent.remoteAddress].color}${message
        .toString()
        .trim()}`;
      if (socket !== socketSent) socket.write(messageFinal);
    });
  }
};



const serverCommands = (raw) => {
  let command = raw.toString().trim().split(" ");

  if (command[0] == "-u") {
    console.table(users_preference);
  } else {
    console.log("No existe el comando");
  }
};

server.on("listening", () => {
  process.stdin.on("data", (data) => {
    serverCommands(data);
  });
});

server.listen(port, host, () => {
  console.log("\x1b[33m Servidor activo en el puerto: \x1b[0m", port, host);
  console.log(" \x1b[33m Escribe -u para ver la lista de usuarios activos \x1b[0m")
});
