import './style.css'

const contentfulClient = contentful.createClient({
  accessToken: 'v6TA_fe11aip9-A7IUBMg-5_j9mBWtNF9qOqUMDkmRc',
  space: 'm014an19zign'
});

contentfulClient.getEntries({
  content_type: 'audioApp'
})
.then((entries) => {
  const data = entries.items.map((entry) => {
    return {
      audio_src: entry.fields.audioFile?.fields?.file.url,
      image_src: entry.fields.imageSource?.fields?.file.url
    }
  });

  data.map((item, index) => {
    const songContainer = document.querySelector('.song-container');
    const songItem = document.createElement('div');
    songItem.classList.add('song-item');
    songItem.innerHTML = `
      <img class="image" src="${item.image_src}" alt="">
      <audio class="audio-file" src="${item.audio_src}"></audio>
      <button class="toggle-play"></button>
      <input id=${index} type="range" min="0" max="100" class="volume-slider" value="100">
    `
    songContainer.appendChild(songItem);
  })
})
.then(() => {
  playAudio();
})

// Play audio
function playAudio() {
  const c = {
    dom: {
      toggle_play: 'toggle-play',
      volume_slider: 'volume-slider',
      song_item: 'song-item',
      audio_file: 'audio-file',
    },
    cls: {
      active: 'active',
    }
  };

  // Globals
  const togglePlay = document.querySelectorAll(`.${c.dom.toggle_play}`);
  const slider = document.querySelectorAll(`.${c.dom.volume_slider}`);
  let currentAudio = null;

  togglePlay.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const parentWrapper = e.target.closest(`.${c.dom.song_item}`);
      const currentSong = parentWrapper.querySelector(`.${c.dom.audio_file}`);
      
      // Pause the currently playing audio
      if (currentAudio && currentAudio !== currentSong) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      // Toggle play/pause for the clicked song
      if (currentSong.paused) {
        currentSong.play();
        currentSong.loop = true;
      } else {
        currentSong.pause();
      }

      // Set the current audio to the clicked song
      currentAudio = currentSong;

      // hide all volume sliders except the current one
      slider.forEach((slide) => {
        slide.classList.remove(c.cls.active);
      })

      // Current colume slider
      const currentVolumeSlider = parentWrapper.querySelector(`.${c.dom.volume_slider}`);
      currentVolumeSlider.classList.add(c.cls.active);

      // Volume slider
      slider.forEach((slide) => {
        slide.oninput = () => {
          currentAudio.volume = slide.value / 100;
        };
      });
    });
  });

  // Mouse move effect
  togglePlay.forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    })
  })
}