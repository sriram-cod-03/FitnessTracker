export const calculateBMR = (profile) => {
  const { weight, height, age, gender } = profile;

  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export const calculateMacros = (tdee, goal, weight) => {
  let calories =
    goal === "cut"
      ? tdee - 400
      : goal === "bulk"
      ? tdee + 300
      : tdee;

  const protein = Math.round(weight * 2);
  const fats = Math.round((calories * 0.25) / 9);
  const carbs = Math.round(
    (calories - (protein * 4 + fats * 9)) / 4
  );

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
    fiber: 30,
  };
};
