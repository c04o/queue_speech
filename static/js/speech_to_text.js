let isListening = false;
let activeButton = null;

window.addEventListener("DOMContentLoaded", () => {
    const recognizer = instantiateRecognizer();
    if (!recognizer) return; // Exit if recognizer fails to initialize

    // Handle the name input microphone button
    const micButton = document.getElementById("microphone_name");
    if (micButton) {
        micButton.addEventListener("click", () => {
            if (isListening) {
                recognizer.stop();
            } else {
                startSpeechRecognition(recognizer, "nameInput", "microphone_name");
            }
        });
    } else {
        console.error("Microphone button not found");
    }

    // Handle the attend button
    const attendButton = document.getElementById("attendButton");
    if (attendButton) {
        attendButton.addEventListener("click", async (e) => {
            e.preventDefault(); // Prevent form submission
            try {
                const response = await fetch('/process', {
                    method: 'POST'
                });
                const data = await response.json();
                if (data.status === 'success') {
                    speak(`${data.name} atendido`);
                    window.location.reload(); // Reload to update queue
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al atender nombre');
            }
        });
    }
});

function instantiateRecognizer() {
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("El reconocimiento de voz no es compatible con este navegador. Usa Chrome o Edge.");
            return null;
        }
        const recognizer = new SpeechRecognition();
        recognizer.lang = "es-NI";
        recognizer.continuous = false;
        return recognizer;
    } catch (error) {
        console.error("Error initializing recognizer:", error);
        alert("Error al inicializar el reconocimiento de voz.");
        return null;
    }
}

async function startSpeechRecognition(recognizer, inputId, triggerButtonId) {
    const button = document.getElementById(triggerButtonId);
    const input = document.getElementById(inputId);

    if (!button || !input) {
        console.error("Button or input not found");
        return;
    }

    const toggleButtonStyle = (btn, listening) => {
        btn.classList.toggle("btn-primary", !listening);
        btn.classList.toggle("btn-danger", listening);
        btn.innerHTML = listening
            ? '<i class="fa-solid fa-microphone me-2"></i>Grabando...'
            : '<i class="fa-solid fa-microphone me-2"></i>Grabar';
    };

    if (isListening && triggerButtonId === activeButton?.id) {
        toggleButtonStyle(button, false);
        recognizer.stop();
        return;
    }

    toggleButtonStyle(button, true);

    recognizer.onresult = async e => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
            let transcript = e.results[i][0].transcript.trim();
            if (transcript.endsWith('.')) {
                transcript = transcript.slice(0, -1);
            }
            input.value = transcript;
            const form = document.getElementById("nameForm");
            if (!form) {
                console.error("Form not found");
                return;
            }
            const formData = new FormData(form);
            try {
                const response = await fetch('/add', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.status === 'success') {
                    speak(`${data.name} agregado a la cola`);
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al agregar nombre');
            }
        }
    };

    recognizer.onerror = e => {
        console.error("Speech recognition error:", e.error);
        toggleButtonStyle(button, false);
        isListening = false;
        activeButton = null;
        alert("Error en el reconocimiento de voz: " + e.error);
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

    try {
        recognizer.start();
    } catch (error) {
        console.error("Error starting recognition:", error);
        toggleButtonStyle(button, false);
        isListening = false;
        activeButton = null;
        alert("Error al iniciar el reconocimiento de voz.");
    }
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-NI';
        speechSynthesis.speak(utterance);
    } else {
        console.warn('SpeechSynthesis no es compatible en este navegador.');
    }
}