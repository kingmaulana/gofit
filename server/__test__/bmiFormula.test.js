const { calculateBMI } = require('../helpers/bmiFormula');

describe('BMI Formula', () => {
  describe('calculateBMI function', () => {
    // Test for invalid inputs
    test('should return error message when weight is zero', () => {
      const result = calculateBMI(0, 1.7);
      expect(result).toBe('Invalid input. Weight and height must be positive numbers.');
    });

    test('should return error message when height is zero', () => {
      const result = calculateBMI(70, 0);
      expect(result).toBe('Invalid input. Weight and height must be positive numbers.');
    });

    test('should return error message when weight is negative', () => {
      const result = calculateBMI(-70, 1.7);
      expect(result).toBe('Invalid input. Weight and height must be positive numbers.');
    });

    test('should return error message when height is negative', () => {
      const result = calculateBMI(70, -1.7);
      expect(result).toBe('Invalid input. Weight and height must be positive numbers.');
    });

    // Test for underweight category (BMI < 18.5)
    test('should return underweight category when BMI is less than 18.5', () => {
      // 53kg and 1.75m height gives a BMI of about 17.3 (underweight)
      const result = calculateBMI(53, 1.75);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(17.3, 1);
      expect(result.category).toBe('Underweight');
      
      // Implementation calculates weight to gain to reach BMI of 18.5
      const targetWeight = 18.5 * (1.75 * 1.75);
      const expectedWeightToChange = (targetWeight - 53).toFixed(2);
      expect(result.weightToChange).toBe(expectedWeightToChange);
    });

    // Test for normal weight category (18.5 <= BMI < 24.9)
    test('should return normal weight category when BMI is between 18.5 and 24.9', () => {
      // 65kg and 1.7m height gives a BMI of about 22.5 (normal)
      const result = calculateBMI(65, 1.7);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(22.5, 1);
      expect(result.category).toBe('Normal weight');
      expect(result.weightToChange).toBe("0.00"); // No weight change needed
    });

    // Test for edge case - exact lower bound of normal weight
    test('should return normal weight category at exact lower bound (BMI = 18.5)', () => {
      // Calculate weight for BMI exactly 18.5 at 1.75m height
      const weight = 18.5 * (1.75 * 1.75);
      const result = calculateBMI(weight, 1.75);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(18.5, 1);
      expect(result.category).toBe('Normal weight');
      expect(result.weightToChange).toBe("0.00"); // No weight change needed
    });

    // Test for edge case - approaching upper bound of normal weight
    test('should return normal weight category approaching upper bound (BMI = 24.9)', () => {
      // Calculate weight for BMI of 24.8 which is just below the upper bound of normal weight
      // This avoids floating-point precision issues that might push it into the overweight category
      const weight = 24.8 * (1.75 * 1.75);
      const result = calculateBMI(weight, 1.75);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(24.8, 1);
      expect(result.category).toBe('Normal weight');
      expect(result.weightToChange).toBe("0.00"); // No weight change needed
    });

    // Test for overweight category (25 <= BMI < 29.9)
    test('should return overweight category when BMI is between 25 and 29.9', () => {
      // 85kg and 1.7m height gives a BMI of about 29.4 (overweight)
      const result = calculateBMI(85, 1.7);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(29.4, 1);
      expect(result.category).toBe('Overweight');
      
      // Implementation calculates weight to lose to reach BMI of 24.9
      const targetWeight = 24.9 * (1.7 * 1.7);
      const expectedWeightToChange = (85 - targetWeight).toFixed(2);
      expect(result.weightToChange).toBe(expectedWeightToChange);
    });

    // Test for edge case - exact lower bound of overweight
    test('should return overweight category at exact lower bound (BMI = 25)', () => {
      // Calculate weight for BMI exactly 25 at 1.75m height
      const weight = 25 * (1.75 * 1.75);
      const result = calculateBMI(weight, 1.75);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(25, 1);
      expect(result.category).toBe('Overweight');
      
      // Implementation calculates weight to lose to reach BMI of 24.9
      const targetWeight = 24.9 * (1.75 * 1.75);
      const expectedWeightToChange = (weight - targetWeight).toFixed(2);
      expect(result.weightToChange).toBe(expectedWeightToChange);
    });

    // Test for obesity category (BMI >= 30)
    test('should return obesity category when BMI is 30 or greater', () => {
      // 95kg and 1.7m height gives a BMI of about 32.9 (obesity)
      const result = calculateBMI(95, 1.7);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(32.9, 1);
      expect(result.category).toBe('Obesity');
      
      // Implementation calculates weight to lose to reach BMI of 24.9
      const targetWeight = 24.9 * (1.7 * 1.7);
      const expectedWeightToChange = (95 - targetWeight).toFixed(2);
      expect(result.weightToChange).toBe(expectedWeightToChange);
    });

    // Test for edge case - exact lower bound of obesity
    test('should return obesity category at exact lower bound (BMI = 30)', () => {
      // Calculate weight for BMI exactly 30 at 1.75m height
      const weight = 30 * (1.75 * 1.75);
      const result = calculateBMI(weight, 1.75);
      
      expect(parseFloat(result.bmi)).toBeCloseTo(30, 1);
      expect(result.category).toBe('Obesity');
      
      // Implementation calculates weight to lose to reach BMI of 24.9
      const targetWeight = 24.9 * (1.75 * 1.75);
      const expectedWeightToChange = (weight - targetWeight).toFixed(2);
      expect(result.weightToChange).toBe(expectedWeightToChange);
    });

    // Test precision of returned values
    test('should return values with 2 decimal places', () => {
      const result = calculateBMI(70, 1.75);
      
      // Check that the returned bmi is a string with 2 decimal places
      expect(result.bmi).toMatch(/^\d+\.\d{2}$/);
      
      // Check that the returned weightToChange is a string with 2 decimal places
      expect(result.weightToChange).toMatch(/^\d+\.\d{2}$/);
    });
  });
});
