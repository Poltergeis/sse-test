import express from "express";
import cors from "cors";
import signale from "signale";//console.log decorado
import http from "http";

const corsOptions = {//opciones del cors, no es estrictamente necesario
    origin: '*'
}

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

const server = http.createServer(app);

const clientes = [];//este array guarda todos los clientes sin distincion

app.get('/events', function (req, res) {//aqui se reciben las nuevas conexiones, aqui es a donde apunta:
    //                                                                const source = new EventSource('http://localhost:9000/events');
    res.setHeader("Content-Type", "text/event-stream");//estas tres lineas aprendelas, son importantes, establece las respuestas en texto plano
    res.setHeader("Cache-Control", "no cache");//esta, no se que hace
    res.setHeader("Connection", "keep-alive");//tambien esta, mantiene la conexion viva
    
    req.on("close", function () {//termina la conexion cuando el cliente se cierra
        res.end; 
    });
    clientes.push(res);//guarda un nuevo cliente en clientes
});

app.post('/event-mail', function (req, res) {//un post que apunta al evento 'mail'
    const data = req.body;
    for (let cliente of clientes) {
        cliente.write(`event: mail\n`);//aqui dices a que evento vas a enviar la informacion
                                    //en el cliente es el source.addeventlistener('mail',funcionAlgo)
        cliente.write(`data: ${data.mail}\n\n`);//aqui envias la informacion a la que luego accedes con event.data
    }//importante los saltos de linea en event: mail\n y data: algo\n\n
    return res.status(201).send('evento mail enviado');//respuesta que recibe el que hizo el post, solo el que hizo el post
});

app.post('/event-message', function (req, res) {//lo mismo que arriba
    const data = req.body;
    for (let cliente of clientes) {
        cliente.write(`event: message\n`);
        cliente.write(`data: ${data.saludo}\n\n`);//en mail y en message dataa.saludo es una cadena simple
    }
    return res.status(201).send('evento message enviado');
});

app.post('/event-todo', function (req, res) {
    const data = req.body;//supon que req.body es un json { id: 1, message: "hola mundo" } o algo asi
    for (let cliente of clientes) {
        cliente.write(`event: todo\n`);//diriges el evento
        cliente.write(`data: ${JSON.stringify(data)}\n\n`);//cuando vas a enviar un json en lugar de una cadena simple
        //           tienes que llamar a JSON.stringify(tuJson) para enviar tu json como una cadena, solo puedes enviar cadenas en eventos
    }
    return res.status(200).send('todo fue enviado al cliente');
});

const PORT = 9000;

server.listen(PORT, () => {
    signale.success(`servidor escuchando en el puerto: ${PORT}`);
});//rudimentario