// Функция для отображения формы в зависимости от выбора
function showForm() {
    const position = document.getElementById('position').value;
    const gangForm = document.getElementById('gang-form');
    const parkenForm = document.getElementById('parken-form');

    if (position === 'G') {
        gangForm.style.display = 'block';
        parkenForm.style.display = 'none';
    } else if (position === 'P') {
        parkenForm.style.display = 'block';
        gangForm.style.display = 'none';

        // Добавляем обработчик события для поля веса поезда для П
        const trainWeightP = document.getElementById('trainWeightP');
        enableFirstFiveFields(trainWeightP);  // Убедимся, что поля правильные при загрузке формы
    } else {
        gangForm.style.display = 'none';
        parkenForm.style.display = 'none';
    }
}

// Функция для включения полей первых 5 вагонов, если вес поезда больше 1200 тонн
function enableFirstFiveFields(trainWeightP) {
    const firstFiveWeight = document.getElementById('firstFiveWeight');
    const firstFiveBrakeWeight = document.getElementById('firstFiveBrakeWeight');

    // Добавляем событие input на поле для веса поезда
    trainWeightP.addEventListener('input', function() {
        const weight = parseFloat(trainWeightP.value);
        if (weight > 1200) {
            firstFiveWeight.disabled = false;
            firstFiveBrakeWeight.disabled = false;
        } else {
            firstFiveWeight.disabled = true;
            firstFiveBrakeWeight.disabled = true;
        }
    });
}

// Функция для расчета для положения Г (Gang)
function calculateBrakeForceG() {
    const trainLength = parseFloat(document.getElementById('trainLength').value);
    const trainWeight = parseFloat(document.getElementById('trainWeight').value);
    let trainBrakeWeight = parseFloat(document.getElementById('trainBrakeWeight').value);
    const locomotiveWeight = parseFloat(document.getElementById('locomotiveWeight').value);
    let locomotiveBrakeWeight = parseFloat(document.getElementById('locomotiveBrakeWeight').value);
    const minBrakePercentage = parseFloat(document.getElementById('minBrakePercentage').value);

    if (isNaN(trainLength) || isNaN(trainWeight) || isNaN(trainBrakeWeight) || isNaN(locomotiveWeight) || isNaN(locomotiveBrakeWeight) || isNaN(minBrakePercentage)) {
        alert("Bitte geben Sie gültige Werte ein!");
        return;
    }

    let totalWeight = trainWeight + locomotiveWeight;
    let totalBrakeWeight = trainBrakeWeight + locomotiveBrakeWeight;

    let result = '';

    // Проверяем, нужно ли переводить локомотив в положение Г
    if (trainWeight > 800 && trainWeight < 1201) {
        // Локомотив переводим в положение Г
        result = 'Triebfahrzeug muss im G-Stellung sein<br>';
        locomotiveBrakeWeight *= 0.75;  // Уменьшаем тормозной вес локомотива на 25%
        totalBrakeWeight = locomotiveBrakeWeight + trainBrakeWeight;  // Обновляем общий тормозной вес
        result += 'Bremsgewicht des Triebfahrzeugs wurde um 25% reduziert<br>';
    }

    // Если длина поезда больше 700 метров, уменьшаем тормозной вес на 5% для всего состава
    if (trainLength > 700) {
        result += 'Bremsgewicht für den gesamten Zug wurde um 5% reduziert<br>';
        totalBrakeWeight = Math.floor(totalBrakeWeight * 0.95);  // Уменьшаем тормозной вес на 5%
    }

    // Рассчитываем тормозной процент
    let brakePercentage = Math.floor((totalBrakeWeight * 100) / totalWeight);  // Округляем до целых в меньшую сторону

    // Выводим результат
    displayResult(brakePercentage, totalWeight, totalBrakeWeight, minBrakePercentage, result);
}

// Функция для расчета для положения П (Parken)
function calculateBrakeForceP() {
    const trainWeight = parseFloat(document.getElementById('trainWeightP').value);
    const locomotiveWeight = parseFloat(document.getElementById('locomotiveWeightP').value);
    let locomotiveBrakeWeight = parseFloat(document.getElementById('locomotiveBrakeWeightP').value);
    const firstFiveWeight = parseFloat(document.getElementById('firstFiveWeight').value) || 0; // Если поле пустое, то 0
    let firstFiveBrakeWeight = parseFloat(document.getElementById('firstFiveBrakeWeight').value) || 0; // Если поле пустое, то 0
    const remainingWeight = parseFloat(document.getElementById('remainingWeight').value);
    let remainingBrakeWeight = parseFloat(document.getElementById('remainingBrakeWeight').value);
    const trainLength = parseFloat(document.getElementById('trainLengthP').value);
    const minBrakePercentage = parseFloat(document.getElementById('minBrakePercentageP').value);

    if (isNaN(trainWeight) || isNaN(locomotiveWeight) || isNaN(locomotiveBrakeWeight) || isNaN(remainingWeight) || isNaN(remainingBrakeWeight) || isNaN(trainLength) || isNaN(minBrakePercentage)) {
        alert("Bitte geben Sie gültige Werte ein!");
        return;
    }

    let totalWeight = trainWeight + locomotiveWeight;
    let totalBrakeWeight = 0;

    let result = '';

    // Проверяем условия для положения П
    if (trainWeight > 800 && trainWeight < 1201) {
        result = 'Triebfahrzeug muss im G-Stellung sein<br>';
        locomotiveBrakeWeight = Math.floor(locomotiveBrakeWeight * 0.75);
        result += 'Bremsgewicht des Triebfahrzeugs wurde um 25% reduziert<br>';
    } else if (trainWeight > 1200) {
        result = 'Triebfahrzeug und erste 5 Fahrzeuge müssen im G-Stellung sein<br>';
        locomotiveBrakeWeight = Math.floor(locomotiveBrakeWeight * 0.75);
        firstFiveBrakeWeight = Math.floor(firstFiveBrakeWeight * 0.75);
        result += 'Bremsgewicht des Triebfahrzeugs und der ersten 5 Fahrzeuge wurde um 25% reduziert<br>';
    }

    // Учитываем длину поезда
    if (trainLength >= 501 && trainLength < 601) {
        result += 'Bremsgewicht für Fahrzeuge im P-Stellung -5%<br>';
        remainingBrakeWeight = Math.floor(remainingBrakeWeight * 0.95);  // Уменьшаем тормозной вес поезда в П на 5%
    } else if (trainLength >= 601 && trainLength < 701) {
        result += 'Bremsgewicht für Fahrzeuge im P-Stellung -10%<br>';
        remainingBrakeWeight = Math.floor(remainingBrakeWeight * 0.90);  // Уменьшаем тормозной вес поезда в П на 10%
    } else if (trainLength >= 701) {
        result += 'Bremsgewicht für Fahrzeuge im P-Stellung -19%<br>';
        remainingBrakeWeight = Math.floor(remainingBrakeWeight * 0.81); // Уменьшаем тормозной вес поезда в П на 19%
        if (trainWeight > 1200) {
            result += 'Bremsgewicht für Fahrzeuge im G-Stellung zusätzlich um 5% reduziert<br>';
            locomotiveBrakeWeight = Math.floor(locomotiveBrakeWeight * 0.75);  // Дополнительно уменьшаем тормозной вес локомотива в Г
        }
    }

    totalBrakeWeight = locomotiveBrakeWeight + firstFiveBrakeWeight + remainingBrakeWeight;


    // Рассчитываем тормозной процент
    let brakePercentage = Math.floor((totalBrakeWeight * 100) / totalWeight);

    // Выводим результат
    displayResult(brakePercentage, totalWeight, totalBrakeWeight, minBrakePercentage, result);
}

// Функция для отображения результатов
function displayResult(brakePercentage, totalWeight, totalBrakeWeight, minBrakePercentage, result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Gesamtgewicht des Zuges: ${totalWeight} Tonnen</p>
        <p>Gesamtbremsgewicht: ${totalBrakeWeight} Tonnen</p>
        <p>Mindesthundertstel: ${minBrakePercentage}%</p>
        ${result}
        <p class="${brakePercentage >= minBrakePercentage ? 'success' : 'error'}">Berechnete Bremskraft: ${brakePercentage}%</p>
    `;
}

// Функция для очистки данных
function resetForm() {
    // Очищаем все поля формы
    const formElements = document.querySelectorAll('input, select');
    formElements.forEach(element => {
        element.value = '';  // Очищаем значения всех полей
    });

    // Очищаем результат
    document.getElementById('result').innerHTML = '';

    // Скрываем форму для расчета
    const gangForm = document.getElementById('gang-form');
    gangForm.style.display = 'none';

    const parkenForm = document.getElementById('parken-form');
    parkenForm.style.display = 'none';

    // Сбрасываем выбранное положение в "Bitte wählen"
    document.getElementById('position').value = '';
}
