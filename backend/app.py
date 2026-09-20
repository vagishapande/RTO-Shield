from flask import Flask, request, jsonify
from flask_cors import CORS
from scorer import calculate_risk
from datetime import datetime

app = Flask(__name__)
CORS(app)

orders = []
outcomes = []


@app.route("/")
def home():
    return jsonify({
        "message": "RTO Shield API is running",
        "status": "success"
    })


@app.route("/score", methods=["POST"])
def score_order():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No order data provided"
        }), 400

    result = calculate_risk(data)

    order = {
        "customer_name": data.get("customer_name", "Unknown"),
        "order_value": data.get("order_value", 0),
        "risk_score": result["score"],
        "risk_level": result["level"],
        "recommendation": result["recommendation"],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    orders.append(order)

    return jsonify({
        "success": True,
        "result": result,
        "order": order
    })


@app.route("/outcome", methods=["POST"])
def record_outcome():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No outcome data provided"
        }), 400

    outcome = {
        "customer_name": data.get("customer_name", "Unknown"),
        "order_id": data.get("order_id", "Unknown"),
        "outcome": data.get("outcome", "Unknown"),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    outcomes.append(outcome)

    return jsonify({
        "success": True,
        "message": "Order outcome recorded",
        "outcome": outcome
    })


@app.route("/stats", methods=["GET"])
def get_stats():

    total = len(orders)

    high = sum(
        1 for order in orders
        if order["risk_level"] == "HIGH"
    )

    medium = sum(
        1 for order in orders
        if order["risk_level"] == "MEDIUM"
    )

    low = sum(
        1 for order in orders
        if order["risk_level"] == "LOW"
    )

    return jsonify({
        "total_orders": total,
        "high_risk": high,
        "medium_risk": medium,
        "low_risk": low,
        "orders": orders,
        "outcomes": outcomes
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)