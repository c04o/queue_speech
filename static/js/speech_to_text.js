let isListening = false;
let activeButton = null;

window.addEventListener("DOMContentLoaded", () => {
    const recognizer = instantiateRecognizer();

    // Handle the name input microphone button
    document.getElementById("microphone_name").addEventListener("click", () => {
        startSpeechRecognition(recognizer, "nameInput", "microphone_name");
    });
});

function instantiateRecognizer() {
    const recognizer = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    if (!recognizer) {
        alert("El reconocimiento de voz no es compatible con este navegador. Usa Chrome o Edge.");
        return;
    }
    recognizer.lang = "es-NI";
    recognizer.continuous = false;
    return recognizer;
}

async function startSpeechRecognition(recognizer, inputId, triggerButtonId) {
    const button = document.getElementById(triggerButtonId);
    const input = document.getElementById(inputId);

    const toggleButtonStyle = (btn, listening) => {
        btn.classList.toggle("btn-primary", !listening);
        btn.classList.toggle("btn-danger", listening);
        btn.innerHTML = listening
            ? '<i class="fa-solid fa-microphone me-2"></i>Grabando...'
            : '<i class="fa-solid fa-microphone me-2"></i>Grabar';
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

    return new Promise((resolve, reject) => {
        toggleButtonStyle(button, true);

        recognizer.onresult = e => {
            for (let i = e.resultIndex; i < e.results.length; i++) {
                let transcript = e.results[i][0].transcript.trim();
                if (transcript.endsWith('.')) {
                    transcript = transcript.slice(0, -1);
                }
                input.value = transcript;
                // Auto-submit the form
                document.getElementById("nameForm").submit();
            }
        };

        recognizer.onerror = e => {
            console.error("Speech recognition error:", e.error);
            toggleButtonStyle(button, false);
            isListening = false;
            activeButton = null;
            alert("Error en el reconocimiento de voz: " + e.error);
            reject(e);
        };

        recognizer.onstart = () => {
            isListening = true;
            activeButton = button;
        };

        recognizer.onend = () => {
            toggleButtonStyle(button, false);
            isListening = false;
            activeButton = null;
        };

        recognizer.start();
    });
}