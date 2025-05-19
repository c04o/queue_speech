let isListening = false;
let activeButton = null;

window.addEventListener("DOMContentLoaded", () => {
  const recognizer = instantiateRecognizer();

  // Obtén cada uno de los botones de microfono para llamar a la función del habla a
  // texto al obtener un evento de click. Paso como parámetro el id del input.
  document.getElementById("microphone_1").addEventListener("click", () => {
    startSpeechRecognition(recognizer, "license", "microphone_1");
  });

  // Creo una string de gramática para facilitar el reconocimiento de la lista de productos.
  // https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#examples
  let productsGrammar = "";

  // Obtengo el json al llamar a la función y agrego cada producto a la lista de gramática.
  get_product_list()
    .then(result => {
      productsGrammar = `#JSGF V1.0; grammar products; public <products> = ${result.products.join(" | ")} ;`
    });

  document.getElementById("microphone_select").addEventListener("click", () => {
    startSpeechRecognition(recognizer, "product", "microphone_select", productsGrammar);
  });

  document.getElementById("microphone_2").addEventListener("click", () => {
    startSpeechRecognition(recognizer, "driver", "microphone_2");
  });

  document.getElementById("microphone_3").addEventListener("click", () => {
    startSpeechRecognition(recognizer, "company", "microphone_3");
  });
})

// Creo una función asincrona para llamar a una ruta API de mi servidor para obtener
// un diccionario de python con los procutos el cual paso a json.
async function get_product_list() {
  const response = await fetch("/api/product_list")
  const result = await response.json()
  return result
}

// Uso la api nativa de javascript (empoderada por google) para convertir la voz a texto
// https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
// esta solución solo corre en navegadores basdos en chromium. 
// Verificar que ningun elemento de seguridad esté bloqueando la petición, probar en edge o chrome.
function instantiateRecognizer() {
  // Creo un objeto de reconocedor de voz usando webkit para versiones más antiguas.
  const recognizer = new (window.speechRecognition || window.webkitSpeechRecognition)();

  if (!recognizer) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  // Activar para obtener el idioma del navegador, lo he limitado a español nicaragua
  // por la naturaleza de la app y porque mi navegador está en inglés.
  // recognizer.lang = navigator.language;
  recognizer.lang = "es-NI";
  // Detenerse al detectar que se paró de hablar.
  recognizer.continuous = false;

  recognizer.onstart = () => {
    isListening = true;
  };

  recognizer.onabort = () => {
    isListening = false;
    activeButton = null;
    recognizer.grammars = "";
  }

  // Si hay un error lo loggeo.
  recognizer.onerror = e => {
    console.log("Speech recognition error:", e.error);
  };

  return recognizer;
}

async function startSpeechRecognition(recognizer, inputId, triggerButtonId, grammarModifier = "") {
  const button = document.getElementById(triggerButtonId);
  const input = document.getElementById(inputId);

  const toggleButtonStyle = (btn, listening) => {
    btn.classList.toggle("btn-primary", !listening);
    btn.classList.toggle("btn-danger", listening);
  };

  if (isListening && triggerButtonId === activeButton?.id) {
    toggleButtonStyle(button, false);
    recognizer.abort();
    return;
  }

  if (isListening && triggerButtonId !== activeButton?.id) {
    toggleButtonStyle(document.getElementById(activeButton.id), false);
    recognizer.abort();
  }

  // Añadir gramática si aplica
  if (grammarModifier.length !== 0) {
    const speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammarModifier, 1);
    recognizer.grammars = speechRecognitionList;
  }


  return new Promise((resolve, reject) => {
    // Activar botón como "escuchando"
    toggleButtonStyle(button, true);


    // Cuando se tenga un resultado obtengo el id del input y 
    // como es probable que el audio se obtenga por pedacitos 
    // lo meto dentro de un for para obtener toda la transcripción.
    // https://www.youtube.com/shorts/g5L-o3HEVds
    // Algo como en el video, pero como en el video se escucha continuamente
    // no es necesario acceder a un arreglo bidimensional, pues solo hay
    // una grabación.
    recognizer.onresult = e => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        // Aquí es donde obtengo el transcript de cada resultado
        // quitandole los espacios en blanco de por medio.
        const transcript = e.results[i][0].transcript.trim();
        // Remuevo el punto final que se agrega automáticamente.
        input.value = transcript.toString().slice(0, -1);
      }
    };



    recognizer.onerror = (e) => {
      console.error("Speech recognition error:", e.error);

      // Restaurar estado visual
      toggleButtonStyle(button, false);
      isListening = false;
      activeButton = null;

      reject(e);
    };

    recognizer.onstart = () => {
      isListening = true;
      activeButton = button;
    };

    recognizer.onend = () => {
      // onend también puede ocurrir sin resultado (por ejemplo, si el usuario no habla)
      toggleButtonStyle(button, false);
      isListening = false;
      activeButton = null;
    };

    recognizer.start();
  });
}