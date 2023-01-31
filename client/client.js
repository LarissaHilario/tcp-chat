const net= require('net');



const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const nickName = new Promise(resolve => {
    readLine.question('Ingresa tu nickname para entrar al servidor: ', (res) => {
        resolve(res);
    });
});

nickName.then((nickname ) => {
    
    const socket= net.connect({ port:4000,
        host: '192.168.1.73'})

    readLine.on('line', data => {
        if (data === 'salir') {
            socket.write(nickname+' ha abandonado el chat');
            socket.setTimeout(5000);
        } else {
            socket.write(nickname+ ': ' + data);
        }
    });

    
   
    socket.on('connect', () => {
        socket.write(nickname + ' ha ingresado al chat');
        
    });

    socket.on('data', data => {
        console.log(data.toString().trim()+"\x1b[37m"); 
    });

    socket.on('timeout', () => {
        socket.write('quit');
        socket.end();
    });

    socket.on('end', () => {
        process.exit();
    });

    socket.on('error', () => {
        console.log('Ha ocurrido un error en el servidor');
        process.exit();
    });
});