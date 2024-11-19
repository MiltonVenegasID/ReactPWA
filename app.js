window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const homeScreen = document.getElementById('home-screen');
  
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      homeScreen.classList.remove('hidden');
    }, 3000); 
  });
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').then(() => {
        console.log('Service Worker registrado');
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
  
    tareas.forEach((tarea, index) => {
      const tareaElem = document.createElement('div');
      tareaElem.textContent = `${index + 1}. ${tarea}`;
      app.appendChild(tareaElem);
    });
  
    const input = document.createElement('input');
    input.placeholder = 'Nueva tarea...';
    app.appendChild(input);
  
    const button = document.createElement('button');
    button.textContent = 'Agregar';
    button.onclick = () => {
      tareas.push(input.value);
      localStorage.setItem('tareas', JSON.stringify(tareas));
      location.reload();
    };
    app.appendChild(button);
  });
  