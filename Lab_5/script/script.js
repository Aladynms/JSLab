const asyncAdd = async (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      return Promise.reject('Argumenty muszą mieć typ number!');
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(a + b);
      }, 100);
    });
  }
  
  const addNumbers = async (...numbers) => {
    if (numbers.length === 0) return 0;
    if (numbers.length === 1) return numbers[0];
  
    const promises = [];
  
    for (let i = 0; i < numbers.length; i += 2) {
      if (i + 1 < numbers.length) {
        promises.push(asyncAdd(numbers[i], numbers[i + 1]));
      } else {
        promises.push(Promise.resolve(numbers[i]));
      }
    }
  
    const results = await Promise.all(promises);
  
    return addNumbers(...results);
  }
  
  const measureExecutionTime = async (func, ...args) => {
    const start = performance.now();
    const result = await func(...args);
    const end = performance.now();
    return { result, time: end - start };
  }
  
  const generateNumbers = (count) => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
  }
  
  const numbers = generateNumbers(100);
  
  measureExecutionTime(addNumbers, ...numbers).then(({ result, time }) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <p>Wynik dodawania: ${result}</p>
      <p>Czas wykonania: ${time.toFixed(2)} ms</p>
      <p>Ilość operacji asynchronicznych: ${numbers.length - 1}</p>
    `;
  });
  