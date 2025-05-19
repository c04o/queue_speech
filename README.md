# ☝️ Requirements
- Python 3.8 or higher
> [!TIP]
> Verify by running `python3 --version` (Linux/macOS), or `py --version` (Windows)
- A Chromium-based browser
> [!NOTE]
> Non-Chromium-based browsers may not be fully-compatible with the `speech_to_text.js` script

> [!WARNING]
> Brave may not work due to its default feature-blocking settings. To use Brave, disable Brave Shields for the app's URL
  
# 🚀 Installation
## Clone this repository
Run this in your project directory:
```shell
git clone https://github.com/c04o/queue_speech.git
```
> [!NOTE]
> If cloning fails, download the repository as a ZIP from GitHub
## Set up and activate a virtual enviroment
Create and activate a virtual environment:
- 🐧 Linux/macOS
```shell
python3 -m venv .venv
. .venv/bin/activate
```
- 🪟 Windows
```shell
py -3 -m venv .venv
.venv\Scripts\activate
```
> [!WARNING]
> On Windows, PowerShell's execution policy may prevent activation. Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` as administrator and try again

> [!NOTE]
> To reactivate the environment later, run only the activation command (`. .venv/bin/activate` or `.venv\Scripts\activate`) 
## Install requirements
With the virtual environment activated, update pip and install dependencies:
```shell
pip install --upgrade pip
pip install -r requirements.txt
```
> [!IMPORTANT]
> Requirements' dependencies may vary depending your OS
## Run the app
- 🐧 Linux/macOS

Run while the VENV is activated:
```shell
python3 app.py
```
- 🪟 Windows

Run while the VENV is activated:
```shell
py app.py
```
## Use the app
The terminal should show output like this, indicating the server is running:
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 122-553-431
```
Open `http://127.0.0.1:5000` in a Chromium-based browser
> [!WARNING]
> Brave may not work unless you disable Brave Shields for this URL. The app will load a web interface where you can manage speech queues or process text. The interface relies on a script that uses Chromium-specific APIs.
