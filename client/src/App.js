import { useEffect } from "react";

function App() {//cliente, solo este archivo importa para el sse

  useEffect(() => {//si lo vas a hacer en react, metelo en un useEffect para asegurarte de que se monte primero la vista y luego la conexion
    const newEvSRC = new EventSource('http://localhost:9000/events');//aqui se establece la conexion al evento
    
    newEvSRC.addEventListener('mail', function (event) {//si te fijas en la api, en la ruta /event-mail abajo dice:
      //cliente.write(`event: mail\n`); esto significa que la informacion se esta enviando a este listener
      const mail = event.data;
      alert(mail);
    });

    newEvSRC.addEventListener('message', function (event) {//lo mismo de arriba
      const message = event.data;
      alert(message);
    });

    newEvSRC.addEventListener('todo', function (event) {//lo mismo de arriba x2
      const data = JSON.parse(event.data);//cuando recibes el data del evento, se recibe un string, entonces tienes que hacerle un
      //json.parse si quieres acceder a la informacion de un json que le hayas enviado
      alert(data.saludo);
      console.info(data.mail);
    });
  }, []);

  return (
    <div className="App">
        checa consola del navegador{/*nada relevante por aqui*/}
    </div>
  );
}

export default App;
