from flask import Flask, render_template, request, redirect, url_for
from queue import Queue

app = Flask(__name__)
name_queue = Queue()

@app.route('/')
def index():
    return redirect(url_for('record'))

@app.route('/record')
def record():
    next_name = name_queue.peek()
    return render_template('record.html', names=name_queue.items, next_name=next_name)

@app.route('/attend')
def attend():
    next_name = name_queue.peek()
    return render_template('attend.html', names=name_queue.items, next_name=next_name)

@app.route('/add', methods=['POST'])
def add_name():
    name = request.form.get('name', '').strip()
    if name:
        name_queue.enqueue(name)
    return redirect(url_for('record'))

@app.route('/process', methods=['POST'])
def process_name():
    if not name_queue.is_empty():
        name_queue.dequeue()
    return redirect(url_for('attend'))

if __name__ == '__main__':
    app.run(debug=True)