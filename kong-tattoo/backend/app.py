import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for the React app on port 3000
CORS(app, resources={r"/api/*": {"origins": "*"}})

BOOKINGS_FILE = 'bookings.json'
USERS_FILE = 'users.json'

def init_db():
    if not os.path.exists(BOOKINGS_FILE):
        with open(BOOKINGS_FILE, 'w') as f:
            json.dump([], f)
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            json.dump([], f)

@app.route('/api/book', methods=['POST'])
def book_appointment():
    try:
        data = request.get_json()
        
        name = data.get('name')
        email = data.get('email')
        date = data.get('date')
        time = data.get('time')
        message = data.get('message', '')

        if not name or not email or not date or not time:
            return jsonify({"error": "Missing required fields"}), 400

        # Check operating hours
        if time < "10:00" or time > "19:00":
            return jsonify({"error": "Appointments are only available between 10:00 AM and 7:00 PM"}), 400

        # Read existing bookings
        with open(BOOKINGS_FILE, 'r') as f:
            bookings = json.load(f)

        # Check daily limits and exact time collisions
        daily_bookings = [b for b in bookings if b.get('date') == date]
        
        if len(daily_bookings) >= 5:
            return jsonify({"error": "Only 5 appointments allowed per day"}), 400
            
        for b in daily_bookings:
            if b.get('time') == time:
                return jsonify({"error": "appointment already exit try another date or time"}), 400

        # Append new booking
        new_booking = {
            "name": name,
            "email": email,
            "date": date,
            "time": time,
            "message": message,
            "status": "Active",
            "username": data.get("username", "")
        }
        bookings.append(new_booking)

        # Write back to file
        with open(BOOKINGS_FILE, 'w') as f:
            json.dump(bookings, f, indent=4)

        return jsonify({"success": True, "message": "Booking received successfully"}), 201

    except Exception as e:
        print(f"Error handling booking: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
             return jsonify({"error": "Missing credentials"}), 400
        
        with open(USERS_FILE, 'r') as f:
             users = json.load(f)
             
        for u in users:
            if u.get('username') == username:
                 return jsonify({"error": "Username already exists"}), 400
                 
        users.append({"username": username, "password": password})
        with open(USERS_FILE, 'w') as f:
             json.dump(users, f, indent=4)
             
        return jsonify({"success": True}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if username == 'kong@gmail.com' and password == 'Kong@2026':
            return jsonify({"success": True, "role": "artist", "username": username})
            
        with open(USERS_FILE, 'r') as f:
             users = json.load(f)
             
        for u in users:
             if u.get('username') == username and u.get('password') == password:
                 return jsonify({"success": True, "role": "customer", "username": username})
                 
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    try:
        # In a real app we would clear server-side session here
        return jsonify({"success": True, "message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        with open(BOOKINGS_FILE, 'r') as f:
             bookings = json.load(f)
        return jsonify({"bookings": bookings})
    except Exception as e:
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/bookings', methods=['DELETE'])
def delete_booking():
    try:
        data = request.get_json()
        email = data.get('email')
        date = data.get('date')
        time = data.get('time')
        
        if not email or not date or not time:
            return jsonify({"error": "Missing booking details"}), 400

        with open(BOOKINGS_FILE, 'r') as f:
            bookings = json.load(f)

        initial_len = len(bookings)
        filtered = [b for b in bookings if not (b.get('email') == email and b.get('date') == date and b.get('time') == time)]

        if len(filtered) == initial_len:
            return jsonify({"error": "Booking not found"}), 404

        with open(BOOKINGS_FILE, 'w') as f:
            json.dump(filtered, f, indent=4)

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/bookings/cancel', methods=['POST'])
def cancel_booking():
    try:
        data = request.get_json()
        email = data.get('email')
        date = data.get('date')
        time = data.get('time')
        
        with open(BOOKINGS_FILE, 'r') as f:
            bookings = json.load(f)

        for b in bookings:
            if b.get('email') == email and b.get('date') == date and b.get('time') == time:
                b['status'] = 'Cancelled'
                break

        with open(BOOKINGS_FILE, 'w') as f:
            json.dump(bookings, f, indent=4)

        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        username = data.get('username')
        new_password = data.get('password')
        
        if not username or not new_password:
             return jsonify({"error": "Missing input"}), 400
             
        with open(USERS_FILE, 'r') as f:
             users = json.load(f)
             
        user_found = False
        for u in users:
             if u.get('username') == username:
                  u['password'] = new_password
                  user_found = True
                  break
                  
        if not user_found:
             return jsonify({"error": "Email not found"}), 404
             
        with open(USERS_FILE, 'w') as f:
             json.dump(users, f, indent=4)
             
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "Internal Error"}), 500

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    return jsonify([
        { "src": "/images/dragon.png", "alt": "Traditional Dragon", "label": "Traditional Dragon", "link": "https://www.google.com/search?tbm=isch&q=traditional+japanese+dragon+tattoo+designs" },
        { "src": "/images/wolf.png", "alt": "Geometric Wolf", "label": "Geometric Wolf", "link": "https://www.google.com/search?tbm=isch&q=geometric+wolf+tattoo+designs" },
        { "src": "/images/floral.png", "alt": "Watercolor Floral", "label": "Watercolor Floral", "link": "https://www.google.com/search?tbm=isch&q=watercolor+floral+tattoo+designs" },
        { "src": "/images/planet.png", "alt": "Minimalist Planet", "label": "Minimalist Planet", "link": "https://www.google.com/search?tbm=isch&q=minimalist+planet+tattoo+designs" },
        { "src": "/images/tiger.png", "alt": "Neo-traditional Tiger", "label": "Neo-traditional Tiger", "link": "https://www.google.com/search?tbm=isch&q=neo+traditional+tiger+tattoo+designs" },
        { "src": "/images/mandala.png", "alt": "Ornamental Mandala", "label": "Ornamental Mandala", "link": "https://www.google.com/search?tbm=isch&q=ornamental+mandala+tattoo+designs" }
    ])

@app.route('/api/about', methods=['GET'])
def get_about():
    return jsonify({
        "title": "About Us",
        "description": "Kong Tattoo Studio delivers high-quality tattoos with professional artists and unique designs. We specialize in custom ink that tells your story with precision and artistry."
    })

if __name__ == '__main__':
    init_db()
    print("Backend server starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
