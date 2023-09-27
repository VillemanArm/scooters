function animate({ timing, draw, duration }) {
  // функция подключает анимацию, выполняющуюся по заданной временной функции, которую мы можем написать сами.
  // подробности на сайте https://learn.javascript.ru/js-animation

  let start = performance.now();

  requestAnimationFrame(function animate(time) {
    // timeFraction изменяется от 0 до 1
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    // вычисление текущего состояния анимации
    let progress = timing(timeFraction);

    draw(progress); // отрисовать её

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }

    // подключение:
    //   animate({
    //     duration: 1000,
    //     timing(timeFraction) {
    //       return timeFraction;
    //     },
    //     draw(progress) {
    //       elem.style.width = progress * 100 + '%';
    //     }
    //   });
  });
}

const digits = /[^\d]/g
const cyrillic = /[^а-я -]/gi
const email = /[^\w\d@-_\.\!\~\*\']/gi
const phone = /[^\d()-]/gi


const addValidaton = (input, regExp) => {
  input.addEventListener('input', (event) => {
    input.value = input.value.replace(regExp, '')
  })
}

const debounce = (func, ms = 300) => {
  // функция замедляет запросы к серверу, чтобы они происходили на вводе не каждой буквы
  // пример использования:
  //   const debounceSearch = debounce(() => {
  //     userService.getData(url, `?name_like=${input.value}`).then(users => {
  //         render(users)
  //         debounce()
  //     })
  // }, 400)
  let timer

  return (...args) => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args) // возвращаем функцию, привязанную к контексту вызова
    }, ms)

  }
}

const saveInFile = (text, fileName = 'file', fileType = 'text/plain') => {
  // функция сохраняет текст в текстовый файл. Mожет работать с txt и json. Объект надо предварительно конвертировать в строку.
  const blob = new Blob([text], { type: fileType }) // application/json text/plain
  const link = document.createElement("a")

  link.setAttribute('href', URL.createObjectURL(blob))
  link.setAttribute('download', fileName)
  link.click()

}

const getData = (url, requestParameters = '') => {
  // функция отправляет GET запрос и возвращает данные
  return fetch(`${url}${requestParameters}`).then(response => response.json())
}

const changeData = (url, method, requestParameters = '', data = {}) => {
  // функция отправляет все запросы кроме GET
  if (method !== 'DELETE') {
    return fetch(`${url}${requestParameters}`, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.json())
  } else {
    return fetch(`${url}${requestParameters}`, {
      method: method,
    }).then(response => response.json())
  }
}


export { animate, addValidaton, debounce, saveInFile, getData, changeData }