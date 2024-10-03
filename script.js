// script.js

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('tr-TR', options);
  document.getElementById('current-date').textContent = formattedDate;

  fetch('https://raw.githubusercontent.com/HaytHuyt/tv/refs/heads/main/channels.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('data-container');

      data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        const time = document.createElement('h3');
        time.textContent = item.time;

        // Alarm ikonu ekle ve başta inaktif yap
        const alarmIcon = document.createElement('i');
        alarmIcon.className = 'fas fa-bell alarm-icon inactive';

        alarmIcon.addEventListener('click', () => {
          if (!alarmIcon.classList.contains('active')) {
            setAlarm(item.time, alarmIcon, index);
          } else {
            cancelAlarm(alarmIcon, index, item.time);
          }
        });

        time.appendChild(alarmIcon);

        const name = document.createElement('h4');
        name.textContent = item.name;

        const text = document.createElement('p');
        text.textContent = item.text;

        card.appendChild(time);
        card.appendChild(name);
        card.appendChild(text);

        container.appendChild(card);
      });
    })
    .catch(error => console.error('Hata:', error));
});

const alarmTimers = {};

function setAlarm(timeString, alarmIcon, index) {
  const matchTime = parseTime(timeString);
  const alarmTime = new Date(matchTime.getTime() - 10 * 60 * 1000);
  const now = new Date();
  const timeUntilAlarm = alarmTime - now;

  if (timeUntilAlarm > 0) {
    alert('Alarm kuruldu! Saat ' + timeString + ' için 10 dakika önce uyarılacaksınız.');

    alarmIcon.classList.remove('inactive');
    alarmIcon.classList.add('active');

    const timerId = setTimeout(() => {
      playAlarm();
      cancelAlarm(alarmIcon, index, timeString);
    }, timeUntilAlarm);

    alarmTimers[timeString] = timerId;
  } else {
    alert('Bu maç için alarm kurmak artık mümkün değil.');
  }
}

function cancelAlarm(alarmIcon, index, timeString) {
  clearTimeout(alarmTimers[timeString]);
  delete alarmTimers[timeString];

  alarmIcon.classList.remove('active');
  alarmIcon.classList.add('inactive');

  alert('Alarm iptal edildi.');
}

function parseTime(timeString) {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

function playAlarm() {
  const alarmSound = document.getElementById('alarm-sound');
  alarmSound.play();
  alert('Maç başlamak üzere! 10 dakika kaldı.');
}
