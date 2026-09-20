
const form = document.getElementById("riskForm");
const emptyState = document.getElementById("emptyState");
const resultContent = document.getElementById("resultContent");

const LAMBDA_URL =
    "https://hxtxr2p752a46gqvnvvnw5fuvq0kzkxu.lambda-url.us-east-1.on.aws/";

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const order = {
        customer_name: document.getElementById("customerName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        pincode: document.getElementById("pincode").value.trim(),
        order_value: Number(document.getElementById("orderValue").value)
    };

    try {
        const response = await fetch(LAMBDA_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        console.log("AWS Lambda response:", data);

        displayResult(data);

    } catch (error) {
        console.error("AWS Lambda error:", error);
        alert("Unable to connect to AWS Lambda. Please try again.");
    }
});


function displayResult(result) {

    emptyState.style.display = "none";
    resultContent.style.display = "block";

    document.getElementById("score").textContent = result.score;
    document.getElementById("riskLevel").textContent = result.level;

    document.getElementById("recommendation").textContent =
        result.recommendation;


    // Display risk reasons
    const reasonsList = document.getElementById("reasons");

    reasonsList.innerHTML = "";

    if (!result.reasons || result.reasons.length === 0) {

        const li = document.createElement("li");

        li.textContent = "No major risk factors detected";

        reasonsList.appendChild(li);

    } else {

        result.reasons.forEach(reason => {

            const li = document.createElement("li");

            li.textContent = reason;

            reasonsList.appendChild(li);

        });

    }


    // Display history source
    let databaseStatus =
        document.getElementById("databaseStatus");

    if (!databaseStatus) {

        databaseStatus = document.createElement("p");

        databaseStatus.id = "databaseStatus";

        databaseStatus.style.marginTop = "15px";

        databaseStatus.style.fontWeight = "600";

        resultContent.appendChild(databaseStatus);
    }


    if (result.history_source === "CUSTOMER") {

        databaseStatus.textContent =
            "✓ Customer history found in DynamoDB";

        databaseStatus.style.color = "#16a34a";

    } else if (result.history_source === "PINCODE") {

        databaseStatus.textContent =
            "✓ Pincode history found in DynamoDB";

        databaseStatus.style.color = "#16a34a";

    } else {

        databaseStatus.textContent =
            "⚠ No historical data available";

        databaseStatus.style.color = "#d97706";
    }


    // Risk styling
    const riskLabel =
        document.getElementById("riskLevel");

    const scoreCircle =
        document.querySelector(".score-circle");


    if (result.level === "HIGH") {

        riskLabel.style.background = "#fee2e2";
        riskLabel.style.color = "#dc2626";
        scoreCircle.style.borderColor = "#dc2626";

    } else if (result.level === "MEDIUM") {

        riskLabel.style.background = "#fef3c7";
        riskLabel.style.color = "#d97706";
        scoreCircle.style.borderColor = "#d97706";

    } else if (result.level === "LOW") {

        riskLabel.style.background = "#dcfce7";
        riskLabel.style.color = "#16a34a";
        scoreCircle.style.borderColor = "#16a34a";

    } else {

        riskLabel.style.background = "#f3f4f6";
        riskLabel.style.color = "#6b7280";
        scoreCircle.style.borderColor = "#6b7280";
    }
}
