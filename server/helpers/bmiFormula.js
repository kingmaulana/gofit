function calculateBMI(weight, height) {
    if (weight <= 0 || height <= 0) {
        return "Invalid input. Weight and height must be positive numbers.";
    }

    // BMI formula: weight (kg) / (height (m) * height (m))
    const bmi = weight / (height * height);
    
    // Determine the BMI category
    let category = "";
    let weightToChange = 0;
    if (bmi < 18.5) {
        category = "Underweight";
        weightToChange = 18.5 * (height * height) - weight; // Calculate how much weight is needed to reach 18.5
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
        weightToChange = 0; // No need to change weight
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        weightToChange = weight - 24.9 * (height * height); // Calculate how much weight to lose to reach 24.9
    } else {
        category = "Obesity";
        weightToChange = weight - 24.9 * (height * height); // Calculate how much weight to lose to reach 24.9
    }

    // Return the BMI, category, and weight change recommendation
    return {
        bmi: bmi.toFixed(2),
        category: category,
        weightToChange: weightToChange.toFixed(2)
    };
}

// Example usage:
// const result = calculateBMI(70, 1.75); // weight: 70kg, height: 1.75m
// if (result.weightToChange !== "0.00") {
//     console.log(`BMI: ${result.bmi}, Category: ${result.category}. You need to ${result.weightToChange > 0 ? `gain ${result.weightToChange} kg` : `lose ${Math.abs(result.weightToChange)} kg`} to be in the normal weight range.`);
// } else {
//     console.log(`BMI: ${result.bmi}, Category: ${result.category}. You are already in the normal weight range.`);
// }


module.exports = {calculateBMI};

// Example usage:
// const result = calculateBMI(70, 1.75); // weight: 70kg, height: 1.75m
// console.log(`BMI: ${result.bmi}, Category: ${result.category}`);