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
  
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.style.display = 'block';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
      });
    });
  });
  