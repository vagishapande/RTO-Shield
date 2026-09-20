def calculate_risk(order):
    score = 0
    reasons = []

    failed_orders = order.get("failed_orders", 0)

    if failed_orders >= 3:
        score += 35
        reasons.append("Multiple previous failed deliveries")
    elif failed_orders >= 1:
        score += 20
        reasons.append("Previous failed delivery")

    rto_count = order.get("rto_count", 0)

    if rto_count >= 3:
        score += 25
        reasons.append("High number of previous RTOs")
    elif rto_count >= 1:
        score += 15
        reasons.append("Previous RTO recorded")

    order_value = order.get("order_value", 0)

    if order_value >= 5000:
        score += 20
        reasons.append("High-value COD order")
    elif order_value >= 2500:
        score += 10
        reasons.append("Moderately high order value")

    address_flags = order.get("address_flags", 0)

    if address_flags >= 2:
        score += 20
        reasons.append("Address associated with multiple failed orders")
    elif address_flags == 1:
        score += 10
        reasons.append("Address has a previous issue")

    score = min(score, 100)

    if score >= 70:
        level = "HIGH"
        recommendation = "VERIFY CUSTOMER BEFORE SHIPPING"
    elif score >= 40:
        level = "MEDIUM"
        recommendation = "CONSIDER CUSTOMER VERIFICATION"
    else:
        level = "LOW"
        recommendation = "SAFE TO PROCESS"

    return {
        "score": score,
        "level": level,
        "reasons": reasons,
        "recommendation": recommendation
    }