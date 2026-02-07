from uuid import uuid4
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
from flask_cors import CORS  
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

app = Flask(__name__)
CORS(app, supports_credentials=True)  

app.secret_key = 'Your_Secret_Key'

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:Password@localhost/dbname'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)

with app.app_context():
    db.create_all()

class Feedbacks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    service = db.Column(db.String(100))
    title = db.Column(db.String(100))
    body = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.datetime.now)
    email = db.Column(db.String(200))

    def __init__(self, title, body, service, email):
        self.title = title
        self.body = body
        self.service = service
        self.email = email

class FeedbackSchema(ma.Schema):
    class Meta:
        fields = ('id', 'service', 'title', 'body', 'date', 'email')

feedback_schema = FeedbackSchema()
feedbacks_schema = FeedbackSchema(many=True)  

@app.route('/get', methods=['GET'])
def get_feedback():
    all_feedbacks = Feedbacks.query.all()
    results = feedbacks_schema.dump(all_feedbacks)  
    return jsonify(results)

@app.route('/get/<id>/', methods=['GET'])
def post_feedback(id):
    feedback = Feedbacks.query.get(id)
    return feedback_schema.jsonify(feedback)

@app.route('/post', methods=['POST'])
def add_feedback():
    title = request.json['title']
    body = request.json['body']
    service = request.json['service']
    email = request.json['email']
    feedback = Feedbacks(title, body, service,email)
    db.session.add(feedback)
    db.session.commit()
    return feedback_schema.jsonify(feedback)

@app.route('/update/<id>/', methods=['PUT'])
def update_feedback(id):
    feedback = Feedbacks.query.get(id)
    if not feedback:
        return jsonify({"message": "Feedback not found"}), 404
    
    title = request.json.get('title', feedback.title) 
    body = request.json.get('body', feedback.body)
    service = request.json.get('service', feedback.service)
    email = request.json.get('email', feedback.email)  
    
    users_role = session.get('role')

    feedback.title = title
    feedback.body = body
    feedback.service = service
    feedback.email = email 
    
    if users_role == "owner":
        feedbacks = Feedbacks.query.all()
    else:
        feedbacks = Feedbacks.query.filter_by(email=email).all()

    if not feedbacks:
        return jsonify({"message": "No orders found for this email"}), 404
        
    db.session.commit()
    return feedback_schema.jsonify(feedback)


@app.route('/delete/<id>/', methods=['DELETE'])
def delete_feedback(id):
    feedback = Feedbacks.query.get(id)
    if not feedback:
        return jsonify({"message": "Feedback not found"}), 404

    users_role = session.get('role')
    users_email = session.get('email')  
    
    if users_role != "owner" and feedback.email != users_email:
        return jsonify({"message": "You do not have permission to delete this feedback."}), 403

    db.session.delete(feedback)
    db.session.commit()
    return feedback_schema.jsonify(feedback)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='customer') 

    def __init__(self, email, password, role="customer"):
        self.email = email
        self.password = password
        self.role = role

class AccountSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True  

account_schema = AccountSchema()
accounts_schema = AccountSchema(many=True)

@app.route('/signup', methods=['POST'])
def post_accounts():
    email = request.json['email']
    password = request.json['password']

    user_exists = User.query.filter_by(email=email).first()
    if user_exists:
        return jsonify({"error": "Email is already registered, please log in"}), 409 

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    if email == "owner@example.com":
        role = "owner"
    else:
        role = "customer"

    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return account_schema.jsonify(new_user), 201  

@app.route('/login', methods=['POST'])
def post_user():
    try:
        email = request.json.get("email")
        password = request.json.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify({"error": "Unauthorized Access"}), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401

        session['user_id'] = user.id
        session['email'] = user.email
        session['role'] = user.role

        return jsonify({"message": "Login successful", "email": user.email, "role":user.role}), 200
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(100))
    time = db.Column(db.String(200))
    name = db.Column(db.String(200))
    email = db.Column(db.String(200))
    service = db.Column(db.String(200))
    address = db.Column(db.String(300))
    status = db.Column(db.String(30), default ="On-Going")

    def __init__(self, date, time, name, email, service, address, status="On-Going"):
        self.date = date
        self.time = time
        self.name = name
        self.email = email
        self.service = service
        self.address = address
        self.status = status

    def to_dict(self):
        return {
            "id": self.id,
            "date": self.date,
            "time": self.time,
            "name": self.name,
            "email": self.email,
            "service": self.service,
            "address": self.address,
            "status": self.status
        }

class OrderSchema(ma.Schema):
    class Meta:
        fields = ('id', 'date', 'time', 'name', 'email', 'service', 'address', 'status')

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)  

@app.route('/orders', methods=['GET'])
def get_orders():
    try:
        user_email = session.get('email')
        user_role = session.get('role')

        if not user_email:
            return jsonify({"error": "You need to log in to view your orders"}), 401
        
        if user_role == "owner":
            orders = Orders.query.all()
        else:
            orders = Orders.query.filter_by(email=user_email).all()

        if not orders:
            return jsonify({"message": "No orders found for this email"}), 404
        
        orders_data = [order.to_dict() for order in orders]
        response = {
            "user_role": user_role,
            "orders": orders_data,
        }
        

        return jsonify(response), 200  
        

    except Exception as e:
        print(f"Error fetching orders: {e}")  
        return jsonify({"error": "An internal server error occurred"}), 500



@app.route('/ordering', methods=['POST'])
def add_order():
    data = request.get_json()

    required_fields = ['date', 'time', 'name', 'email', 'service', 'address']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    date = data['date']
    time = data['time']
    name = data['name']
    email = data['email']
    service = data['service']
    address = data['address']

    order = Orders(date, time, name, email, service, address)
    db.session.add(order)
    db.session.commit()

    return order_schema.jsonify(order), 201


@app.route('/change/<id>/', methods=['PUT'])
def update_order(id):
    order = Orders.query.get(id)
    role = session.get('role')
    date = request.json['date']
    time = request.json['time']
    name = request.json['name']
    email = request.json['email']
    status = request.json['status']
    service = request.json['service']
    address = request.json['address']
    order.date = date
    order.time = time
    order.name = name
    order.email = email
    order.service = service
    order.address = address
    order.status = status
    order.role = role

    db.session.commit()
    return order_schema.jsonify(order)

@app.route('/cancel/<id>/', methods=['DELETE'])
def order_delete(id):
    order = Orders.query.get(id)
    db.session.delete(order)
    db.session.commit()
    return order_schema.jsonify(order)

bcrypt = Bcrypt(app)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)  
