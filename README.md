# 🛡️ RTO Shield

A serverless AWS application that analyzes Cash-on-Delivery (COD) orders and uses historical customer and pincode delivery data to identify potential Return-to-Origin (RTO) risk.

## 🚀 Problem

Return-to-Origin (RTO) orders create shipping, reverse-logistics, inventory, and operational costs for e-commerce businesses.

RTO Shield provides an early warning before a COD order is shipped by checking available delivery history and generating an explainable risk assessment.

## 💡 How It Works

The user enters:

* Customer name
* Phone number
* Order value
* Delivery address
* Delivery pincode

RTO Shield then:

1. Checks for individual customer history in DynamoDB.
2. If customer history is unavailable, checks pincode history.
3. Calculates a risk score from 0–100.
4. Returns LOW, MEDIUM, HIGH, or UNKNOWN.
5. Shows the factors contributing to the result.
6. Returns UNKNOWN when historical data is unavailable instead of making an unsupported assessment.

## 🏗️ Architecture

```text
Frontend
   │
   ▼
AWS Lambda Function URL
   │
   ▼
AWS Lambda
   │
   ▼
Amazon DynamoDB
   │
   ▼
Risk Scoring Engine
   │
   ▼
Risk Assessment
   │
   ▼
Frontend
```

## ☁️ AWS Services Used

### AWS Lambda

Runs the backend risk-analysis and scoring logic.

### AWS Lambda Function URL

Provides the HTTP endpoint used by the frontend.

### Amazon DynamoDB

Stores synthetic customer and pincode delivery-history data.

### AWS IAM

Controls permissions for Lambda access to DynamoDB.

### Amazon CloudWatch

Used for Lambda logging and debugging.

## 📊 Risk Scoring

The prototype uses an explainable rule-based scoring system.

Customer history can contribute points based on:

* Previous failed deliveries
* Previous RTOs
* Address-related history
* Order value

When customer history is unavailable, pincode-level historical rates are used as indicators.

The system calculates:

```text
Failed-delivery rate = Failed deliveries / Total orders

RTO rate = RTO count / Total orders
```

The final result is classified as:

| Score              | Risk Level |
| ------------------ | ---------- |
| 0–39               | LOW        |
| 40–69              | MEDIUM     |
| 70–100             | HIGH       |
| No historical data | UNKNOWN    |

## 🔎 Example

A pincode with:

* 100 historical orders
* 8 failed deliveries
* 5 RTOs

has:

* 8% failed-delivery rate
* 5% RTO rate

Combined with the order value, these signals can contribute to the final risk score.

## 🧪 Testing

The application was tested using synthetic delivery-history data.

Example outcomes include:

```text
40/100 → MEDIUM
70/100 → HIGH
No history → UNKNOWN
```

The application was tested end-to-end:

```text
Frontend → Lambda → DynamoDB → Risk calculation → Frontend
```

## 🔐 Data

All historical data used in the demonstration is synthetic.

No real customer information is used.

## 🛠️ Project Structure

```text
RTO-Shield/
├── backend/
│   ├── app.py
│   └── scorer.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

## 🔮 Future Improvements

Possible future improvements include:

* Larger historical datasets
* More advanced statistical or machine-learning models
* Time-based delivery trends
* Improved customer identity matching
* Additional address-quality signals
* Seller analytics dashboards
* Historical risk tracking
* Integration with e-commerce order-management systems

## 👨‍💻 Author

Built as a solo AWS hackathon project by **Vagish Apande**.

## 📄 License

This project is intended as a hackathon prototype.
