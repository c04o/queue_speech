from flask import Flask, render_template, request, redirect, url_for
from truck_queue import Queue
import datetime

app = Flask(__name__)
truck_queue = Queue()
products = ["Arroz", "Frijoles", "Aceite", "Gaseosas"]

@app.route('/')
def index():
    next_truck = truck_queue.peek()
    return render_template('queue.html', trucks=truck_queue.items, next_truck=next_truck, products=products)

@app.route('/add', methods=['POST'])
def add_truck():
    license = request.form.get('license')
    product = request.form.get('product')
    driver = request.form.get('driver')
    company = request.form.get('company')
    if license and product and driver and company:
        arrival_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        truck = {
            "license": license,
            "product": product,
            "driver": driver,
            "company": company,
            "arrival_time": arrival_time
        }
        truck_queue.enqueue(truck)
    return redirect(url_for('index'))

@app.route('/process', methods=['POST'])
def process_truck():
    truck_queue.dequeue()
    return redirect(url_for('index'))

# Se retornan los productos como un diccionario parseable a json
# (JAVASCRIPT OBJECT NOTATION) = Notación de objetos de js
# con la clave products.
@app.route('/api/product_list')
def get_product_list():
    return { "products": products }

if __name__ == '__main__':
    app.run(debug=True)